import { memo, useEffect, useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { MeshStandardMaterial, Texture, FrontSide } from 'three';
import { useGalleryStore } from '../../hooks/useGalleryStore';
import { ArtworkData } from '../../data/exhibitions';
import { loadArtworkTexture } from '../../utils/textureManager';

interface ArtworkProps {
  artwork: ArtworkData;
}

function Artwork({ artwork }: ArtworkProps) {
  const [texture, setTexture] = useState<Texture | null>(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const lastClickTime = useRef(0);
  const imageMaterial = useRef<MeshStandardMaterial>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const unsubscribe = loadArtworkTexture(artwork, (loadedTex) => {
      setTexture(loadedTex);
      if (imageMaterial.current) {
        imageMaterial.current.map = loadedTex;
        imageMaterial.current.needsUpdate = true;
      }
      invalidate();
    });

    return () => {
      unsubscribe();
    };
  }, [artwork, invalidate]);

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
    >
      {isFrameless ? (
        <>
          {/* Frameless artwork: Exact original size, zero frame, zero border, zero matting */}
          <mesh position={[0, 0, 0.002]} raycast={() => null}>
            <planeGeometry args={[displayWidth + 0.04, displayHeight + 0.04]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.14} depthWrite={false} />
          </mesh>
          <mesh
            position={[0, 0, 0.008]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <planeGeometry args={[displayWidth, displayHeight]} />
            <meshStandardMaterial 
              ref={imageMaterial}
              map={texture} 
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
          <mesh position={[0, 0, 0.002]} raycast={() => null}>
            <planeGeometry args={[frameTotalWidth + 0.12, frameTotalHeight + 0.12]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.16} depthWrite={false} />
          </mesh>

          {/* 2. FRAME BACKING BOARD */}
          <mesh position={[0, 0, 0.01]} raycast={() => null}>
            <boxGeometry args={[frameTotalWidth, frameTotalHeight, 0.016]} />
            <meshStandardMaterial color="#1C1C1E" roughness={0.8} />
          </mesh>

          {/* 3. ARCHIVAL PASSE-PARTOUT (Warm museum archival mat board) */}
          <mesh position={[0, 0, 0.020]} raycast={() => null}>
            <planeGeometry args={[displayWidth, displayHeight]} />
            <meshStandardMaterial 
              color="#FCFCF9" 
              roughness={0.9} 
              metalness={0.0} 
              side={FrontSide}
            />
          </mesh>

          {/* 4. ARTWORK PHOTOGRAPH CANVAS */}
          <mesh
            position={[0, 0, 0.024]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <planeGeometry args={[artWidth, artHeight]} />
            <meshStandardMaterial 
              ref={imageMaterial}
              map={texture} 
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

export default memo(Artwork);
