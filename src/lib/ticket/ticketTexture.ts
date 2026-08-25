import * as THREE from "three";

const W = 2048;
const H = 1024;
const STUB_X = W * 0.735;

const INK = "#050410";
const FOIL = "#f4c98a";
const FOIL_DIM = "#8d7350";
const PAPER = "#0c0a1c";
const HAIRLINE = "rgba(244, 201, 138, 0.28)";

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

function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  tracking = 6,
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `500 ${size}px ui-monospace, "SF Mono", Menlo, monospace`;
  ctx.textBaseline = "alphabetic";
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + tracking;
  }
  ctx.restore();
}

function field(
  ctx: CanvasRenderingContext2D,
  key: string,
  value: string,
  x: number,
  y: number,
) {
  label(ctx, key, x, y, 22, FOIL_DIM, 4);
  ctx.save();
  ctx.fillStyle = "#e8e6f5";
  ctx.font = `600 42px ui-monospace, "SF Mono", Menlo, monospace`;
  ctx.fillText(value, x, y + 52);
  ctx.restore();
}

function barcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number) {
  ctx.save();
  // Kept off pure white: bloom picks the barcode up as a blown-out slab otherwise.
  ctx.fillStyle = "#6c6a84";
  let cx = x;
  let s = seed;
  while (cx < x + w) {
    // Deterministic pseudo-random so the barcode does not flicker on texture regeneration.
    s = (s * 1103515245 + 12345) % 2147483648;
    const bw = 3 + (s % 9);
    if ((s >> 4) % 3 !== 0) ctx.fillRect(cx, y, bw, h);
    cx += bw + 5;
  }
  ctx.restore();
}

export type TicketFace = {
  passenger: string | null;
  confirmed: boolean;
};

/**
 * PLACEHOLDER COPY: seat, departure and gate values are invented. Rewrite them.
 */
export function drawTicketFace(
  canvas: HTMLCanvasElement,
  { passenger, confirmed }: TicketFace,
): void {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("drawTicketFace: could not acquire a 2d context on the ticket canvas");
  }

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#141133");
  bg.addColorStop(0.55, PAPER);
  bg.addColorStop(1, INK);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Foil sheen sweeping across the face, so pointer tilt has something to catch.
  const sheen = ctx.createLinearGradient(0, H, W, 0);
  sheen.addColorStop(0, "rgba(244,201,138,0)");
  sheen.addColorStop(0.45, "rgba(244,201,138,0.05)");
  sheen.addColorStop(0.52, "rgba(255,236,205,0.13)");
  sheen.addColorStop(0.6, "rgba(244,201,138,0.04)");
  sheen.addColorStop(1, "rgba(244,201,138,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = HAIRLINE;
  ctx.lineWidth = 3;
  roundRect(ctx, 26, 26, W - 52, H - 52, 34);
  ctx.stroke();

  label(ctx, "BOARDING PASS", 92, 118, 24, FOIL_DIM, 8);

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 128px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  ctx.fillText("1 TICKET", 88, 268);
  ctx.fillStyle = FOIL;
  ctx.fillText("TO SPACE", 88, 396);
  ctx.restore();

  ctx.strokeStyle = HAIRLINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(92, 456);
  ctx.lineTo(STUB_X - 90, 456);
  ctx.stroke();

  field(ctx, "SEAT", "01A", 92, 540);
  field(ctx, "DEPARTS", "SOON", 400, 540);
  field(ctx, "GATE", "∞", 760, 540);

  label(ctx, "PASSENGER", 92, 728, 22, FOIL_DIM, 4);
  ctx.save();
  if (passenger) {
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 76px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const name = passenger.length > 22 ? `${passenger.slice(0, 21)}…` : passenger;
    ctx.fillText(name.toUpperCase(), 92, 812);
  } else {
    ctx.strokeStyle = "rgba(232,230,245,0.25)";
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 12]);
    ctx.beginPath();
    ctx.moveTo(92, 812);
    ctx.lineTo(STUB_X - 120, 812);
    ctx.stroke();
  }
  ctx.restore();

  // Perforation.
  ctx.save();
  ctx.strokeStyle = "rgba(244,201,138,0.45)";
  ctx.lineWidth = 4;
  ctx.setLineDash([18, 20]);
  ctx.beginPath();
  ctx.moveTo(STUB_X, 40);
  ctx.lineTo(STUB_X, H - 40);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(STUB_X, 26, W - STUB_X - 26, H - 52);
  ctx.restore();

  ctx.save();
  ctx.translate(STUB_X + 96, H - 120);
  ctx.rotate(-Math.PI / 2);
  label(ctx, "NON-TRANSFERABLE", 0, 0, 22, FOIL_DIM, 7);
  ctx.restore();

  barcode(ctx, STUB_X + 150, 120, 320, 560, 7919);

  ctx.save();
  ctx.fillStyle = FOIL;
  ctx.font = `700 34px ui-monospace, "SF Mono", Menlo, monospace`;
  ctx.fillText("WU-SAT", STUB_X + 150, 760);
  ctx.restore();

  if (confirmed) {
    ctx.save();
    // Parked in the empty right half of the left panel, clear of the headline and the field rows.
    ctx.translate(W * 0.575, H * 0.42);
    ctx.rotate(-0.2);
    ctx.strokeStyle = "rgba(120, 240, 190, 0.85)";
    ctx.fillStyle = "rgba(120, 240, 190, 0.9)";
    ctx.lineWidth = 6;
    roundRect(ctx, -230, -66, 460, 132, 14);
    ctx.stroke();
    ctx.font = `800 74px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("CONFIRMED", 0, 30);
    ctx.restore();
  }
}

export function createTicketTexture(face: TicketFace): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  drawTicketFace(canvas, face);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
