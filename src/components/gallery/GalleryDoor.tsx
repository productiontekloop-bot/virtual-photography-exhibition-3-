import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, CanvasTexture, RepeatWrapping, SRGBColorSpace, LinearMipmapLinearFilter } from 'three';
import { useGalleryStore } from '../../hooks/useGalleryStore';

// Procedural rich walnut woodgrain texture
let sharedWoodTexture: CanvasTexture | null = null;
function getSharedWoodTexture(): CanvasTexture {
  if (sharedWoodTexture) return sharedWoodTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    sharedWoodTexture = new CanvasTexture(canvas);
    return sharedWoodTexture;
  }

  // Base warm walnut tone
  ctx.fillStyle = '#4A2E1B';
  ctx.fillRect(0, 0, 512, 1024);

  // Vertical wood fibers and grain waves
  for (let y = 0; y < 1024; y += 4) {
    const wave = Math.sin(y * 0.02) * 12 + Math.sin(y * 0.08) * 4;
    for (let x = 0; x < 512; x += 2) {
      const noise = (Math.random() - 0.5) * 20;
      const shade = 55 + Math.sin((x + wave) * 0.08) * 18 + noise;
      const r = Math.floor(shade * 1.25);
      const g = Math.floor(shade * 0.85);
      const b = Math.floor(shade * 0.55);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 2, 4);
    }
  }

  // Soft vertical plank grooves
  ctx.fillStyle = 'rgba(20, 10, 5, 0.45)';
  for (let px = 64; px < 512; px += 128) {
    ctx.fillRect(px, 0, 3, 1024);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;

  sharedWoodTexture = texture;
  return sharedWoodTexture;
}

interface GalleryDoorProps {
  position: [number, number, number];
  rotation: [number, number, number];
  roomId: string;
  doorWidth?: number;
  doorHeight?: number;
  hingeSide?: 'left' | 'right';
  initialAngle?: number;
}

export default function GalleryDoor({
  position,
  rotation,
  roomId,
  doorWidth = 1.35,
  doorHeight = 2.65,
  hingeSide = 'left',
  initialAngle = 0
}: GalleryDoorProps) {
  const hingeRef = useRef<any>(null);
  const currentAngle = useRef(initialAngle);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const lastToggleTime = useRef(0);

  // Subscribe to door open/closed state in store
  const isOpen = useGalleryStore((state) => state.doorsOpen[roomId] ?? false);
  const visitorPosition = useGalleryStore((state) => state.visitorPosition);
  const activeRoomId = useGalleryStore((state) => state.activeRoomId);
  const toggleDoor = useGalleryStore((state) => state.toggleDoor);
  const setDoorOpen = useGalleryStore((state) => state.setDoorOpen);
  const previousActiveRoom = useRef(activeRoomId);
  const passedThrough = useRef(false);

  const woodTexture = useMemo(() => getSharedWoodTexture(), []);

  // Frame tick: smooth physical swing animation
  useFrame((_, delta) => {
    const visitorDistance = Math.hypot(
      visitorPosition[0] - position[0],
      visitorPosition[2] - position[2],
    );

    if (previousActiveRoom.current === roomId && activeRoomId !== roomId) {
      passedThrough.current = true;
    }

    if (activeRoomId === roomId) {
      passedThrough.current = false;
    }

    if (
      isOpen &&
      (activeRoomId === roomId || passedThrough.current) &&
      visitorDistance > 1.1
    ) {
      setDoorOpen(roomId, false);
    }

    if (passedThrough.current && visitorDistance > 2.4) {
      passedThrough.current = false;
    }

    previousActiveRoom.current = activeRoomId;

    // 0 = closed, 1.45 rad (~83°) = open inward into the room
    const targetAngle = isOpen ? 1.45 : 0;

    // Smooth physical easing
    currentAngle.current = MathUtils.damp(
      currentAngle.current,
      targetAngle,
      4.5,
      delta
    );

    if (hingeRef.current) {
      hingeRef.current.rotation.y = hingeSide === 'left' ? -currentAngle.current : currentAngle.current;
    }
  });

  const hingeOffset = hingeSide === 'left' ? -doorWidth / 2 : doorWidth / 2;

  const triggerToggle = () => {
    const now = Date.now();
    if (now - lastToggleTime.current < 280) return;
    lastToggleTime.current = now;
    toggleDoor(roomId);
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    pointerDownPos.current = {
      x: e.clientX ?? e.nativeEvent?.clientX ?? 0,
      y: e.clientY ?? e.nativeEvent?.clientY ?? 0,
    };
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    const cx = e.clientX ?? e.nativeEvent?.clientX ?? pointerDownPos.current.x;
    const cy = e.clientY ?? e.nativeEvent?.clientY ?? pointerDownPos.current.y;
    const dx = Math.abs(cx - pointerDownPos.current.x);
    const dy = Math.abs(cy - pointerDownPos.current.y);
    if (dx < 20 && dy < 20) {
      triggerToggle();
    }
  };

  // Hover feedback: pointer cursor only, no labels or details
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <group 
      position={position} 
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* ==================== 1. REALISTIC WOODEN DOOR FRAME ==================== */}
      {/* Top Header Jamb */}
      <mesh position={[0, doorHeight + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[doorWidth + 0.22, 0.1, 0.24]} />
        <meshStandardMaterial color="#351F11" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Left Vertical Frame Post */}
      <mesh position={[-doorWidth / 2 - 0.055, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.11, doorHeight + 0.1, 0.24]} />
        <meshStandardMaterial color="#351F11" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Right Vertical Frame Post */}
      <mesh position={[doorWidth / 2 + 0.055, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.11, doorHeight + 0.1, 0.24]} />
        <meshStandardMaterial color="#351F11" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Floor Metal Threshold Plate */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[doorWidth + 0.1, 0.03, 0.26]} />
        <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* ==================== 2. HINGED WOODEN DOOR LEAF ==================== */}
      <group position={[hingeOffset, 0, 0]} ref={hingeRef}>
        <group position={[-hingeOffset, 0, 0]}>
          {/* Main Solid Wood Door Slab */}
          <mesh position={[0, doorHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[doorWidth - 0.04, doorHeight - 0.02, 0.055]} />
            <meshStandardMaterial 
              map={woodTexture} 
              color="#543622" 
              roughness={0.65} 
              metalness={0.08} 
            />
          </mesh>

          {/* Decorative Wood Frame Beveling */}
          <mesh position={[0, doorHeight / 2, 0.03]} castShadow>
            <boxGeometry args={[doorWidth - 0.14, doorHeight - 0.14, 0.01]} />
            <meshStandardMaterial color="#442918" roughness={0.7} />
          </mesh>

          {/* Recessed Lower Wood Panel */}
          <mesh position={[0, doorHeight * 0.28, 0.032]} castShadow>
            <boxGeometry args={[doorWidth - 0.26, doorHeight * 0.38, 0.008]} />
            <meshStandardMaterial color="#3C2414" roughness={0.6} />
          </mesh>

          {/* Recessed Upper Wood Panel */}
          <mesh position={[0, doorHeight * 0.72, 0.032]} castShadow>
            <boxGeometry args={[doorWidth - 0.26, doorHeight * 0.38, 0.008]} />
            <meshStandardMaterial color="#3C2414" roughness={0.6} />
          </mesh>

          {/* ==================== 3. BRUSHED METAL HARDWARE ==================== */}
          {/* Handle Escutcheon Plate (Front) */}
          <mesh 
            position={[hingeSide === 'left' ? doorWidth / 2 - 0.16 : -doorWidth / 2 + 0.16, 1.05, 0.035]} 
            castShadow
          >
            <boxGeometry args={[0.045, 0.24, 0.008]} />
            <meshStandardMaterial color="#C4A875" roughness={0.25} metalness={0.9} />
          </mesh>

          {/* Lever Handle Bar (Front) */}
          <mesh 
            position={[
              hingeSide === 'left' ? doorWidth / 2 - 0.22 : -doorWidth / 2 + 0.22, 
              1.12, 
              0.065
            ]} 
            castShadow
          >
            <boxGeometry args={[0.14, 0.02, 0.02]} />
            <meshStandardMaterial color="#D8BE8A" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Handle Escutcheon Plate (Back) */}
          <mesh 
            position={[hingeSide === 'left' ? doorWidth / 2 - 0.16 : -doorWidth / 2 + 0.16, 1.05, -0.035]} 
            castShadow
          >
            <boxGeometry args={[0.045, 0.24, 0.008]} />
            <meshStandardMaterial color="#C4A875" roughness={0.25} metalness={0.9} />
          </mesh>

          {/* Lever Handle Bar (Back) */}
          <mesh 
            position={[
              hingeSide === 'left' ? doorWidth / 2 - 0.22 : -doorWidth / 2 + 0.22, 
              1.12, 
              -0.065
            ]} 
            castShadow
          >
            <boxGeometry args={[0.14, 0.02, 0.02]} />
            <meshStandardMaterial color="#D8BE8A" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Keyhole / Cylinder lock */}
          <mesh 
            position={[hingeSide === 'left' ? doorWidth / 2 - 0.16 : -doorWidth / 2 + 0.16, 0.96, 0.038]} 
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.009, 0.009, 0.008, 16]} />
            <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
