import fs from 'fs';
import path from 'path';
import https from 'https';

const roomImageUrls = {
  'hallway': [
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80'
  ],
  'room-1': [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200',
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=1200',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
    'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?q=80&w=1200'
  ],
  'room-2': [
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1200',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200'
  ],
  'room-3': [
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?q=80&w=1200',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200',
    'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=1200',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200'
  ],
  'room-4': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1200',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200'
  ],
  'room-5': [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=1200',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200'
  ]
};

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${url}: status ${res.statusCode}`);
        return resolve();
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${url}:`, err.message);
      resolve();
    });
  });
}

async function main() {
  console.log('Populating dummy images in room folders...');
  for (const [folder, urls] of Object.entries(roomImageUrls)) {
    const dir = path.join(process.cwd(), 'public', 'images', folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < urls.length; i++) {
      const filePath = path.join(dir, `art-${i + 1}.jpg`);
      await downloadImage(urls[i], filePath);
      console.log(`Saved ${folder}/art-${i + 1}.jpg`);
    }
  }
  console.log('All dummy images populated successfully!');
}

main();
