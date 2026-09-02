import { RoomData } from '../../data/exhibitions';
import { useGalleryStore } from '../../hooks/useGalleryStore';
import { isRoomWithinLoadDistance } from '../../utils/textureManager';
import Artwork from './Artwork';

interface ExhibitionRoomProps {
  room: RoomData;
}

export default function ExhibitionRoom({ room }: ExhibitionRoomProps) {
  const isVisible = useGalleryStore((state) => (
    state.viewMode !== 'walkthrough' || isRoomWithinLoadDistance(
      room.id,
      state.activeRoomId,
      state.visitorPosition,
      room.centerPosition
    )
  ));

  if (!isVisible) return null;

  return (
    <group name={`exhibition-room-${room.id}`}>
      {/* All 16 Mounted Room Wall Artworks */}
      {room.artworks.map((art) => (
        <Artwork key={art.id} artwork={art} />
      ))}
    </group>
  );
}
