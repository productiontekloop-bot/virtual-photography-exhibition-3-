import { useRef } from 'react';
import { DirectionalLight } from 'three';
import { useGalleryStore } from '../../hooks/useGalleryStore';

export default function GalleryLighting() {
  const activeRoomId = useGalleryStore((state) => state.activeRoomId);
  const viewMode = useGalleryStore((state) => state.viewMode);

  const isOverview = viewMode === 'perspective' || viewMode === 'floorplan';

  return (
    <>
      {/* 1. Hemisphere Light - Natural Sky / Gallery Floor Ambient Bounce */}
      <hemisphereLight 
        intensity={isOverview ? 1.4 : 1.3} 
        color="#FFFFFF" 
        groundColor="#FAF9F5" 
      />

      {/* 2. Pure Gallery Diffuse Ambient Light */}
      <ambientLight intensity={isOverview ? 1.05 : 0.95} color="#FAF9F5" />

      {/* 3. Primary Key Diffuse Sunlight - Clean even illumination without harsh cast shadows */}
      <directionalLight
        position={[-14, 28, 18]}
        intensity={isOverview ? 1.0 : 0.9}
        color="#FFFDF7"
      />

      {/* 4. Secondary Cool Diffuse Fill Light */}
      <directionalLight
        position={[18, 24, -16]}
        intensity={0.8}
        color="#F5F8FC"
      />

      {/* 5. Central Horizontal Corridor Architectural Track Floodlights */}
      <pointLight position={[-6, 3.6, 0]} intensity={1.3} distance={20} decay={1.6} color="#FFFBF5" />
      <pointLight position={[0, 3.6, 0]} intensity={1.35} distance={20} decay={1.6} color="#FFFBF5" />
      <pointLight position={[6, 3.6, 0]} intensity={1.35} distance={20} decay={1.6} color="#FFFBF5" />
      <pointLight position={[13, 3.6, 0]} intensity={1.3} distance={20} decay={1.6} color="#FFFBF5" />

      {/* 6. Room 5 (Long Gallery Wing on Left: X = -14, Z: -18 to +18) */}
      <pointLight position={[-14, 3.6, -12]} intensity={1.4} distance={20} decay={1.6} color="#FFFDF8" />
      <pointLight position={[-14, 3.6, -4]} intensity={1.45} distance={20} decay={1.6} color="#FFFDF8" />
      <pointLight position={[-14, 3.6, 4]} intensity={1.45} distance={20} decay={1.6} color="#FFFDF8" />
      <pointLight position={[-14, 3.6, 12]} intensity={1.4} distance={20} decay={1.6} color="#FFFDF8" />

      {/* 7. Room 4 (Top Left: [-3, 0, -10.6]) */}
      <pointLight 
        position={[-3, 3.6, -10.6]} 
        intensity={activeRoomId === 'room-4' ? 1.55 : 1.4} 
        distance={22} 
        decay={1.6}
        color="#FFFBF5" 
      />

      {/* 8. Room 3 (Top Right: [11, 0, -10.6]) */}
      <pointLight 
        position={[11, 3.6, -10.6]} 
        intensity={activeRoomId === 'room-3' ? 1.55 : 1.4} 
        distance={22} 
        decay={1.6}
        color="#FFFBF5" 
      />

      {/* 9. Room 2 (Bottom Left: [-3, 0, 10.6]) */}
      <pointLight 
        position={[-3, 3.6, 10.6]} 
        intensity={activeRoomId === 'room-2' ? 1.55 : 1.4} 
        distance={22} 
        decay={1.6}
        color="#FFFBF5" 
      />

      {/* 10. Room 1 (Bottom Right: [11, 0, 10.6]) */}
      <pointLight 
        position={[11, 3.6, 10.6]} 
        intensity={activeRoomId === 'room-1' ? 1.55 : 1.4} 
        distance={22} 
        decay={1.6}
        color="#FFFBF5" 
      />
    </>
  );
}
