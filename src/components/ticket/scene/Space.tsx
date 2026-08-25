import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { beat, easeInOutCubic } from "@/lib/ticket/beats";
import type { QualitySettings } from "@/lib/ticket/quality";
import { useSequence } from "./sequence";

const BAKE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Baked once into an equirectangular texture at startup rather than evaluated per pixel per frame.
 * The fbm below costs 120 hash evaluations per pixel, and the skydome covers the whole screen --
 * and it was being re-rendered for every transmission pass as well as the main pass, so it
 * dominated the frame. Baked, it costs one texture fetch.
 */
const BAKE_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uDeep;
  uniform vec3 uIndigo;
  uniform vec3 uViolet;
  uniform vec3 uEmber;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Equirectangular: UV back to a direction on the sphere, matching SphereGeometry's own UVs.
    float phi = vUv.x * 6.2831853;
    float theta = (1.0 - vUv.y) * 3.1415927;
    vec3 d = normalize(vec3(
      sin(theta) * cos(phi),
      cos(theta),
      sin(theta) * sin(phi)
    ));

    float base = fbm(d * 1.6);
    float bands = fbm(d * 3.4);
    float wisps = fbm(d * 7.0);

    vec3 col = uDeep;
    col = mix(col, uIndigo, smoothstep(0.35, 0.85, base));
    col = mix(col, uViolet, smoothstep(0.45, 0.95, base * bands * 1.9));
    col += uEmber * pow(max(wisps - 0.55, 0.0), 2.0) * 0.5;

    // Darken toward the bottom of the dome so the ticket reads against a clean field.
    col *= mix(0.45, 1.0, smoothstep(-0.85, 0.25, d.y));

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Renders the noise once into an offscreen target and hands back the resulting texture. */
function bakeNebula(
  gl: THREE.WebGLRenderer,
  width: number,
): THREE.WebGLRenderTarget {
  const target = new THREE.WebGLRenderTarget(width, width / 2, {
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
    colorSpace: THREE.SRGBColorSpace,
  });

  const material = new THREE.ShaderMaterial({
    vertexShader: BAKE_VERT,
    fragmentShader: BAKE_FRAG,
    uniforms: {
      uDeep: { value: new THREE.Color("#03020a") },
      uIndigo: { value: new THREE.Color("#160f3a") },
      uViolet: { value: new THREE.Color("#3d2170") },
      uEmber: { value: new THREE.Color("#4a3a8f") },
    },
    depthTest: false,
    depthWrite: false,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const previous = gl.getRenderTarget();
  gl.setRenderTarget(target);
  gl.render(scene, camera);
  gl.setRenderTarget(previous);

  geometry.dispose();
  material.dispose();
  return target;
}

function Nebula({ resolution }: { resolution: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const target = useRef<THREE.WebGLRenderTarget | null>(null);

  useEffect(() => {
    return () => {
      target.current?.dispose();
      target.current = null;
    };
  }, []);

  useFrame(({ gl }, dt) => {
    // Baked on the first frame rather than during render, so nothing impure happens in the render
    // phase and the renderer is guaranteed to exist.
    if (!target.current && material.current) {
      target.current = bakeNebula(gl, resolution);
      material.current.map = target.current.texture;
      // The colour tint multiplies the map, so the near-black pre-bake fallback has to go white
      // or it flattens the whole nebula back to black.
      material.current.color.set("#ffffff");
      material.current.needsUpdate = true;
    }
    // The noise no longer evolves over time, so the drift comes from turning the dome instead.
    if (mesh.current) mesh.current.rotation.y += dt * 0.004;
  });

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <sphereGeometry args={[60, 48, 32]} />
      <meshBasicMaterial
        ref={material}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
        color="#03020a"
      />
    </mesh>
  );
}

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute vec3 aColor;
  varying float vSeed;
  varying vec3 vColor;
  uniform float uPixelRatio;
  void main() {
    vSeed = aSeed;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (140.0 / max(-mv.z, 0.001));
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAG = /* glsl */ `
  varying float vSeed;
  varying vec3 vColor;
  uniform float uTime;
  uniform float uOpacity;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float twinkle = 0.72 + 0.28 * sin(uTime * (0.6 + vSeed * 1.7) + vSeed * 40.0);
    gl_FragColor = vec4(vColor * twinkle, core * core * uOpacity);
    #include <colorspace_fragment>
  }
`;

/** Seeded so star placement is pure and identical across renders, remounts and reloads. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type FieldProps = {
  seed: number;
  count: number;
  radius: number;
  depth: number;
  sizeRange: [number, number];
  palette: string[];
  opacity: number;
  /** How far this layer translates per unit of camera descent. Higher reads as nearer. */
  parallax: number;
  drift: number;
};

function StarField({
  seed,
  count,
  radius,
  depth,
  sizeRange,
  palette,
  opacity,
  parallax,
  drift,
}: FieldProps) {
  const group = useRef<THREE.Group>(null);
  const sequence = useSequence();

  const { positions, sizes, seeds, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const colorObjects = palette.map((c) => new THREE.Color(c));
    const rand = mulberry32(seed);

    for (let i = 0; i < count; i++) {
      // Distributed in a slab rather than a shell so the descent moves through them.
      const a = rand() * Math.PI * 2;
      const r = radius * Math.sqrt(rand());
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (rand() - 0.5) * radius * 1.4;
      positions[i * 3 + 2] = -rand() * depth;

      sizes[i] = sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0]);
      seeds[i] = rand();

      const c = colorObjects[(rand() * colorObjects.length) | 0];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, sizes, seeds, colors };
  }, [seed, count, radius, depth, sizeRange, palette]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uPixelRatio: {
        value: typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio, 2),
      },
    }),
    [opacity],
  );

  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (!group.current) return;
    const p = sequence.p;
    const descent = easeInOutCubic(beat(p, "descent"));
    group.current.position.y = descent * parallax;
    group.current.rotation.z += dt * drift;
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={STAR_VERT}
          fragmentShader={STAR_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

// Hoisted so the buffer useMemo is not invalidated by a fresh array reference every render.
const MID_PALETTE = ["#ffffff", "#cfd8ff", "#ffe9c9", "#b8c6ff"];
const NEAR_PALETTE = ["#ffd9a8", "#cbd8ff", "#ffffff"];
const MID_SIZES: [number, number] = [0.35, 1.5];
const NEAR_SIZES: [number, number] = [2.2, 6.5];

export function Space({ quality }: { quality: QualitySettings }) {
  return (
    <>
      <Nebula resolution={quality.nebulaResolution} />
      <StarField
        seed={20260806}
        count={quality.midStars}
        radius={34}
        depth={38}
        sizeRange={MID_SIZES}
        palette={MID_PALETTE}
        opacity={0.95}
        parallax={1.6}
        drift={0.004}
      />
      <StarField
        seed={77712}
        count={quality.nearMotes}
        radius={11}
        depth={9}
        sizeRange={NEAR_SIZES}
        palette={NEAR_PALETTE}
        opacity={0.22}
        parallax={5.2}
        drift={-0.012}
      />
    </>
  );
}
