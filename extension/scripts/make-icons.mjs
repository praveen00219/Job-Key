// Generates the extension's PNG icons (orange JobKey hexagon + keyhole)
// with zero dependencies: raw RGBA rasterization + a minimal PNG encoder.
// Run: node scripts/make-icons.mjs
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), "../icons");
mkdirSync(outDir, { recursive: true });

const ORANGE = [239, 108, 32, 255]; // #EF6C20
const WHITE = [255, 255, 255, 255];

function crc32(buf) {
  let c,
    table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // scanlines with filter byte 0
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function pointInPolygon(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const r = size * 0.48;
  // pointy-top hexagon
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return [cx + r * Math.cos(a), size / 2 + r * Math.sin(a)];
  });
  const keyholeR = size * 0.13;
  const keyholeCy = size * 0.4;
  const slot = [
    [cx - size * 0.075, size * 0.46],
    [cx + size * 0.075, size * 0.46],
    [cx + size * 0.12, size * 0.72],
    [cx - size * 0.12, size * 0.72],
  ];
  // 2x supersampling for smoother edges
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let hexHits = 0;
      let holeHits = 0;
      for (const [dx, dy] of [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]]) {
        const px = x + dx;
        const py = y + dy;
        if (pointInPolygon(px, py, hex)) {
          hexHits++;
          const inCircle = (px - cx) ** 2 + (py - keyholeCy) ** 2 <= keyholeR ** 2;
          if (inCircle || pointInPolygon(px, py, slot)) holeHits++;
        }
      }
      if (hexHits === 0) continue;
      const src = holeHits > hexHits / 2 ? WHITE : ORANGE;
      const alpha = Math.round((hexHits / 4) * src[3]);
      const o = (y * size + x) * 4;
      rgba[o] = src[0];
      rgba[o + 1] = src[1];
      rgba[o + 2] = src[2];
      rgba[o + 3] = alpha;
    }
  }
  return rgba;
}

for (const size of [16, 48, 128]) {
  writeFileSync(resolve(outDir, `icon${size}.png`), encodePng(size, drawIcon(size)));
  console.log(`icons/icon${size}.png`);
}
