import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const JERSEYS_DIR = path.join(process.cwd(), 'public', 'jerseys');

// Generate realistic companion back textures for CSE, IT, CSBS, and AIML
// matching the style seen in the EXTC back image (solid center, matching side contour panels)

const CONFIGS = [
  {
    code: 'cse',
    baseColor: { r: 20, g: 30, b: 52 }, // Navy Blue #141E34
    sideColor: { r: 255, g: 255, b: 255 }, // White side panel
    stripeColor: { r: 255, g: 255, b: 255 },
  },
  {
    code: 'it',
    baseColor: { r: 99, g: 14, b: 26 }, // Deep Maroon #630E1A
    sideColor: { r: 229, g: 193, b: 88 }, // Gold side panel #E5C158
    stripeColor: { r: 229, g: 193, b: 88 },
  },
  {
    code: 'csbs',
    baseColor: { r: 24, g: 24, b: 26 }, // Carbon Black #18181A
    sideColor: { r: 255, g: 255, b: 255 }, // White side panel
    stripeColor: { r: 255, g: 255, b: 255 },
  },
  {
    code: 'aiml',
    baseColor: { r: 244, g: 245, b: 249 }, // Tech White #F4F5F9
    sideColor: { r: 15, g: 29, b: 56 }, // Deep Navy side panel #0F1D38
    stripeColor: { r: 15, g: 29, b: 56 },
  },
];

async function createBackSVG(cfg) {
  const width = 512;
  const height = 682;
  const baseHex = `#${((1 << 24) + (cfg.baseColor.r << 16) + (cfg.baseColor.g << 8) + cfg.baseColor.b).toString(16).slice(1)}`;
  const sideHex = `#${((1 << 24) + (cfg.sideColor.r << 16) + (cfg.sideColor.g << 8) + cfg.sideColor.b).toString(16).slice(1)}`;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Dark backdrop to match mockup style -->
      <rect width="100%" height="100%" fill="#0B0B12" />

      <!-- Back Jersey Base Shape -->
      <g id="jersey-back">
        <!-- Main Torso Silhouette -->
        <path d="M 140 100 
                 Q 256 120 372 100 
                 L 460 210 
                 L 420 310 
                 L 380 260 
                 L 400 620 
                 Q 256 640 112 620 
                 L 132 260 
                 L 92 310 
                 L 52 210 Z" 
              fill="${baseHex}" />

        <!-- Left White/Accent Side Flank Curve -->
        <path d="M 132 260 
                 Q 180 430 118 610 
                 L 112 620 
                 L 132 260 Z" 
              fill="${sideHex}" />

        <!-- Right White/Accent Side Flank Curve -->
        <path d="M 380 260 
                 Q 332 430 394 610 
                 L 400 620 
                 L 380 260 Z" 
              fill="${sideHex}" />

        <!-- Collar Rib (Back neckline) -->
        <path d="M 200 88 
                 Q 256 110 312 88 
                 Q 256 125 200 88 Z" 
              fill="${sideHex}" />
      </g>
    </svg>
  `;
}

async function run() {
  for (const cfg of CONFIGS) {
    const svgStr = await createBackSVG(cfg);
    const destPath = path.join(JERSEYS_DIR, `${cfg.code}-back.png`);
    await sharp(Buffer.from(svgStr)).png().toBuffer().then(buf => fs.writeFileSync(destPath, buf));
    console.log(`Generated ${cfg.code}-back.png`);
  }
}

run().catch(console.error);

