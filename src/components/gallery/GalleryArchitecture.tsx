import { useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, LinearMipmapLinearFilter } from 'three';
import GalleryDoor from './GalleryDoor';
import { useGalleryStore } from '../../hooks/useGalleryStore';

// Procedural high-resolution premium architectural hardwood plank floor textures
let sharedFloorDiffuseMap: CanvasTexture | null = null;
let sharedFloorBumpMap: CanvasTexture | null = null;
let sharedFloorRoughnessMap: CanvasTexture | null = null;

function getSharedFloorTextures(): { diffuse: CanvasTexture; bump: CanvasTexture; roughness: CanvasTexture } {
  if (sharedFloorDiffuseMap && sharedFloorBumpMap && sharedFloorRoughnessMap) {
    return { diffuse: sharedFloorDiffuseMap, bump: sharedFloorBumpMap, roughness: sharedFloorRoughnessMap };
  }

  const size = 2048;
  // 1. Diffuse canvas (Color & Grain)
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = size;
  diffCanvas.height = size;
  const dCtx = diffCanvas.getContext('2d')!;

  // 2. Bump canvas (Plank seams, wood pores & grain relief)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  // 3. Roughness canvas (Satin surface vs matte grain/seams)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;

  // Initialize canvases
  dCtx.fillStyle = '#120905';
  dCtx.fillRect(0, 0, size, size);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  rCtx.fillStyle = '#606060';
  rCtx.fillRect(0, 0, size, size);

  // Modern wide-plank architectural proportions: 8 columns (256px wide each)
  const numColumns = 8;
  const colWidth = size / numColumns;
  const seamPx = 4; // Clean architectural dark shadow seam

  // Premium natural European Smoked Oak / American Walnut palette
  const woodPalettes = [
    { base: '#4d2812', mid: '#5e3319', light: '#703e20', dark: '#3a1b0b' },
    { base: '#42220d', mid: '#542c13', light: '#67361a', dark: '#321607' },
    { base: '#552d16', mid: '#68391e', light: '#7b4425', dark: '#3f1f0e' },
    { base: '#492510', mid: '#5b3017', light: '#6d3b1e', dark: '#36180a' },
    { base: '#522b14', mid: '#63351a', light: '#764122', dark: '#3c1d0d' },
    { base: '#46230e', mid: '#572e14', light: '#69381c', dark: '#341708' },
    { base: '#583017', mid: '#6c3d20', light: '#804828', dark: '#42210f' },
    { base: '#40200c', mid: '#512a12', light: '#643418', dark: '#2f1406' },
  ];

  // Pseudo-random deterministic generator for consistent high quality
  let seed = 42;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  // Generate planks across staggered rows per column
  for (let c = 0; c < numColumns; c++) {
    const x = c * colWidth;
    const pw = colWidth - seamPx;

    // Staggered plank cuts along Y: 3 to 4 planks per column (running bond pattern)
    const cuts: number[] = [0];
    const numCuts = 3;
    for (let i = 1; i <= numCuts; i++) {
      // Offset stagger per column for natural floorboard distribution
      const cutPos = Math.floor((size / numCuts) * i + ((c * 197) % 260) - 130);
      if (cutPos > 0 && cutPos < size) {
        cuts.push(cutPos);
      }
    }
    cuts.sort((a, b) => a - b);
    cuts.push(size);

    for (let p = 0; p < cuts.length - 1; p++) {
      const yStart = cuts[p];
      const yEnd = cuts[p + 1];
      const ph = yEnd - yStart;
      if (ph <= 0) continue;

      const paletteIdx = Math.floor(random() * woodPalettes.length);
      const pal = woodPalettes[paletteIdx];

      // --- A. Base Plank Background & Radial/Linear Natural Gradient ---
      const pGrad = dCtx.createLinearGradient(x, yStart, x + pw, yStart);
      pGrad.addColorStop(0.0, pal.dark);
      pGrad.addColorStop(0.08, pal.base);
      pGrad.addColorStop(0.5, pal.mid);
      pGrad.addColorStop(0.92, pal.base);
      pGrad.addColorStop(1.0, pal.dark);

      dCtx.fillStyle = pGrad;
      dCtx.fillRect(x, yStart, pw, ph);

      // Base bump map height (slightly variable per plank to give realistic micro-height variation)
      const plankBaseHeight = 120 + Math.floor(random() * 20);
      bCtx.fillStyle = `rgb(${plankBaseHeight}, ${plankBaseHeight}, ${plankBaseHeight})`;
      bCtx.fillRect(x, yStart, pw, ph);

      // Base roughness map: smooth satin sheen (~70-85 in 0-255 scale = 0.28-0.34 roughness)
      const plankRough = 75 + Math.floor(random() * 15);
      rCtx.fillStyle = `rgb(${plankRough}, ${plankRough}, ${plankRough})`;
      rCtx.fillRect(x, yStart, pw, ph);

      // --- B. Fine Organic Wood Grains ---
      dCtx.save();
      dCtx.beginPath();
      dCtx.rect(x, yStart, pw, ph);
      dCtx.clip();

      const grainType = random(); // 0-0.6 straight quarter-sawn, 0.6-1.0 cathedral crown
      const numGrains = 28 + Math.floor(random() * 16);

      for (let g = 0; g < numGrains; g++) {
        const gx = x + (g * (pw / numGrains)) + (random() * 4 - 2);
        const curveOffset = (random() - 0.5) * 24;
        const alpha = 0.12 + random() * 0.28;

        // Diffuse dark wood grain fiber
        dCtx.strokeStyle = `rgba(18, 8, 3, ${alpha})`;
        dCtx.lineWidth = 0.8 + random() * 1.4;
        dCtx.beginPath();

        if (grainType > 0.65 && g > 8 && g < numGrains - 8) {
          // Cathedral crown grain arch
          const archCenterY = yStart + ph * (0.3 + random() * 0.4);
          const archSpan = (g - numGrains / 2) * 8;
          dCtx.moveTo(gx, yStart);
          dCtx.quadraticCurveTo(x + pw / 2 + archSpan, archCenterY, gx + archSpan * 0.5, yEnd);
        } else {
          // Natural flowing longitudinal grain
          dCtx.moveTo(gx, yStart);
          dCtx.bezierCurveTo(
            gx + curveOffset, yStart + ph * 0.33,
            gx - curveOffset, yStart + ph * 0.66,
            gx + (random() - 0.5) * 8, yEnd
          );
        }
        dCtx.stroke();

        // Subtle amber/gold grain highlight fiber
        if (random() > 0.45) {
          dCtx.strokeStyle = `rgba(190, 115, 55, ${alpha * 0.4})`;
          dCtx.lineWidth = 0.6;
          dCtx.stroke();
        }
      }

      // Fine transverse medullary rays & wood pores
      dCtx.fillStyle = 'rgba(25, 10, 4, 0.25)';
      for (let k = 0; k < 60; k++) {
        const px = x + random() * pw;
        const py = yStart + random() * ph;
        const pl = 3 + random() * 8;
        dCtx.fillRect(px, py, 1.2, pl);

        // Add pores to bump map (slight recess)
        bCtx.fillStyle = 'rgb(90, 90, 90)';
        bCtx.fillRect(px, py, 1.2, pl);

        // Add slight roughness to pores
        rCtx.fillStyle = 'rgb(130, 130, 130)';
        rCtx.fillRect(px, py, 1.2, pl);
      }

      dCtx.restore();

      // --- C. Chamfer Edge Highlights (Light catch on right/top edges of plank) ---
      dCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      dCtx.lineWidth = 1.0;
      dCtx.beginPath();
      dCtx.moveTo(x + 1, yStart + 1);
      dCtx.lineTo(x + pw - 1, yStart + 1);
      dCtx.stroke();

      // Micro-bevel slope on bump map edges
      bCtx.fillStyle = 'rgb(160, 160, 160)';
      bCtx.fillRect(x + 1, yStart + 1, pw - 2, 1);
      bCtx.fillRect(x + 1, yStart + 1, 1, ph - 2);

      // --- D. Horizontal Butt Joint Seam (Black gap between planks in column) ---
      if (yStart > 0) {
        dCtx.fillStyle = '#060201';
        dCtx.fillRect(x, yStart - 2, pw + seamPx, 3);

        bCtx.fillStyle = '#101010';
        bCtx.fillRect(x, yStart - 2, pw + seamPx, 3);

        rCtx.fillStyle = '#d0d0d0';
        rCtx.fillRect(x, yStart - 2, pw + seamPx, 3);
      }
    }

    // --- E. Vertical Column Seams (Unbroken crisp black architectural shadow gap) ---
    const seamX = x + pw;
    dCtx.fillStyle = '#050201';
    dCtx.fillRect(seamX, 0, seamPx, size);

    bCtx.fillStyle = '#050505';
    bCtx.fillRect(seamX, 0, seamPx, size);

    rCtx.fillStyle = '#e0e0e0';
    rCtx.fillRect(seamX, 0, seamPx, size);
  }

  // Create Three.js Textures
  const diffuseTex = new CanvasTexture(diffCanvas);
  diffuseTex.colorSpace = SRGBColorSpace;
  diffuseTex.wrapS = RepeatWrapping;
  diffuseTex.wrapT = RepeatWrapping;
  diffuseTex.repeat.set(8, 8);
  diffuseTex.generateMipmaps = true;
  diffuseTex.minFilter = LinearMipmapLinearFilter;

  const bumpTex = new CanvasTexture(bumpCanvas);
  bumpTex.wrapS = RepeatWrapping;
  bumpTex.wrapT = RepeatWrapping;
  bumpTex.repeat.set(8, 8);
  bumpTex.generateMipmaps = true;
  bumpTex.minFilter = LinearMipmapLinearFilter;

  const roughTex = new CanvasTexture(roughCanvas);
  roughTex.wrapS = RepeatWrapping;
  roughTex.wrapT = RepeatWrapping;
  roughTex.repeat.set(8, 8);
  roughTex.generateMipmaps = true;
  roughTex.minFilter = LinearMipmapLinearFilter;

  sharedFloorDiffuseMap = diffuseTex;
  sharedFloorBumpMap = bumpTex;
  sharedFloorRoughnessMap = roughTex;

  return { diffuse: diffuseTex, bump: bumpTex, roughness: roughTex };
}

interface WallProps {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
}

const stopWallPointer = (e: any) => {
  e.stopPropagation();
};

function Wall({ position, size, rotation = [0, 0, 0] }: WallProps) {
  const [w, h, d] = size;
  const topTrimHeight = 0.08;
  const baseboardHeight = 0.12;
  const goldLipHeight = 0.02;

  return (
    <group position={position} rotation={rotation}>
      {/* Main Crisp White Gallery Wall - blocks all clicks and double-clicks */}
      <mesh 
        position={[0, h / 2, 0]}
        onPointerDown={stopWallPointer}
        onPointerUp={stopWallPointer}
        onClick={stopWallPointer}
        onDoubleClick={stopWallPointer}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#FAFAF7" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Dark Architectural Top Border/Cornice Trim */}
      <mesh 
        position={[0, h + topTrimHeight / 2, 0]}
        onPointerDown={stopWallPointer}
        onPointerUp={stopWallPointer}
        onClick={stopWallPointer}
        onDoubleClick={stopWallPointer}
      >
        <boxGeometry args={[w + 0.02, topTrimHeight, d + 0.02]} />
        <meshStandardMaterial color="#202022" roughness={0.4} metalness={0.25} />
      </mesh>

      {/* Black Architectural Baseboard Skirting matching user reference */}
      <mesh 
        position={[0, baseboardHeight / 2, 0]}
        onPointerDown={stopWallPointer}
        onPointerUp={stopWallPointer}
        onClick={stopWallPointer}
        onDoubleClick={stopWallPointer}
      >
        <boxGeometry args={[w + 0.02, baseboardHeight, d + 0.02]} />
        <meshStandardMaterial color="#111113" roughness={0.4} metalness={0.15} />
      </mesh>

      {/* Sleek Brass/Gold Baseboard Top Lip matching user reference */}
      <mesh 
        position={[0, baseboardHeight + goldLipHeight / 2, 0]}
        onPointerDown={stopWallPointer}
        onPointerUp={stopWallPointer}
        onClick={stopWallPointer}
        onDoubleClick={stopWallPointer}
      >
        <boxGeometry args={[w + 0.025, goldLipHeight, d + 0.025]} />
        <meshStandardMaterial color="#A48530" roughness={0.35} metalness={0.7} />
      </mesh>
    </group>
  );
}

interface DoorHeaderProps {
  position: [number, number, number];
  size: [number, number, number];
}

function DoorHeader({ position, size }: DoorHeaderProps) {
  const [w, h, d] = size;
  const topTrimHeight = 0.08;

  return (
    <group position={position}>
      {/* Wall Header Block matching Wall surface */}
      <mesh 
        position={[0, 0, 0]}
        onPointerDown={stopWallPointer}
        onPointerUp={stopWallPointer}
        onClick={stopWallPointer}
        onDoubleClick={stopWallPointer}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#FAFAF7" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Dark Architectural Top Border/Cornice Trim spanning unbroken across the door lintel */}
      <mesh 
        position={[0, h / 2 + topTrimHeight / 2, 0]}
        onPointerDown={stopWallPointer}
        onPointerUp={stopWallPointer}
        onClick={stopWallPointer}
        onDoubleClick={stopWallPointer}
      >
        <boxGeometry args={[w + 0.02, topTrimHeight, d + 0.02]} />
        <meshStandardMaterial color="#202022" roughness={0.4} metalness={0.25} />
      </mesh>
    </group>
  );
}

export default function GalleryArchitecture() {
  const floorTextures = useMemo(() => getSharedFloorTextures(), []);
  const viewMode = useGalleryStore((state) => state.viewMode);

  const wallHeight = 4.0;
  const wallThick = 0.3;

  return (
    <group name="gallery-architecture">
      {/* =========================================================================
          1. MAIN GALLERY FLOOR (Premium Architectural Hardwood Floor)
          ========================================================================= */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36.4, 36.4]} />
        <meshStandardMaterial 
          map={floorTextures.diffuse}
          bumpMap={floorTextures.bump}
          bumpScale={0.0035}
          roughnessMap={floorTextures.roughness}
          roughness={0.4} 
          metalness={0.05} 
        />
      </mesh>

      {/* Architectural Plinth / Studio Foundation Platform */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial color="#140a05" roughness={0.7} />
      </mesh>

      {/* Vast Architectural Horizon Studio Ground */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#1a0f08" roughness={0.9} />
      </mesh>

      {/* =========================================================================
          2. OUTER PERIMETER WALLS (X: -18 to 18, Z: -18 to 18)
          ========================================================================= */}
      {/* West Outer Wall (X = -18, Full Length Z: -18 to 18) */}
      <Wall position={[-18, 0, 0]} size={[wallThick, wallHeight, 36]} />

      {/* North Outer Wall (Z = -18, Full Width X: -18 to 18) */}
      <Wall position={[0, 0, -18]} size={[36, wallHeight, wallThick]} />

      {/* East Outer Wall (X = +18, Full Length Z: -18 to 18) */}
      <Wall position={[18, 0, 0]} size={[wallThick, wallHeight, 36]} />

      {/* South Outer Wall (Z = +18, Full Width X: -18 to 18) */}
      <Wall position={[0, 0, 18]} size={[36, wallHeight, wallThick]} />

      {/* =========================================================================
          4. INTERNAL DIVIDING WALLS
          ========================================================================= */}

      {/* --- A. LONG DIVIDING WALL (X = -10, dividing Room 5 from corridor & rooms) --- */}
      {/* North segment (Z: -18 to -0.8) */}
      <Wall position={[-10, 0, -9.4]} size={[wallThick, wallHeight, 17.2]} />
      {/* South segment (Z: +0.8 to +18) */}
      <Wall position={[-10, 0, 9.4]} size={[wallThick, wallHeight, 17.2]} />
      {/* Room 5 Door Header Lintel (above doorway at Z = 0) */}
      <DoorHeader position={[-10, wallHeight - 0.65, 0]} size={[wallThick, 1.3, 1.6]} />

      {/* --- B. NORTH CORRIDOR WALL (Z = -3.2, dividing Corridor from Rooms 3 & 4) --- */}
      {/* Segment 1: Left of Room 4 Door (X: -10 to -3.8) */}
      <Wall position={[-6.9, 0, -3.2]} size={[6.2, wallHeight, wallThick]} />
      {/* Room 4 Door Header Lintel (X = -3) */}
      <DoorHeader position={[-3, wallHeight - 0.65, -3.2]} size={[1.6, 1.3, wallThick]} />
      {/* Segment 2: Between Room 4 and Room 3 Doors (X: -2.2 to +10.2) */}
      <Wall position={[4.0, 0, -3.2]} size={[12.4, wallHeight, wallThick]} />
      {/* Room 3 Door Header Lintel (X = +11) */}
      <DoorHeader position={[11, wallHeight - 0.65, -3.2]} size={[1.6, 1.3, wallThick]} />
      {/* Segment 3: Right of Room 3 Door (X: +11.8 to +18) */}
      <Wall position={[14.9, 0, -3.2]} size={[6.2, wallHeight, wallThick]} />

      {/* --- C. SOUTH CORRIDOR WALL (Z = +3.2, dividing Corridor from Rooms 1 & 2) --- */}
      {/* Segment 1: Left of Room 2 Door (X: -10 to -3.8) */}
      <Wall position={[-6.9, 0, 3.2]} size={[6.2, wallHeight, wallThick]} />
      {/* Room 2 Door Header Lintel (X = -3) */}
      <DoorHeader position={[-3, wallHeight - 0.65, 3.2]} size={[1.6, 1.3, wallThick]} />
      {/* Segment 2: Between Room 2 and Room 1 Doors (X: -2.2 to +10.2) */}
      <Wall position={[4.0, 0, 3.2]} size={[12.4, wallHeight, wallThick]} />
      {/* Room 1 Door Header Lintel (X = +11) */}
      <DoorHeader position={[11, wallHeight - 0.65, 3.2]} size={[1.6, 1.3, wallThick]} />
      {/* Segment 3: Right of Room 1 Door (X: +11.8 to +18) */}
      <Wall position={[14.9, 0, 3.2]} size={[6.2, wallHeight, wallThick]} />

      {/* --- D. TOP VERTICAL DIVIDING WALL (X = 4.0, dividing Room 4 and Room 3) --- */}
      <Wall position={[4.0, 0, -10.6]} size={[wallThick, wallHeight, 14.8]} />

      {/* --- E. BOTTOM VERTICAL DIVIDING WALL (X = 4.0, dividing Room 2 and Room 1) --- */}
      <Wall position={[4.0, 0, 10.6]} size={[wallThick, wallHeight, 14.8]} />

      {/* =========================================================================
          5. REALISTIC WOODEN DOORS FOR ALL 5 ROOMS (Closed by default, auto opens on approach)
          ========================================================================= */}
      {/* Room 5 Door (ONLY ONE door connecting Room 5 to the Corridor on Right Wall, X = -10, Z = 0) */}
      <GalleryDoor 
        position={[-10, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        roomId="room-5" 
        doorWidth={1.4}
        hingeSide="left"
        initialAngle={0}
      />

      {/* Room 4 Door (Top-Left Room, on South Wall Z = -3.2, X = -3) */}
      <GalleryDoor 
        position={[-3, 0, -3.2]} 
        rotation={[0, Math.PI, 0]} 
        roomId="room-4" 
        doorWidth={1.4}
        hingeSide="left"
        initialAngle={0}
      />

      {/* Room 3 Door (Top-Right Room, on South Wall Z = -3.2, X = +11) */}
      <GalleryDoor 
        position={[11, 0, -3.2]} 
        rotation={[0, Math.PI, 0]} 
        roomId="room-3" 
        doorWidth={1.4}
        hingeSide="left"
        initialAngle={0}
      />

      {/* Room 2 Door (Bottom-Left Room, on North Wall Z = +3.2, X = -3) */}
      <GalleryDoor 
        position={[-3, 0, 3.2]} 
        rotation={[0, 0, 0]} 
        roomId="room-2" 
        doorWidth={1.4}
        hingeSide="left"
        initialAngle={0}
      />

      {/* Room 1 Door (Bottom-Right Room, on North Wall Z = +3.2, X = +11) */}
      <GalleryDoor 
        position={[11, 0, 3.2]} 
        rotation={[0, 0, 0]} 
        roomId="room-1" 
        doorWidth={1.4}
        hingeSide="left"
        initialAngle={0}
      />

      {/* =========================================================================
          6. CEILING (in Walkthrough Mode)
          ========================================================================= */}
      {viewMode === 'walkthrough' && (
        <group name="gallery-ceilings">
          <mesh position={[4, wallHeight + 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[28, 6.4]} />
            <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
          </mesh>
          <mesh position={[-14, wallHeight + 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 36]} />
            <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
          </mesh>
          <mesh position={[-3, wallHeight + 0.05, -10.6]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[14, 14.8]} />
            <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
          </mesh>
          <mesh position={[11, wallHeight + 0.05, -10.6]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[14, 14.8]} />
            <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
          </mesh>
          <mesh position={[-3, wallHeight + 0.05, 10.6]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[14, 14.8]} />
            <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
          </mesh>
          <mesh position={[11, wallHeight + 0.05, 10.6]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[14, 14.8]} />
            <meshStandardMaterial color="#FAF9F6" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
}
