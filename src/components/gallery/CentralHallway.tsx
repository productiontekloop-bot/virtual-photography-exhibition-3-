import { useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace, LinearMipmapLinearFilter } from 'three';
import ExhibitionHeading from './ExhibitionHeading';
import Artwork from './Artwork';
import { EXHIBITIONS, ArtworkData } from '../../data/exhibitions';

// Curatorial brand logo for gallery corridor wall
let sharedBrandLogoTexture: CanvasTexture | null = null;
function getSharedBrandLogoTexture(): CanvasTexture {
  if (sharedBrandLogoTexture) return sharedBrandLogoTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    sharedBrandLogoTexture = new CanvasTexture(canvas);
    return sharedBrandLogoTexture;
  }

  // Solid black modern gallery plaque
  ctx.fillStyle = '#141414';
  ctx.fillRect(0, 0, 1024, 512);

  // Elegant double border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 976, 464);
  ctx.lineWidth = 1;
  ctx.strokeRect(34, 34, 956, 444);

  // Draw cursive "Photography"
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'italic 105px "Brush Script MT", "Great Vibes", "Playfair Display Italic", "Georgia", "serif"';
  ctx.fillText('Photography', 512, 210);

  // Draw "YVES ADES"
  ctx.font = '300 44px "Inter", "Helvetica Neue", "Arial", "sans-serif"';
  ctx.letterSpacing = '14px';
  ctx.fillText('YVES ADES', 512, 335);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;

  sharedBrandLogoTexture = texture;
  return sharedBrandLogoTexture;
}

export default function CentralHallway() {
  const brandLogoTexture = useMemo(() => getSharedBrandLogoTexture(), []);

  // Curated artworks along the central corridor matching red-boxed locations
  const hallwayArtworks: ArtworkData[] = useMemo(() => [
    // 1. South Wall - Left of Room 1 entrance (Red-boxed location right beside doorway)
    {
      id: 'hall-art-south-1',
      title: 'Verticality & Form',
      artist: 'Yves Ades',
      year: '2024',
      image: '/images/room-5/t1.webp',
      category: 'Corridor Gallery',
      room: 'hallway',
      wall: 'south',
      description: 'Architectural abstraction studying vertical geometries and light gradient.',
      position: [9.2, 1.85, 3.0],
      rotation: [0, Math.PI, 0],
      width: 1.4,
      height: 2.1
    },
    // 2. South Wall - Next to Room 2 entrance
    {
      id: 'hall-art-south-2',
      title: 'Monochrome Symmetry II',
      artist: 'Yves Ades',
      year: '2024',
      image: '/images/room-5/t2.webp',
      category: 'Corridor Gallery',
      room: 'hallway',
      wall: 'south',
      description: 'Reflections across vertical glass facades in high contrast black and white.',
      position: [-1.2, 1.85, 3.0],
      rotation: [0, Math.PI, 0],
      width: 1.3,
      height: 1.9
    },
    // 3. West Wall - Left of Room 5 door
    {
      id: 'hall-art-west-1',
      title: 'Horizon Threshold',
      artist: 'Yves Ades',
      year: '2024',
      image: '/images/room-5/t3.webp',
      category: 'Corridor Gallery',
      room: 'hallway',
      wall: 'west',
      description: 'Ethereal atmosphere exploring the subtle boundary between terrain and atmosphere.',
      position: [-9.85, 1.85, 2.0],
      rotation: [0, Math.PI / 2, 0],
      width: 1.3,
      height: 1.9
    },
    // 4. North Wall - Next to Room 4 entrance
    {
      id: 'hall-art-north-2',
      title: 'Monochrome Symmetry I',
      artist: 'Yves Ades',
      year: '2024',
      image: '/images/room-5/t4.webp',
      category: 'Corridor Gallery',
      room: 'hallway',
      wall: 'north',
      description: 'A study of brutalist concrete forms capturing morning shadow transitions.',
      position: [-1.2, 1.85, -3.0],
      rotation: [0, 0, 0],
      width: 1.3,
      height: 1.9
    },
    // 5. North Wall - Left of Room 3 entrance (Red-boxed location right beside doorway)
    {
      id: 'hall-art-north-1',
      title: 'Pure Geometric Ascents',
      artist: 'Yves Ades',
      year: '2024',
      image: '/images/room-5/t5.webp',
      category: 'Corridor Gallery',
      room: 'hallway',
      wall: 'north',
      description: 'Precision lines and structural cantilever elements in high clarity.',
      position: [9.2, 1.85, -3.0],
      rotation: [0, 0, 0],
      width: 1.4,
      height: 2.1
    }
  ], []);

  // Room headers above door openings
  const headings = useMemo(() => {
    return EXHIBITIONS.map((room) => {
      let headPos: [number, number, number];
      let headRot: [number, number, number];

      if (room.id === 'room-5') {
        headPos = [-9.8, 3.1, 0];
        headRot = [0, Math.PI / 2, 0];
      } else if (room.id === 'room-4') {
        headPos = [-3, 3.1, -3.0];
        headRot = [0, 0, 0];
      } else if (room.id === 'room-3') {
        headPos = [11, 3.1, -3.0];
        headRot = [0, 0, 0];
      } else if (room.id === 'room-2') {
        headPos = [-3, 3.1, 3.0];
        headRot = [0, Math.PI, 0];
      } else {
        headPos = [11, 3.1, 3.0];
        headRot = [0, Math.PI, 0];
      }

      return {
        id: room.id,
        title: room.title,
        subtitle: room.subtitle,
        themeColor: room.themeColor,
        position: headPos,
        rotation: headRot
      };
    });
  }, []);

  return (
    <group name="central-hallway-features">
      {/* 1. Curated Artworks on Central Corridor Walls */}
      {hallwayArtworks.map((art) => (
        <Artwork key={art.id} artwork={art} />
      ))}

      {/* 2. Brand Logo Plaque at East End of Corridor */}
      <mesh position={[17.82, 1.9, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[3.2, 1.6]} />
        <meshStandardMaterial 
          map={brandLogoTexture} 
          roughness={0.25} 
          metalness={0.05}
        />
      </mesh>

      {/* 3. Exhibition Heading Typography Plaques above Doors */}
      {headings.map((h) => (
        <ExhibitionHeading 
          key={`heading-${h.id}`} 
          title={h.title} 
          subtitle={h.subtitle} 
          themeColor={h.themeColor}
          position={h.position} 
          rotation={h.rotation} 
        />
      ))}
    </group>
  );
}
