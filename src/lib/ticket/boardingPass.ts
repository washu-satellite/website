/**
 * Draws the downloadable boarding pass. Canvas rather than DOM-to-image because the file people
 * keep has to look identical everywhere, and a screenshot of the page would inherit whatever theme,
 * font fallback and device pixel ratio the visitor happened to have.
 *
 * Deliberately not themed. The pass is an artifact that leaves the site, so it carries one fixed
 * look in both light and dark mode rather than shipping two different souvenirs.
 */

export const PASS_W = 2000;
export const PASS_H = 1000;

/** Where the stub begins. Matches the perforation and every stub-side x below. */
const STUB_X = Math.round(PASS_W * 0.72);

const INK = "#0a0a0d";
const INK_SOFT = "#111116";
const CRIMSON = "#b3281e";
const PAPER = "#f2f1ef";
const MUTED = "#8a8a96";
const HAIRLINE = "rgba(255,255,255,0.14)";

const SANS = '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export type BoardingPass = {
  passenger: string;
  /** Stable per passenger so a re-download is byte-identical to the first one. */
  manifestId: string;
  /** Deliberately imprecise. We do not publish a launch month for SCALAR. */
  window: string;
};

/**
 * FNV-1a. Any stable hash works; this one is short, dependency-free, and gives a well-mixed 32-bit
 * value from a name, which is all the manifest ID and the barcode need.
 */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Ambiguous glyphs removed so someone reading the ID off a screenshot cannot mistype it. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function manifestIdFor(name: string): string {
  let value = hash(name.trim().toLowerCase());
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += ALPHABET[value % ALPHABET.length];
    value = Math.floor(value / ALPHABET.length) + 7;
  }
  return `SCL-${out}`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Letter-spacing has no canvas equivalent, so tracked text is laid out a glyph at a time. */
function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  tracking: number,
  weight = 500,
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${MONO}`;
  ctx.textBaseline = "alphabetic";
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
  ctx.restore();
}

function trackedWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  size: number,
  tracking: number,
  weight = 500,
): number {
  ctx.save();
  ctx.font = `${weight} ${size}px ${MONO}`;
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + tracking;
  ctx.restore();
  return w - tracking;
}

function field(
  ctx: CanvasRenderingContext2D,
  key: string,
  value: string,
  x: number,
  y: number,
) {
  tracked(ctx, key, x, y, 20, MUTED, 4);
  ctx.save();
  ctx.fillStyle = PAPER;
  ctx.font = `600 40px ${MONO}`;
  ctx.fillText(value, x, y + 52);
  ctx.restore();
}

/**
 * A 1U cube in isometric wireframe, drawn rather than loaded. An <img> would have to finish
 * decoding before the export, which turns a synchronous draw into a race the download can lose.
 */
function cubeWireframe(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
) {
  const dx = size * 0.5;
  const dy = size * 0.28;
  const h = size * 0.62;

  const top: [number, number][] = [
    [cx, cy - dy - h / 2],
    [cx + dx, cy - h / 2],
    [cx, cy + dy - h / 2],
    [cx - dx, cy - h / 2],
  ];
  const bottom: [number, number][] = top.map(([x, y]) => [x, y + h]);

  ctx.save();
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";

  // Deployed panels. Without them the isometric box reads as a plain hexagon at this size, which is
  // the one thing the drawing exists not to look like.
  ctx.strokeStyle = "rgba(179,40,30,0.55)";
  ctx.lineWidth = 2.5;
  for (const dir of [-1, 1]) {
    const rootTop: [number, number] = [cx + dir * dx, cy - h / 2];
    const span = size * 0.78;
    const tipTop: [number, number] = [rootTop[0] + dir * span, rootTop[1] - size * 0.1];
    ctx.beginPath();
    ctx.moveTo(rootTop[0], rootTop[1]);
    ctx.lineTo(tipTop[0], tipTop[1]);
    ctx.lineTo(tipTop[0], tipTop[1] + h * 0.42);
    ctx.lineTo(rootTop[0], rootTop[1] + h * 0.42);
    ctx.closePath();
    ctx.stroke();
    for (let i = 1; i <= 2; i += 1) {
      const t = i / 3;
      ctx.beginPath();
      ctx.moveTo(rootTop[0] + (tipTop[0] - rootTop[0]) * t, rootTop[1] + (tipTop[1] - rootTop[1]) * t);
      ctx.lineTo(
        rootTop[0] + (tipTop[0] - rootTop[0]) * t,
        rootTop[1] + (tipTop[1] - rootTop[1]) * t + h * 0.42,
      );
      ctx.stroke();
    }
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(242,241,239,0.42)";
  for (const face of [top, bottom]) {
    ctx.beginPath();
    face.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath();
    ctx.stroke();
  }
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(top[i][0], top[i][1]);
    ctx.lineTo(bottom[i][0], bottom[i][1]);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(242,241,239,0.18)";
  ctx.lineWidth = 2;
  for (let i = 1; i <= 3; i += 1) {
    const t = i / 4;
    ctx.beginPath();
    ctx.moveTo(top[1][0] + (top[2][0] - top[1][0]) * t, top[1][1] + (top[2][1] - top[1][1]) * t);
    ctx.lineTo(
      bottom[1][0] + (bottom[2][0] - bottom[1][0]) * t,
      bottom[1][1] + (bottom[2][1] - bottom[1][1]) * t,
    );
    ctx.stroke();
  }
  ctx.restore();
}

function starfield(ctx: CanvasRenderingContext2D, seed: number) {
  ctx.save();
  let s = seed;
  const rand = () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    return s / 4294967296;
  };
  for (let i = 0; i < 140; i += 1) {
    const x = rand() * STUB_X;
    const y = rand() * PASS_H;
    const r = rand() * 1.6 + 0.4;
    ctx.fillStyle = `rgba(242,241,239,${(rand() * 0.28 + 0.05).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function barcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number,
) {
  ctx.save();
  ctx.fillStyle = "rgba(242,241,239,0.55)";
  let cx = x;
  let s = seed >>> 0;
  while (cx < x + w) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const bw = 3 + (s % 8);
    if ((s >> 5) % 4 !== 0) ctx.fillRect(cx, y, bw, h);
    cx += bw + 5;
  }
  ctx.restore();
}

export function drawBoardingPass(
  canvas: HTMLCanvasElement,
  { passenger, manifestId, window: launchWindow }: BoardingPass,
): void {
  canvas.width = PASS_W;
  canvas.height = PASS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(
      `drawBoardingPass: could not acquire a 2d canvas context for "${passenger}"`,
    );
  }

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, PASS_W, PASS_H);

  const wash = ctx.createLinearGradient(0, 0, PASS_W * 0.8, PASS_H);
  wash.addColorStop(0, "rgba(179,40,30,0.16)");
  wash.addColorStop(0.55, "rgba(179,40,30,0.02)");
  wash.addColorStop(1, "rgba(179,40,30,0)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, PASS_W, PASS_H);

  starfield(ctx, hash(manifestId));

  // Centred in the gap between the headline and the perforation. The deployed panels make the
  // drawing 2.56x its size argument wide, so it clears both edges by roughly 45px.
  cubeWireframe(ctx, STUB_X - 315, PASS_H * 0.34, 210);

  // Crimson rail down the left edge, the same device the rest of our print material uses.
  ctx.fillStyle = CRIMSON;
  ctx.fillRect(0, 0, 22, PASS_H);

  const PAD = 108;

  tracked(ctx, "WASHU SATELLITE", PAD, 108, 24, PAPER, 9, 600);
  const stampX = STUB_X - 90;
  const stampW = trackedWidth(ctx, "BOARDING PASS", 22, 8, 500);
  tracked(ctx, "BOARDING PASS", stampX - stampW, 108, 22, MUTED, 8);

  ctx.strokeStyle = HAIRLINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, 148);
  ctx.lineTo(STUB_X - 90, 148);
  ctx.stroke();

  ctx.save();
  ctx.fillStyle = PAPER;
  ctx.font = `800 116px ${SANS}`;
  ctx.fillText("ONE TICKET", PAD, 296);
  ctx.fillStyle = CRIMSON;
  ctx.fillText("TO SPACE", PAD, 416);
  ctx.restore();

  tracked(ctx, "PASSENGER", PAD, 520, 20, MUTED, 4);
  ctx.save();
  ctx.fillStyle = PAPER;
  // Long names shrink rather than wrap: the name is the whole point of the souvenir, so it must
  // stay on one line and inside the panel at any length the form allows.
  const room = STUB_X - 90 - PAD;
  let size = 84;
  ctx.font = `700 ${size}px ${SANS}`;
  const upper = passenger.toUpperCase();
  while (ctx.measureText(upper).width > room && size > 34) {
    size -= 2;
    ctx.font = `700 ${size}px ${SANS}`;
  }
  ctx.fillText(upper, PAD, 596);
  ctx.restore();

  ctx.strokeStyle = HAIRLINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, 648);
  ctx.lineTo(STUB_X - 90, 648);
  ctx.stroke();

  field(ctx, "MISSION", "SCALAR", PAD, 726);
  field(ctx, "VEHICLE", "1U CUBESAT", PAD + 380, 726);
  field(ctx, "WINDOW", launchWindow.toUpperCase(), PAD + 800, 726);

  tracked(ctx, "WASHUSATELLITE.COM", PAD, 900, 20, MUTED, 6);

  // Perforation.
  ctx.save();
  ctx.strokeStyle = "rgba(242,241,239,0.35)";
  ctx.lineWidth = 3;
  ctx.setLineDash([16, 18]);
  ctx.beginPath();
  ctx.moveTo(STUB_X, 0);
  ctx.lineTo(STUB_X, PASS_H);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = INK_SOFT;
  ctx.fillRect(STUB_X + 2, 0, PASS_W - STUB_X - 2, PASS_H);

  const stubPad = STUB_X + 78;
  tracked(ctx, "MANIFEST", stubPad, 108, 20, MUTED, 4);
  ctx.save();
  ctx.fillStyle = PAPER;
  ctx.font = `600 44px ${MONO}`;
  ctx.fillText(manifestId, stubPad, 164);
  ctx.restore();

  barcode(ctx, stubPad, 232, PASS_W - stubPad - 78, 300, hash(manifestId + passenger));

  ctx.strokeStyle = HAIRLINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(stubPad, 596);
  ctx.lineTo(PASS_W - 78, 596);
  ctx.stroke();

  tracked(ctx, "SEAT", stubPad, 664, 20, MUTED, 4);
  ctx.save();
  ctx.fillStyle = PAPER;
  ctx.font = `600 40px ${MONO}`;
  ctx.fillText("ORBIT", stubPad, 716);
  ctx.restore();

  ctx.save();
  roundRect(ctx, stubPad, 780, 250, 66, 8);
  ctx.strokeStyle = CRIMSON;
  ctx.lineWidth = 3;
  ctx.stroke();
  tracked(ctx, "CONFIRMED", stubPad + 26, 824, 24, CRIMSON, 6, 700);
  ctx.restore();

  tracked(ctx, "NON-TRANSFERABLE", stubPad, 908, 18, MUTED, 5);
}

/** Filenames people will find again in a Downloads folder six months from now. */
export function passFilename(passenger: string): string {
  const slug =
    passenger
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "passenger";
  return `washu-satellite-ticket-${slug}.png`;
}
