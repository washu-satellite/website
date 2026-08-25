/**
 * Wraps a JPEG in a single-page PDF, by hand.
 *
 * The team asked for a PDF because that is what NASA hands out and what prints predictably. No PDF
 * library is a dependency here and adding one costs far more bundle than this needs: a pass is one
 * page holding one image, which is a PDF you can write literally. JPEG rather than PNG because
 * DCTDecode takes the encoded bytes as-is, whereas PNG would mean re-deflating the pixels with the
 * right predictor just to hand the viewer back what the canvas already produced.
 */

/** One page, sized to the image, so the ticket is the document rather than sitting on a letter sheet. */
const PAGE_W = 720;
const PAGE_H = 360;

function bytes(text: string): Uint8Array {
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) out[i] = text.charCodeAt(i) & 0xff;
  return out;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
}

/** Base64 data URL back to raw bytes; canvas hands us the former and DCTDecode wants the latter. */
function decodeDataUrl(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) {
    throw new Error("jpegToPdf: the canvas returned a data URL with no payload");
  }
  const binary = atob(dataUrl.slice(comma + 1));
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

export function jpegToPdf(
  jpegDataUrl: string,
  imageWidth: number,
  imageHeight: number,
): Blob {
  const jpeg = decodeDataUrl(jpegDataUrl);

  const objects: Uint8Array[] = [
    bytes("<< /Type /Catalog /Pages 2 0 R >>"),
    bytes("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    bytes(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`,
    ),
    // Draw the image across the whole page: scale, then paint the unit square Do maps onto.
    (() => {
      const stream = `q ${PAGE_W} 0 0 ${PAGE_H} 0 0 cm /Im0 Do Q`;
      return concat([
        bytes(`<< /Length ${stream.length} >>\nstream\n`),
        bytes(stream),
        bytes("\nendstream"),
      ]);
    })(),
    concat([
      bytes(
        `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} ` +
          `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
      ),
      jpeg,
      bytes("\nendstream"),
    ]),
  ];

  const header = bytes("%PDF-1.4\n");
  const chunks: Uint8Array[] = [header];
  const offsets: number[] = [];
  let offset = header.length;

  objects.forEach((body, index) => {
    offsets.push(offset);
    const open = bytes(`${index + 1} 0 obj\n`);
    const close = bytes("\nendobj\n");
    chunks.push(open, body, close);
    offset += open.length + body.length + close.length;
  });

  // Every xref entry is exactly 20 bytes, offset padded to 10 digits. Viewers reject anything else.
  const xrefAt = offset;
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    "0000000000 65535 f \n",
    ...offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`),
  ].join("");

  chunks.push(
    bytes(xref),
    bytes(
      `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`,
    ),
  );

  return new Blob([concat(chunks) as unknown as BlobPart], {
    type: "application/pdf",
  });
}
