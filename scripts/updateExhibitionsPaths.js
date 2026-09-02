import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src', 'data', 'exhibitions.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Match each room and replace image urls sequentially
const rooms = ['room-1', 'room-2', 'room-3', 'room-4', 'room-5'];

rooms.forEach((roomId) => {
  const roomIndex = content.indexOf(`id: "${roomId}"`);
  if (roomIndex === -1) return;

  const nextRoomIndex = content.indexOf('// =========================================================================', roomIndex + 30);
  const roomSection = nextRoomIndex !== -1 ? content.slice(roomIndex, nextRoomIndex) : content.slice(roomIndex);

  let artCount = 1;
  const updatedSection = roomSection.replace(/image:\s*"(https:\/\/[^"]+)"/g, () => {
    const newPath = `image: "/images/${roomId}/art-${artCount}.jpg"`;
    artCount++;
    return newPath;
  });

  content = content.slice(0, roomIndex) + updatedSection + (nextRoomIndex !== -1 ? content.slice(nextRoomIndex) : '');
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('exhibitions.ts updated with organized /images/ paths!');
