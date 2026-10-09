// scripts/generate-og-image.mjs — imagen para redes sociales (1200×630) con la identidad "software en operación".
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;
const C = {
  bg: '#0b0b12',
  surface: '#13131c',
  border: '#3a3a4e',
  text: '#ececf2',
  muted: '#a0a0b4',
  accent: '#b042ff',
  accentText: '#c98bff',
  signal: '#3ddc97',
};

const grid = [
  ...Array.from({ length: 22 }, (_, i) => `<line x1="${i * 56}" y1="0" x2="${i * 56}" y2="${HEIGHT}" />`),
  ...Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 56}" x2="${WIDTH}" y2="${i * 56}" />`),
].join('');

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="85%" cy="10%" r="70%">
      <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${C.accent}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="word" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="${C.accentText}" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.bg}" />
  <g stroke="#ffffff" stroke-opacity="0.045" stroke-width="1">${grid}</g>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />

  <g transform="translate(80 72)">
    <rect width="56" height="56" rx="14" fill="${C.surface}" stroke="${C.border}" />
    <path d="M15 17.5h26" stroke="${C.text}" stroke-width="4.4" stroke-linecap="round" />
    <path d="M28 17.5v21" stroke="${C.text}" stroke-width="4.4" stroke-linecap="round" />
    <circle cx="28" cy="40.2" r="4.4" fill="${C.accent}" />
    <text x="76" y="38" font-family="Space Grotesk, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="${C.text}">Transformia</text>
  </g>

  <text font-family="Space Grotesk, Helvetica, Arial, sans-serif" font-size="68" font-weight="600" letter-spacing="-2" fill="${C.text}">
    <tspan x="80" y="300">Construimos el software</tspan>
    <tspan x="80" y="378">que <tspan fill="url(#word)">tu operación</tspan> necesita.</tspan>
  </text>

  <text x="80" y="470" font-family="Space Mono, Menlo, monospace" font-size="22" fill="${C.muted}">
    plataformas web · apps móviles · IA aplicada · trazabilidad
  </text>

  <line x1="80" y1="530" x2="${WIDTH - 80}" y2="530" stroke="${C.border}" />
  <circle cx="88" cy="568" r="6" fill="${C.signal}" />
  <text x="104" y="575" font-family="Space Mono, Menlo, monospace" font-size="20" fill="${C.muted}">transformia.dev</text>
  <text x="${WIDTH - 80}" y="575" text-anchor="end" font-family="Space Grotesk, Helvetica, Arial, sans-serif" font-size="22" fill="${C.text}">De la idea a la operación.</text>
</svg>
`;

const outputPath = path.join(__dirname, '..', 'public', 'og-default.jpg');

await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(outputPath);

console.log(`OG image generado en ${outputPath}`);
