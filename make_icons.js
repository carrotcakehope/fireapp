const fs = require('fs');
const path = require('path');
const { Jimp, ResizeStrategy } = require('jimp');

// ICO 파일에서 가장 큰 이미지의 PNG 바이트 추출
function extractLargestFromIco(buffer) {
  const count = buffer.readUInt16LE(4);
  let best = null, bestSize = 0;
  for (let i = 0; i < count; i++) {
    const off = 6 + i * 16;
    const w = buffer[off] || 256;
    const h = buffer[off + 1] || 256;
    const imgOff = buffer.readUInt32LE(off + 12);
    const imgLen = buffer.readUInt32LE(off + 8);
    if (w * h > bestSize) {
      bestSize = w * h;
      best = buffer.slice(imgOff, imgOff + imgLen);
    }
  }
  return best;
}

async function main() {
  const icoBuf = fs.readFileSync(path.join(__dirname, 'ilgu.ico'));
  const pngBuf = extractLargestFromIco(icoBuf);
  console.log(`ICO에서 PNG 추출 완료 (${pngBuf.length} bytes)`);

  const img = await Jimp.fromBuffer(pngBuf);
  console.log(`이미지 로드: ${img.width}x${img.height}`);

  const resDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
  const targets = [
    { folder: 'mipmap-mdpi',    size: 48  },
    { folder: 'mipmap-hdpi',    size: 72  },
    { folder: 'mipmap-xhdpi',   size: 96  },
    { folder: 'mipmap-xxhdpi',  size: 144 },
    { folder: 'mipmap-xxxhdpi', size: 192 },
  ];

  for (const t of targets) {
    const resized = img.clone().resize({ w: t.size, h: t.size, mode: ResizeStrategy.NEAREST_NEIGHBOR });
    const buf = await resized.getBuffer('image/png');
    const dir = path.join(resDir, t.folder);
    fs.writeFileSync(path.join(dir, 'ic_launcher.png'), buf);
    fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), buf);
    fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), buf);
    console.log(`✓ ${t.folder} (${t.size}x${t.size})`);
  }

  // PWA 아이콘 생성 (www/ 폴더에 저장)
  const wwwDir = path.join(__dirname, 'www');
  if (!fs.existsSync(wwwDir)) fs.mkdirSync(wwwDir);
  const pwaTargets = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
  ];
  for (const t of pwaTargets) {
    const resized = img.clone().resize({ w: t.size, h: t.size, mode: ResizeStrategy.NEAREST_NEIGHBOR });
    const buf = await resized.getBuffer('image/png');
    fs.writeFileSync(path.join(wwwDir, t.name), buf);
    console.log(`✓ PWA ${t.name}`);
  }

  console.log('\n아이콘 생성 완료!');
}

main().catch(e => { console.error('오류:', e.message); process.exit(1); });
