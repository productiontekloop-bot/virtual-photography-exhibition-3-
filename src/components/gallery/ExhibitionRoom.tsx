import { RoomData } from '../../data/exhibitions';
import Artwork from './Artwork';

interface ExhibitionRoomProps {
  room: RoomData;
}

export default function ExhibitionRoom({ room }: ExhibitionRoomProps) {
  return (
    <group name={`exhibition-room-${room.id}`}>
      {/* All 16 Mounted Room Wall Artworks */}
      {room.artworks.map((art) => (
        <Artwork key={art.id} artwork={art} />
      ))}
    </group>
  );
}
