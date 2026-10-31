import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const JERSEYS_DIR = path.join(process.cwd(), 'public', 'jerseys');

const DEPT_CONFIGS = [
  {
    code: 'cse',
    source: 'media_1793464538524_5fb5504c.jpg',
    baseColor: '#141E34',
    sideColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
  },
  {
    code: 'csbs',
    source: 'media_1793464526278_0ae9529a.jpg',
    baseColor: '#18181A',
    sideColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
  },
  {
    code: 'it',
    source: 'media_1793464533881_bad75acf.jpg',
    baseColor: '#630E1A',
    sideColor: '#E5C158',
    textColor: '#E5C158',
    accentColor: '#FFD700',
  },
  {
    code: 'aiml',
    source: 'media_1793464520935_34ebc6a0.jpg',
    baseColor: '#F4F5F9',
    sideColor: '#0F1D38',
    textColor: '#0F1D38',
    accentColor: '#0F1D38',
  },
  {
    code: 'extc',
    source: 'media_1793464514027_7e5b0552.jpg',
    baseColor: '#383D2A',
    sideColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    isDual: true,
  },
];

async function removeBackgroundAndHanger(buf, width, height, isRightHalf = false) {
  let img = sharp(buf);
  if (isRightHalf) {
    img = img.extract({ left: Math.floor(width / 2), top: 0, width: Math.floor(width / 2), height });
  } else if (width > height * 1.2) {
    // If dual image (extc) and asking for left half
    img = img.extract({ left: 0, top: 0, width: Math.floor(width / 2), height });
  }

  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const visited = new Uint8Array(w * h);
  const queue = [];

  const getIdx = (x, y) => (y * w + x) * 4;
  const isBg = (x, y) => {
    const idx = getIdx(x, y);
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const brightness = (r + g + b) / 3;
    return brightness < 28;
  };

  for (let x = 0; x < w; x++) {
    queue.push(x, 0);
    queue.push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    queue.push(0, y);
    queue.push(w - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const pIdx = y * w + x;
    if (visited[pIdx]) continue;
    visited[pIdx] = 1;

    if (isBg(x, y)) {
      data[getIdx(x, y) + 3] = 0;
      if (x > 0 && !visited[pIdx - 1]) queue.push(x - 1, y);
      if (x < w - 1 && !visited[pIdx + 1]) queue.push(x + 1, y);
      if (y > 0 && !visited[pIdx - w]) queue.push(x, y - 1);
      if (y < h - 1 && !visited[pIdx + w]) queue.push(x, y + 1);
    }
  }

  // Remove top hanger hook
  const hangerMinX = Math.floor(w * 0.40);
  const hangerMaxX = Math.floor(w * 0.60);
  const hangerMaxY = Math.floor(h * 0.08);
  for (let y = 0; y < hangerMaxY; y++) {
    for (let x = hangerMinX; x < hangerMaxX; x++) {
      data[getIdx(x, y) + 3] = 0;
    }
  }

  // Find bounding box of remaining garment
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[getIdx(x, y) + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const garmentWidth = maxX - minX;
  const garmentHeight = maxY - minY;

  // Extract trimmed garment
  const trimmed = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .extract({ left: minX, top: minY, width: garmentWidth, height: garmentHeight })
    .png()
    .toBuffer();

  // Place centered on standard 1024x1024 transparent canvas
  const canvasSize = 1024;
  const targetWidth = Math.round(canvasSize * 0.90);
  const scale = targetWidth / garmentWidth;
  const targetHeight = Math.min(Math.round(canvasSize * 0.92), Math.round(garmentHeight * scale));

  const resizedBuffer = await sharp(trimmed)
    .resize(targetWidth, targetHeight, { fit: 'inside' })
    .png()
    .toBuffer();

  const resizedMeta = await sharp(resizedBuffer).metadata();

  const padLeft = Math.floor((canvasSize - resizedMeta.width) / 2);
  const padTop = Math.floor((canvasSize - resizedMeta.height) / 2) + 10;

  const result = await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resizedBuffer, left: padLeft, top: padTop }])
    .png()
    .toBuffer();

  return result;
}

// Generate companion back texture with matching base and side curves on 1024x1024 transparent canvas
async function createCompanionBack(cfg) {
  const size = 1024;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Subtle fabric shadow -->
        <filter id="fabricShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4" />
        </filter>
      </defs>

      <!-- Jersey Back Silhouette -->
      <g filter="url(#fabricShadow)">
        <!-- Main Torso & Sleeves Base -->
        <path d="M 370 120 
                 Q 512 145 654 120 
                 L 830 250 
                 L 950 380 
                 L 860 480 
                 L 770 410 
                 L 780 890 
                 Q 512 920 244 890 
                 L 254 410 
                 L 164 480 
                 L 74 380 
                 L 194 250 Z" 
              fill="${cfg.baseColor}" />

        <!-- Left Accent Side Contour Arc -->
        <path d="M 254 410 
                 Q 330 650 250 880 
                 L 244 890 
                 L 254 410 Z" 
              fill="${cfg.sideColor}" />

        <!-- Right Accent Side Contour Arc -->
        <path d="M 770 410 
                 Q 694 650 774 880 
                 L 780 890 
                 L 770 410 Z" 
              fill="${cfg.sideColor}" />

        <!-- Shoulder 3-stripes (Left) -->
        <g stroke="${cfg.sideColor}" stroke-width="8" stroke-linecap="round">
          <line x1="280" y1="185" x2="160" y2="305" />
          <line x1="300" y1="195" x2="180" y2="315" />
          <line x1="320" y1="205" x2="200" y2="325" />
        </g>

        <!-- Shoulder 3-stripes (Right) -->
        <g stroke="${cfg.sideColor}" stroke-width="8" stroke-linecap="round">
          <line x1="744" y1="185" x2="864" y2="305" />
          <line x1="724" y1="195" x2="844" y2="315" />
          <line x1="704" y1="205" x2="824" y2="325" />
        </g>

        <!-- Back Neckline Trim -->
        <path d="M 430 115 
                 Q 512 140 594 115 
                 Q 512 155 430 115 Z" 
              fill="${cfg.sideColor}" />
      </g>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function run() {
  console.log('=== Processing Clean Transparent Jersey Textures ===');

  for (const cfg of DEPT_CONFIGS) {
    const srcPath = path.join(JERSEYS_DIR, cfg.source);
    if (!fs.existsSync(srcPath)) {
      console.warn('Source file missing:', srcPath);
      continue;
    }

    const rawBuf = fs.readFileSync(srcPath);
    const meta = await sharp(rawBuf).metadata();

    // 1. Process Front
    console.log(`Processing ${cfg.code.toUpperCase()} Front...`);
    const frontClean = await removeBackgroundAndHanger(rawBuf, meta.width, meta.height, false);
    fs.writeFileSync(path.join(JERSEYS_DIR, `${cfg.code}-front.png`), frontClean);

    // 2. Process Back
    console.log(`Processing ${cfg.code.toUpperCase()} Back...`);
    if (cfg.isDual) {
      // EXTC already has back photo in right half
      const backClean = await removeBackgroundAndHanger(rawBuf, meta.width, meta.height, true);
      fs.writeFileSync(path.join(JERSEYS_DIR, `${cfg.code}-back.png`), backClean);
    } else {
      // Generate matching transparent back texture
      const backClean = await createCompanionBack(cfg);
      fs.writeFileSync(path.join(JERSEYS_DIR, `${cfg.code}-back.png`), backClean);
    }
  }

  console.log('=== All 10 Jersey Textures Processed with Clean Transparency ===');
}

run().catch(console.error);
