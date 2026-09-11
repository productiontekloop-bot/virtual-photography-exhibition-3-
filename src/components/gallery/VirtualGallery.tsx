import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { EXHIBITIONS } from '../../data/exhibitions';
import { useGalleryStore } from '../../hooks/useGalleryStore';
import GalleryLighting from './GalleryLighting';
import GalleryArchitecture from './GalleryArchitecture';
import CentralHallway from './CentralHallway';
import ExhibitionRoom from './ExhibitionRoom';
import PlayerController from './PlayerController';
import { preloadRoomAssets } from '../../utils/textureManager';

function RoomAssetPreloader() {
  useEffect(() => {
    preloadRoomAssets(EXHIBITIONS.map((room) => room.id));
  }, []);
  return null;
}

export default function VirtualGallery() {
  const selectedArtwork = useGalleryStore((state) => state.selectedArtwork);

  return (
    <div id="canvas-container" className="w-full h-full select-none relative bg-[#E6E6E3] block">
      <Canvas
        dpr={[0.85, 1]}
        frameloop="demand"
        camera={{
          fov: 56,
          near: 0.1,
          far: 90,
          position: [-15, 27, 29]
        }}
        gl={{
          antialias: typeof navigator === 'undefined' || (navigator.hardwareConcurrency ?? 8) > 4,
          powerPreference: 'high-performance',
          alpha: false,
          preserveDrawingBuffer: false
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.12;
        }}
      >
        <Suspense fallback={null}>
          <group onDoubleClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Clean architectural studio background tone */}
            <color attach="background" args={['#E2E2DF']} />

            {/* Realistic curatorial exhibition lighting setup */}
            <GalleryLighting />

            {/* Camera & Interactive navigation controller */}
            <PlayerController />
            <RoomAssetPreloader />

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
