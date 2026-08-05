// scripts/generate-og-image.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;

const gridLines = [
  ...Array.from({ length: 20 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${HEIGHT}" />`),
  ...Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="${WIDTH}" y2="${i * 60}" />`),
].join('');

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a14" />
      <stop offset="100%" stop-color="#1a142d" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b042ff" />
      <stop offset="100%" stop-color="#4287ff" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <g opacity="0.15" stroke="#b042ff" stroke-width="1">${gridLines}</g>
  <rect x="80" y="${HEIGHT / 2 - 4}" width="220" height="8" fill="url(#accent)" />
  <text x="80" y="${HEIGHT / 2 - 40}" font-family="Space Mono, monospace" font-size="72" font-weight="700" fill="#ffffff" letter-spacing="2">TRANSFORMIA</text>
  <text x="80" y="${HEIGHT / 2 + 60}" font-family="Space Grotesk, sans-serif" font-size="30" fill="rgba(255,255,255,0.75)">Software a medida · Inteligencia Artificial aplicada</text>
</svg>
`;

const outputPath = path.join(__dirname, '..', 'public', 'og-default.jpg');

await sharp(Buffer.from(svg))
  .jpeg({ quality: 90 })
  .toFile(outputPath);

console.log(`OG image generado en ${outputPath}`);
