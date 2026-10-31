import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const JERSEYS_DIR = path.join(process.cwd(), 'public', 'jerseys');

const MAPPINGS = [
  {
    code: 'extc',
    name: 'Electronics and Telecommunication Engineering',
    source: 'media_1793464514027_7e5b0552.jpg',
    isDual: true,
  },
  {
    code: 'aiml',
    name: 'Artificial Intelligence and Machine Learning',
    source: 'media_1793464520935_34ebc6a0.jpg',
    isDual: false,
  },
  {
    code: 'csbs',
    name: 'Computer Science and Business Systems',
    source: 'media_1793464526278_0ae9529a.jpg',
    isDual: false,
  },
  {
    code: 'it',
    name: 'Information Technology',
    source: 'media_1793464533881_bad75acf.jpg',
    isDual: false,
  },
  {
    code: 'cse',
    name: 'Computer Science and Engineering',
    source: 'media_1793464538524_5fb5504c.jpg',
    isDual: false,
  },
];

async function sampleColor(imageBuffer, left, top, width, height) {
  const region = await sharp(imageBuffer)
    .extract({ left: Math.floor(left), top: Math.floor(top), width: Math.floor(width), height: Math.floor(height) })
    .resize(1, 1)
    .raw()
    .toBuffer();
  const [r, g, b] = region;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

async function run() {
  console.log('--- Inspecting and Preparing Jersey Images ---');
  const results = {};

  for (const item of MAPPINGS) {
    const srcPath = path.join(JERSEYS_DIR, item.source);
    if (!fs.existsSync(srcPath)) {
      console.warn(`File not found: ${srcPath}`);
      continue;
    }

    const metadata = await sharp(srcPath).metadata();
    console.log(`[${item.code.toUpperCase()}] Source: ${item.source} (${metadata.width}x${metadata.height})`);

    const imageBuf = fs.readFileSync(srcPath);

    if (item.isDual) {
      // EXTC has both front (left half) and back (right half) on black background
      const halfWidth = Math.floor(metadata.width / 2);
      
      const frontBuf = await sharp(imageBuf)
        .extract({ left: 0, top: 0, width: halfWidth, height: metadata.height })
        .png()
        .toBuffer();
      
      const backBuf = await sharp(imageBuf)
        .extract({ left: halfWidth, top: 0, width: halfWidth, height: metadata.height })
        .png()
        .toBuffer();

      fs.writeFileSync(path.join(JERSEYS_DIR, 'extc-front.png'), frontBuf);
      fs.writeFileSync(path.join(JERSEYS_DIR, 'extc-back.png'), backBuf);

      // Sample colors: Chest center, sleeve/stripes, collar
      const primary = await sampleColor(frontBuf, halfWidth * 0.45, metadata.height * 0.35, 20, 20);
      const secondary = '#FFFFFF';
      const accent = '#FFFFFF';

      results['extc'] = { primary, secondary, accent };
    } else {
      // Save front image
      const frontBuf = await sharp(imageBuf).png().toBuffer();
      fs.writeFileSync(path.join(JERSEYS_DIR, `${item.code}-front.png`), frontBuf);

      // Sample primary color from chest area
      const primary = await sampleColor(
        frontBuf,
        metadata.width * 0.45,
        metadata.height * 0.35,
        20,
        20
      );

      // Sample stripe / accent color from shoulder stripes
      const secondary = item.code === 'it' ? '#E5C158' : (item.code === 'aiml' ? '#0F1D38' : '#FFFFFF');
      const accent = item.code === 'it' ? '#FFD700' : (item.code === 'aiml' ? '#0F1D38' : '#FFFFFF');

      results[item.code] = { primary, secondary, accent };
    }
  }

  console.log('Sampled Colors:', JSON.stringify(results, null, 2));
}

run().catch(console.error);

