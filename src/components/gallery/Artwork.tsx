import { useEffect, useState, useRef, useMemo } from 'react';
import { Texture, FrontSide } from 'three';
import { useGalleryStore } from '../../hooks/useGalleryStore';
import { ArtworkData } from '../../data/exhibitions';
import { getOrCreatePlaceholderTexture, loadArtworkTexture, isRoomWithinLoadDistance } from '../../utils/textureManager';

interface ArtworkProps {
  artwork: ArtworkData;
}

export default function Artwork({ artwork }: ArtworkProps) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const lastClickTime = useRef(0);

  // 1. Get procedural photographic placeholder texture immediately
  const placeholderTexture = useMemo(() => {
    return getOrCreatePlaceholderTexture(artwork);
  }, [artwork]);

  // 2. High-res image texture loader with broad radius for seamless viewing
  const shouldLoadImage = useGalleryStore((state) => isRoomWithinLoadDistance(
    artwork.room,
    state.activeRoomId,
    state.visitorPosition,
    artwork.position
  ));

  useEffect(() => {
    if (!shouldLoadImage) {
      setTexture(null);
      return;
    }

    const unsubscribe = loadArtworkTexture(artwork, (loadedTex) => {
      setTexture(loadedTex);
    });

    return () => {
      unsubscribe();
    };
  }, [shouldLoadImage, artwork]);

  const navigateToArtwork = useGalleryStore((state) => state.navigateToArtwork);

  const displayWidth = artwork.width;
  const displayHeight = artwork.height;
  const isFrameless = Boolean(artwork.noFrame || artwork.room === 'room-2');

  // Modern gallery frame dimensions
  const frameBorder = 0.05;
  const frameTotalWidth = displayWidth + frameBorder * 2;
  const frameTotalHeight = displayHeight + frameBorder * 2;

  // Matting dimensions
  const matBorder = 0.07;
  const artWidth = displayWidth - matBorder * 2;
  const artHeight = displayHeight - matBorder * 2;

  const triggerNavigation = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 350) return;
    lastClickTime.current = now;
    navigateToArtwork(artwork);
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    pointerDownPos.current = {
      x: e.clientX ?? e.nativeEvent?.clientX ?? 0,
      y: e.clientY ?? e.nativeEvent?.clientY ?? 0
    };
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    const cx = e.clientX ?? e.nativeEvent?.clientX ?? pointerDownPos.current.x;
    const cy = e.clientY ?? e.nativeEvent?.clientY ?? pointerDownPos.current.y;
    const dx = Math.abs(cx - pointerDownPos.current.x);
    const dy = Math.abs(cy - pointerDownPos.current.y);
    if (dx < 20 && dy < 20) {
      triggerNavigation();
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <group 
      position={[artwork.position[0], artwork.position[1], artwork.position[2]]}
      rotation={[artwork.rotation[0], artwork.rotation[1], artwork.rotation[2]]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {isFrameless ? (
        <>
          {/* Frameless artwork: Exact original size, zero frame, zero border, zero matting */}
          <mesh position={[0, 0, 0.002]}>
            <planeGeometry args={[displayWidth + 0.04, displayHeight + 0.04]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.14} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0, 0.008]} receiveShadow>
            <planeGeometry args={[displayWidth, displayHeight]} />
            <meshStandardMaterial 
              map={texture || placeholderTexture} 
              roughness={0.06} 
              metalness={0.0} 
              toneMapped={true} 
              side={FrontSide}
            />
          </mesh>
        </>
      ) : (
        <>
          {/* Standard framed gallery artwork */}
          {/* 1. SOFT CONTACT SHADOW ON WALL */}
          <mesh position={[0, 0, 0.002]}>
            <planeGeometry args={[frameTotalWidth + 0.12, frameTotalHeight + 0.12]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.16} depthWrite={false} />
          </mesh>

          {/* 2. FRAME BACKING BOARD */}
          <mesh position={[0, 0, 0.01]} receiveShadow>
            <boxGeometry args={[frameTotalWidth, frameTotalHeight, 0.016]} />
            <meshStandardMaterial color="#1C1C1E" roughness={0.8} />
          </mesh>

          {/* 3. 3D OUTER FRAME BEZEL MOLDINGS (4 perimeter borders) */}
          <mesh position={[0, displayHeight / 2 + frameBorder / 2, 0.022]} receiveShadow>
            <boxGeometry args={[frameTotalWidth, frameBorder, 0.03]} />
            <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.25} />
          </mesh>
          <mesh position={[0, -displayHeight / 2 - frameBorder / 2, 0.022]} receiveShadow>
            <boxGeometry args={[frameTotalWidth, frameBorder, 0.03]} />
            <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.25} />
          </mesh>
          <mesh position={[-displayWidth / 2 - frameBorder / 2, 0, 0.022]} receiveShadow>
            <boxGeometry args={[frameBorder, displayHeight, 0.03]} />
            <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.25} />
          </mesh>
          <mesh position={[displayWidth / 2 + frameBorder / 2, 0, 0.022]} receiveShadow>
            <boxGeometry args={[frameBorder, displayHeight, 0.03]} />
            <meshStandardMaterial color="#141416" roughness={0.4} metalness={0.25} />
          </mesh>

          {/* 4. ARCHIVAL PASSE-PARTOUT (Warm museum archival mat board) */}
          <mesh position={[0, 0, 0.020]} receiveShadow>
            <planeGeometry args={[displayWidth, displayHeight]} />
            <meshStandardMaterial 
              color="#FCFCF9" 
              roughness={0.9} 
              metalness={0.0} 
              side={FrontSide}
            />
          </mesh>

          {/* 5. ARTWORK PHOTOGRAPH CANVAS */}
          <mesh position={[0, 0, 0.024]} receiveShadow>
            <planeGeometry args={[artWidth, artHeight]} />
            <meshStandardMaterial 
              map={texture || placeholderTexture} 
              roughness={0.08} 
              metalness={0.0} 
              toneMapped={true} 
              side={FrontSide}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
