import fs from 'fs';
import path from 'path';
import https from 'https';

const folders = ['hallway', 'room-1', 'room-2', 'room-3', 'room-4', 'room-5'];

folders.forEach(folder => {
  const dirPath = path.join(process.cwd(), 'public', 'images', folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

console.log('Image directories created successfully!');
