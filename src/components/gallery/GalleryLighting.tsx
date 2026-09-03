import { useGalleryStore } from '../../hooks/useGalleryStore';

export default function GalleryLighting() {
  const activeRoomId = useGalleryStore((state) => state.activeRoomId);
  const viewMode = useGalleryStore((state) => state.viewMode);

  const isOverview = viewMode === 'perspective' || viewMode === 'floorplan';
  const roomLights = [
    { id: 'room-5', position: [-14, 3.6, -8] as [number, number, number] },
    { id: 'room-4', position: [-3, 3.6, -10.6] as [number, number, number] },
    { id: 'room-3', position: [11, 3.6, -10.6] as [number, number, number] },
    { id: 'room-2', position: [-3, 3.6, 10.6] as [number, number, number] },
    { id: 'room-1', position: [11, 3.6, 10.6] as [number, number, number] },
  ];

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

      {/* Room accents stay active in overview; walkthrough only needs its current room. */}
      {roomLights
        .filter((light) => isOverview || light.id === activeRoomId)
        .map((light) => (
          <pointLight
            key={light.id}
            position={light.position}
            intensity={light.id === activeRoomId ? 1.55 : 1.4}
            distance={22}
            decay={1.6}
            color="#FFFBF5"
          />
        ))}
    </>
  );
}
