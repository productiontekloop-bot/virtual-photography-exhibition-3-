import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { EXHIBITIONS } from '../../data/exhibitions';
import { useGalleryStore } from '../../hooks/useGalleryStore';
import { checkCollision, getRoomIdFromPosition } from '../../utils/collision';
import GalleryLighting from './GalleryLighting';
import GalleryArchitecture from './GalleryArchitecture';
import CentralHallway from './CentralHallway';
import ExhibitionRoom from './ExhibitionRoom';
import PlayerController from './PlayerController';

export default function VirtualGallery() {
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const pointerDownTime = useRef(0);
  
  const moveToPosition = useGalleryStore((state) => state.moveToPosition);
  const visitorPosition = useGalleryStore((state) => state.visitorPosition);
  const selectedArtwork = useGalleryStore((state) => state.selectedArtwork);
  const viewMode = useGalleryStore((state) => state.viewMode);

  const handlePointerDown = (e: any) => {
    if (e.button !== 0 && e.nativeEvent instanceof MouseEvent) return;
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    pointerDownTime.current = Date.now();
  };

  const handlePointerUp = (e: any) => {
    if (selectedArtwork) return;
    if (e.button !== 0 && e.nativeEvent instanceof MouseEvent) return;

    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const elapsed = Date.now() - pointerDownTime.current;

    // Distinguish quick click/tap from an orbital or look drag
    if (dist < 5 && elapsed < 280) {
      if (e.point) {
        // Movement is only allowed from the gallery floor. Walls and artwork stop propagation.
        const isFloorClick = Math.abs(e.point.y) <= 0.35;
        if (!isFloorClick) return;

        if (viewMode === 'floorplan' || viewMode === 'perspective') {
          // If in overview, clicking on a room or corridor enters walkthrough at that spot
          const verified = checkCollision(e.point.x, e.point.z);
          useGalleryStore.getState().moveToPosition(
            [verified.x, 1.65, verified.z],
            [verified.x, 1.65, verified.z - 3]
          );
          useGalleryStore.setState({ viewMode: 'walkthrough' });
          return;
        }

        // Room changes must be door-to-door ONLY:
        // Players can only move within their current room when clicking on the floor.
        // Room transitions can only be made by walking through doors or interacting directly with doors.
        const currentRoom = getRoomIdFromPosition(visitorPosition[0], visitorPosition[2]);
        const verified = checkCollision(e.point.x, e.point.z, visitorPosition[0], visitorPosition[2]);
        const targetRoom = getRoomIdFromPosition(verified.x, verified.z);

        if (currentRoom === targetRoom) {
          const lookDirX = verified.x - visitorPosition[0];
          const lookDirZ = verified.z - visitorPosition[2];
          moveToPosition(
            [verified.x, 1.65, verified.z],
            [verified.x + lookDirX * 0.5, 1.65, verified.z + lookDirZ * 0.5]
          );
        }
      }
    }
  };

  return (
    <div id="canvas-container" className="w-full h-full select-none relative bg-[#E6E6E3] block">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          fov: 56,
          near: 0.1,
          far: 90,
          position: [-15, 27, 29]
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          preserveDrawingBuffer: false
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.12;
        }}
      >
        <Suspense fallback={null}>
          <group 
            onPointerDown={handlePointerDown} 
            onPointerUp={handlePointerUp}
            onDoubleClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Clean architectural studio background tone */}
            <color attach="background" args={['#E2E2DF']} />

            {/* Realistic curatorial exhibition lighting setup */}
            <GalleryLighting />

            {/* Camera & Interactive navigation controller */}
            <PlayerController />

            {/* Complete 5-room modern art gallery architecture with wooden doors */}
            <GalleryArchitecture />

            {/* Corridor curated elements */}
            <CentralHallway />

            {/* 5 Procedural Exhibition Galleries */}
            {EXHIBITIONS.map((room) => (
              <ExhibitionRoom key={room.id} room={room} />
            ))}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
