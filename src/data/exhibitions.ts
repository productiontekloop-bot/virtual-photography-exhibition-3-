export interface ArtworkData {
  id: string;
  image: string;
  title: string;
  artist: string;
  year: string;
  category: string;
  description: string;
  width: number;
  height: number;
  room: string;
  wall: 'north' | 'south' | 'east' | 'west' | 'hallway';
  position: [number, number, number]; // [x, y, z]
  rotation: [number, number, number]; // [rx, ry, rz] in radians
  caption?: string;
  externalUrl?: string;
  noFrame?: boolean;
}

export interface RoomData {
  id: string;
  roomNumber: number;
  title: string;
  subtitle: string;
  description: string;
  themeColor: string;
  centerPosition: [number, number, number]; // [x, y, z]
  dimensions: [number, number, number]; // [width, height, depth]
  doorPosition: [number, number, number]; // [x, y, z]
  doorRotation: [number, number, number];
  artworks: ArtworkData[];
}

export const EXHIBITIONS: RoomData[] = [
  // =========================================================================
  // ROOM 1: Bottom Right (X: 4 to 18, Z: 3.2 to 18)
  // Center: [11, 0, 10.6], Dimensions: [14, 4, 14.8]
  // Total: 11 Artworks (3 East, 3 South, 3 West, 2 North)
  // =========================================================================
  {
    id: "room-1",
    roomNumber: 1,
    title: "ROOM 1",
    subtitle: "URBAN VISTAS & MODERN METROPOLIS",
    description: "An architectural photography collection examining geometry, towering silhouettes, and urban light dynamics across global metropolises.",
    themeColor: "#2A3B4C",
    centerPosition: [11, 0, 10.6],
    dimensions: [14, 4, 14.8],
    doorPosition: [11, 0, 3.2],
    doorRotation: [0, 0, 0],
    artworks: [
      // East Wall (X = 17.82) - 3 Artworks
      {
        id: "r1-e1",
        image: "/images/room-1/f1.jpeg",
        title: "Monochrome Facade I",
        artist: "Studio Ades",
        year: "2025",
        category: "Architectural",
        description: "Rhythmic repeating geometric balconies forming hypnotic vertical gradients.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "east",
        position: [17.82, 1.8, 6.0],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r1-e2",
        image: "/images/room-1/f2.jpeg",
        title: "Glass Spire Apex II",
        artist: "Studio Ades",
        year: "2025",
        category: "Metropolis",
        description: "Angular glass facade reflecting low afternoon golden hour sun rays.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "east",
        position: [17.82, 1.8, 10.6],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r1-e3",
        image: "/images/room-1/f3.jpeg",
        title: "Nocturne Grid III",
        artist: "Studio Ades",
        year: "2026",
        category: "Nightscapes",
        description: "Dense city skyline illuminated against velvet midnight atmosphere.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "east",
        position: [17.82, 1.8, 15.2],
        rotation: [0, -Math.PI / 2, 0]
      },
      // South Wall (Z = 17.82) - 3 Artworks
      {
        id: "r1-s1",
        image: "/images/room-1/f4.jpeg",
        title: "Concrete Canyon IV",
        artist: "Studio Ades",
        year: "2025",
        category: "Urban Forms",
        description: "High-angle perspective descending through brutalist concrete structures.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "south",
        position: [7.5, 1.8, 17.82],
        rotation: [0, Math.PI, 0]
      },
      {
        id: "r1-s2",
        image: "/images/room-1/f5.jpeg",
        title: "Golden Hour Transit V",
        artist: "Studio Ades",
        year: "2026",
        category: "City Motion",
        description: "Long exposure trails blending seamlessly beneath towering steel bridges.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "south",
        position: [11.0, 1.8, 17.82],
        rotation: [0, Math.PI, 0]
      },
      {
        id: "r1-s3",
        image: "/images/room-1/f6.jpeg",
        title: "Neon Overpass VI",
        artist: "Studio Ades",
        year: "2026",
        category: "Urban Light",
        description: "Reflective asphalt capturing vivid neon street reflections after rain.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "south",
        position: [14.5, 1.8, 17.82],
        rotation: [0, Math.PI, 0]
      },
      // West Wall (Dividing Wall with Room 2, X = 4.18) - 3 Artworks
      {
        id: "r1-w1",
        image: "/images/room-1/f7.jpeg",
        title: "Atrium Ribs VII",
        artist: "Studio Ades",
        year: "2025",
        category: "Interior Spatial",
        description: "Grand white atrium ribs filtering diffuse morning sunlight.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "west",
        position: [4.18, 1.8, 6.0],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r1-w2",
        image: "/images/room-1/f8.jpeg",
        title: "Steel Cantilever VIII",
        artist: "Studio Ades",
        year: "2026",
        category: "Engineering",
        description: "Precision tension cables intersecting against deep dusk skies.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "west",
        position: [4.18, 1.8, 10.6],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r1-w3",
        image: "/images/room-1/f9.jpeg",
        title: "Travertine Shadow IX",
        artist: "Studio Ades",
        year: "2026",
        category: "Modernist",
        description: "Deep dimensional shadow lines cast across polished travertine marble panels.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "west",
        position: [4.18, 1.8, 15.2],
        rotation: [0, Math.PI / 2, 0]
      },
      // North Wall (Z = 3.38, flanking entry door at X = 11) - 2 Artworks
      {
        id: "r1-n1",
        image: "/images/room-1/f10.jpeg",
        title: "Curvilinear Tower X",
        artist: "Studio Ades",
        year: "2026",
        category: "Modern Architecture",
        description: "Parametric facade sweeping organically into the sky.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "north",
        position: [6.8, 1.8, 3.38],
        rotation: [0, 0, 0]
      },
      {
        id: "r1-n2",
        image: "/images/room-1/f11.jpeg",
        title: "Monolith & Mist XI",
        artist: "Studio Ades",
        year: "2026",
        category: "Minimalism",
        description: "Dark monolith rising cleanly above morning fog bank.",
        width: 1.5,
        height: 1.8,
        room: "room-1",
        wall: "north",
        position: [15.2, 1.8, 3.38],
        rotation: [0, 0, 0]
      }
    ]
  },

  // =========================================================================
  // ROOM 2: Bottom Left (X: -10 to 4, Z: 3.2 to 18)
  // Center: [-3, 0, 10.6], Dimensions: [14, 4, 14.8]
  // Total: 11 Artworks (3 West, 3 South, 3 East, 2 North)
  // =========================================================================
  {
    id: "room-2",
    roomNumber: 2,
    title: "ROOM 2",
    subtitle: "LIGHT & SHADOW DYNAMICS",
    description: "High-contrast chiaroscuro studies exploring the interplay of direct sunlight, sharp architectural shadows, and ethereal gradients.",
    themeColor: "#1E2A38",
    centerPosition: [-3, 0, 10.6],
    dimensions: [14, 4, 14.8],
    doorPosition: [-3, 0, 3.2],
    doorRotation: [0, 0, 0],
    artworks: [
      // West Wall (Dividing with Room 5, X = -9.82) - 3 Artworks
      {
        id: "r2-w1",
        image: "/images/room-2/1.png",
        title: "Shadow Siphon I",
        artist: "Studio Ades",
        year: "2025",
        category: "Chiaroscuro",
        description: "Dramatic diagonal ray slicing across textured limestone.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "west",
        position: [-9.82, 1.8, 6.0],
        rotation: [0, Math.PI / 2, 0],
        noFrame: true
      },
      {
        id: "r2-w2",
        image: "/images/room-2/2.jpg",
        title: "Slit Aperture II",
        artist: "Studio Ades",
        year: "2025",
        category: "Shadow Play",
        description: "Narrow architectural slit casting razor-sharp illumination.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "west",
        position: [-9.82, 1.8, 10.6],
        rotation: [0, Math.PI / 2, 0],
        noFrame: true
      },
      {
        id: "r2-w3",
        image: "/images/room-2/3.png",
        title: "Monochrome Wave III",
        artist: "Studio Ades",
        year: "2026",
        category: "Contrast Study",
        description: "Curvilinear gradients sculpted by pure directional studio light.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "west",
        position: [-9.82, 1.8, 15.2],
        rotation: [0, Math.PI / 2, 0],
        noFrame: true
      },
      // South Wall (Z = 17.82) - 3 Artworks
      {
        id: "r2-s1",
        image: "/images/room-2/4.png",
        title: "Dawn Horizon IV",
        artist: "Studio Ades",
        year: "2025",
        category: "Ambient Light",
        description: "Subtle luminescence filtering over ocean mist at daybreak.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "south",
        position: [-7.0, 1.8, 17.82],
        rotation: [0, Math.PI, 0],
        noFrame: true
      },
      {
        id: "r2-s2",
        image: "/images/room-2/5.png",
        title: "Prism Dispersion V",
        artist: "Studio Ades",
        year: "2026",
        category: "Optics",
        description: "Spectral beam refracted through solid optical glass prism.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "south",
        position: [-3.0, 1.8, 17.82],
        rotation: [0, Math.PI, 0],
        noFrame: true
      },
      {
        id: "r2-s3",
        image: "/images/room-2/6.png",
        title: "Fog Silhouette VI",
        artist: "Studio Ades",
        year: "2026",
        category: "Atmospheric",
        description: "Ethereal trees emerging as dark shapes through heavy mountain fog.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "south",
        position: [1.0, 1.8, 17.82],
        rotation: [0, Math.PI, 0],
        noFrame: true
      },
      // East Wall (Dividing Wall with Room 1, X = 3.82) - 3 Artworks
      {
        id: "r2-e1",
        image: "/images/room-2/7.png",
        title: "Alpine Reflection VII",
        artist: "Studio Ades",
        year: "2025",
        category: "Mirror Light",
        description: "Glass-like river reflecting high granite peaks at twilight.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "east",
        position: [3.82, 1.8, 6.0],
        rotation: [0, -Math.PI / 2, 0],
        noFrame: true
      },
      {
        id: "r2-e2",
        image: "/images/room-2/8.png",
        title: "Canopy Ray VIII",
        artist: "Studio Ades",
        year: "2026",
        category: "Volumetric Light",
        description: "Sunlight bursting through dense redwood needles in dramatic god-rays.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "east",
        position: [3.82, 1.8, 10.6],
        rotation: [0, -Math.PI / 2, 0],
        noFrame: true
      },
      {
        id: "r2-e3",
        image: "/images/room-2/9.png",
        title: "Foliage Glow IX",
        artist: "Studio Ades",
        year: "2026",
        category: "Translucence",
        description: "Backlit botanical leaves revealing delicate translucent veins and chlorophyll glows.",
        width: 2.2,
        height: 1.5,
        room: "room-2",
        wall: "east",
        position: [3.82, 1.8, 15.2],
        rotation: [0, -Math.PI / 2, 0],
        noFrame: true
      },
      // North Wall (Z = 3.38, flanking entry door at X = -3) - 2 Artworks
      {
        id: "r2-n1",
        image: "/images/room-2/10.png",
        title: "Valley Mist X",
        artist: "Studio Ades",
        year: "2026",
        category: "Low Light",
        description: "Rolling green hills shrouded in morning moisture.",
        width: 2.0,
        height: 1.4,
        room: "room-2",
        wall: "north",
        position: [-7.2, 1.8, 3.38],
        rotation: [0, 0, 0],
        noFrame: true
      }
      // {
      //   id: "r2-n2",
      //   image: "/images/room-2/art-11.jpg",
      //   title: "Wilderness Solitude XI",
      //   artist: "Studio Ades",
      //   year: "2026",
      //   category: "Landscape Light",
      //   description: "Warm sunset glow brushing against rugged wilderness mountain crest.",
      //   width: 2.0,
      //   height: 1.4,
      //   room: "room-2",
      //   wall: "north",
      //   position: [1.2, 1.8, 3.38],
      //   rotation: [0, 0, 0],
      //   noFrame: true
      // }
    ]
  },

  // =========================================================================
  // ROOM 3: Top Right (X: 4 to 18, Z: -18 to -3.2)
  // Center: [11, 0, -10.6], Dimensions: [14, 4, 14.8]
  // Total: 11 Artworks (3 North, 3 East, 3 West, 2 South)
  // =========================================================================
  {
    id: "room-3",
    roomNumber: 3,
    title: "ROOM 3",
    subtitle: "GEOMETRIC STRUCTURES & FORMS",
    description: "Rhythm, repetition, and mathematical beauty found in modernist architecture and structural engineering.",
    themeColor: "#334D5C",
    centerPosition: [11, 0, -10.6],
    dimensions: [14, 4, 14.8],
    doorPosition: [11, 0, -3.2],
    doorRotation: [0, Math.PI, 0],
    artworks: [
      // North Wall (Z = -17.82) - 3 Artworks
      {
        id: "r3-n1",
        image: "/images/room-3/art-1.jpg",
        title: "Tessellation Axis I",
        artist: "Studio Ades",
        year: "2025",
        category: "Geometric",
        description: "Intricate ceramic facade tiles forming an endless geometric grid.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "north",
        position: [7.5, 1.8, -17.82],
        rotation: [0, 0, 0]
      },
      {
        id: "r3-n2",
        image: "/images/room-3/art-2.jpg",
        title: "Perpendicular Shadow II",
        artist: "Studio Ades",
        year: "2025",
        category: "Minimalism",
        description: "Strict 90-degree shadow intersections on raw travertine wall.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "north",
        position: [11.0, 1.8, -17.82],
        rotation: [0, 0, 0]
      },
      {
        id: "r3-n3",
        image: "/images/room-3/art-3.jpg",
        title: "Spire Diagonal III",
        artist: "Studio Ades",
        year: "2026",
        category: "Structural",
        description: "High-contrast steel truss geometry against deep blue sky.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "north",
        position: [14.5, 1.8, -17.82],
        rotation: [0, 0, 0]
      },
      // East Wall (X = 17.82) - 3 Artworks
      {
        id: "r3-e1",
        image: "/images/room-3/art-4.jpg",
        title: "Bridge Truss IV",
        artist: "Studio Ades",
        year: "2025",
        category: "Engineering",
        description: "Symmetrical suspension cables converging in forced perspective.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "east",
        position: [17.82, 1.8, -15.2],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r3-e2",
        image: "/images/room-3/art-5.jpg",
        title: "Curved Vault V",
        artist: "Studio Ades",
        year: "2025",
        category: "Interior Spatial",
        description: "Sweeping reinforced concrete ribs spanning a modern cathedral roof.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "east",
        position: [17.82, 1.8, -10.6],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r3-e3",
        image: "/images/room-3/art-6.jpg",
        title: "Hyperbolic Paraboloid VI",
        artist: "Studio Ades",
        year: "2026",
        category: "Pure Form",
        description: "Abstract sculptural roof overhang photographed in hard midday light.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "east",
        position: [17.82, 1.8, -6.0],
        rotation: [0, -Math.PI / 2, 0]
      },
      // West Wall (Dividing Wall with Room 4, X = 4.18) - 3 Artworks
      {
        id: "r3-w1",
        image: "/images/room-3/art-7.jpg",
        title: "Linear Module VII",
        artist: "Studio Ades",
        year: "2025",
        category: "Modular",
        description: "Repetitive window louvers forming an optical rhythm.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "west",
        position: [4.18, 1.8, -15.2],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r3-w2",
        image: "/images/room-3/art-8.jpg",
        title: "Abstract Helix VIII",
        artist: "Studio Ades",
        year: "2026",
        category: "Spiral Form",
        description: "Monochrome spiral staircase looking straight up into skylight.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "west",
        position: [4.18, 1.8, -10.6],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r3-w3",
        image: "/images/room-3/art-9.jpg",
        title: "Prismatic Grid IX",
        artist: "Studio Ades",
        year: "2026",
        category: "Geometric",
        description: "Orthogonal steel beams framing dynamic atmospheric gradient sky.",
        width: 2.2,
        height: 1.5,
        room: "room-3",
        wall: "west",
        position: [4.18, 1.8, -6.0],
        rotation: [0, Math.PI / 2, 0]
      },
      // South Wall (Z = -3.38, flanking entry door at X = 11) - 2 Artworks
      {
        id: "r3-s1",
        image: "/images/room-3/art-10.jpg",
        title: "Brutalist Pillar X",
        artist: "Studio Ades",
        year: "2026",
        category: "Brutalism",
        description: "Heavy board-marked concrete supporting vast cantilever.",
        width: 2.0,
        height: 1.4,
        room: "room-3",
        wall: "south",
        position: [6.8, 1.8, -3.38],
        rotation: [0, Math.PI, 0]
      },
      {
        id: "r3-s2",
        image: "/images/room-3/art-11.jpg",
        title: "Glass Intersection XI",
        artist: "Studio Ades",
        year: "2026",
        category: "Transparency",
        description: "Multi-layered reflections in double-glazed curtain wall.",
        width: 2.0,
        height: 1.4,
        room: "room-3",
        wall: "south",
        position: [15.2, 1.8, -3.38],
        rotation: [0, Math.PI, 0]
      }
    ]
  },

  // =========================================================================
  // ROOM 4: Top Left (X: -10 to 4, Z: -18 to -3.2)
  // Center: [-3, 0, -10.6], Dimensions: [14, 4, 14.8]
  // Total: 11 Artworks (3 North, 3 West, 3 East, 2 South)
  // =========================================================================
  {
    id: "room-4",
    roomNumber: 4,
    title: "ROOM 4",
    subtitle: "NATURAL HORIZONS & WILDERNESS",
    description: "Vast landscapes, majestic horizons, and atmospheric conditions capturing pristine untamed wilderness.",
    themeColor: "#2D4030",
    centerPosition: [-3, 0, -10.6],
    dimensions: [14, 4, 14.8],
    doorPosition: [-3, 0, -3.2],
    doorRotation: [0, Math.PI, 0],
    artworks: [
      // North Wall (Z = -17.82) - 3 Artworks
      {
        id: "r4-n1",
        image: "/images/room-4/aa.jpeg",
        title: "Glacial Basin I",
        artist: "Studio Ades",
        year: "2025",
        category: "Wilderness",
        description: "Pristine alpine lake reflecting sheer granite peaks in morning stillness.",
        width: 2.2,
        height: 1.5,
        room: "room-4",
        wall: "north",
        position: [-7.0, 1.8, -17.82],
        rotation: [0, 0, 0]
      },
      {
        id: "r4-n2",
        image: "/images/room-4/a2.jpeg",
        title: "Valley Cloud Inversion II",
        artist: "Studio Ades",
        year: "2025",
        category: "Atmosphere",
        description: "Dense cloud blanket trapped in glacial valley beneath morning sun.",
        width: 2.2,
        height: 1.5,
        room: "room-4",
        wall: "north",
        position: [-3.0, 1.8, -17.82],
        rotation: [0, 0, 0]
      },
      {
        id: "r4-n3",
        image: "/images/room-4/a3.png",
        title: "Ancient Redwoods III",
        artist: "Studio Ades",
        year: "2026",
        category: "Forest Depth",
        description: "Towering centuries-old sequoia trunks disappearing into mist.",
        width: 2.2,
        height: 1.5,
        room: "room-4",
        wall: "north",
        position: [1.0, 1.8, -17.82],
        rotation: [0, 0, 0]
      },
      // West Wall (Dividing Wall with Room 5, X = -9.82) - 3 Artworks
      {
        id: "r4-w1",
        image: "/images/room-4/a4.png",
        title: "Coastal Tide IV",
        artist: "Studio Ades",
        year: "2025",
        category: "Seascapes",
        description: "Minimalist horizon line where ocean swells meet luminous twilight.",
        width: 2.2,
        height: 1.5,
        room: "room-4",
        wall: "west",
        position: [-9.82, 1.8, -15.2],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r4-w2",
        image: "/images/room-4/a5.png",
        title: "High Ridge Summit V",
        artist: "Studio Ades",
        year: "2025",
        category: "Mountain Range",
        description: "Sharp knife-edge mountain ridge catching last alpine glow.",
        width: 2.2,
        height: 1.5,
        room: "room-4",
        wall: "west",
        position: [-9.82, 1.8, -10.6],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r4-w3",
        image: "/images/room-4/a6.png",
        title: "Verdant Meadows VI",
        artist: "Studio Ades",
        year: "2026",
        category: "Open Landscapes",
        description: "Gentle rolling hills dotted with wildflowers beneath soft overcast sky.",
        width: 2.2,
        height: 1.5,
        room: "room-4",
        wall: "west",
        position: [-9.82, 1.8, -6.0],
        rotation: [0, Math.PI / 2, 0]
      },
      // East Wall (Dividing Wall with Room 3, X = 3.82) - 3 Artworks
      {
        id: "r4-e1",
        image: "/images/room-4/a7.png",
        title: "Desert Dune Crest VII",
        artist: "Studio Ades",
        year: "2025",
        category: "Desert",
        description: "Wind-sculpted sand ripples forming pristine organic waves.",
        width: 2.2,
        height: 1.5,
        room: "room-4",
        wall: "east",
        position: [3.82, 1.8, -15.2],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r4-e2",
        image: "/images/room-4/a8.png",
        title: "Tundra Silence VIII",
        artist: "Studio Ades",
        year: "2026",
        category: "Arctic",
        description: "Sparse snow-covered rocks under soft pastel polar twilight.",
        width: 1.5,
        height: 1.8,
        room: "room-4",
        wall: "east",
        position: [3.82, 1.8, -10.6],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r4-e3",
        image: "/images/room-4/a9.png",
        title: "Alpine Spires IX",
        artist: "Studio Ades",
        year: "2026",
        category: "High Altitude",
        description: "Jagged granite monoliths ascending through low-hanging cirrus cloud layers.",
        width: 2.2,
        height: 1.5,
        room: "room-4",
        wall: "east",
        position: [3.82, 1.8, -6.0],
        rotation: [0, -Math.PI / 2, 0]
      }
      // South Wall (Z = -3.38, flanking entry door at X = -3) - 2 Artworks
      // {
      //   id: "r4-s1",
      //   image: "/images/room-4/art-10.jpg",
      //   title: "Volcanic Caldera X",
      //   artist: "Studio Ades",
      //   year: "2026",
      //   category: "Geology",
      //   description: "Obsidian rock formations encircling mineral-rich turquoise waters.",
      //   width: 2.0,
      //   height: 1.4,
      //   room: "room-4",
      //   wall: "south",
      //   position: [-7.2, 1.8, -3.38],
      //   rotation: [0, Math.PI, 0]
      // },
      // {
      //   id: "r4-s2",
      //   image: "/images/room-4/art-11.jpg",
      //   title: "Autumn Canopy XI",
      //   artist: "Studio Ades",
      //   year: "2026",
      //   category: "Seasonal",
      //   description: "Golden beech leaves fluttering down to forest floor.",
      //   width: 2.0,
      //   height: 1.4,
      //   room: "room-4",
      //   wall: "south",
      //   position: [1.2, 1.8, -3.38],
      //   rotation: [0, Math.PI, 0]
      // }
    ]
  },

  // =========================================================================
  // ROOM 5: Long Rectangular Gallery on Left Side (X: -18 to -10, Z: -18 to 18)
  // Center: [-14, 0, 0], Dimensions: [8, 4, 36]
  // ONLY ONE door opening from corridor on its right wall: [-10, 0, 0]
  // Main Entrance Door at bottom-left: [-15, 0, 18]
  // =========================================================================
  {
    id: "room-5",
    roomNumber: 5,
    title: "ROOM 5",
    subtitle: "CONTEMPORARY RETROSPECTIVE WING",
    description: "The grand longitudinal gallery wing featuring monumental large-format prints, rare archival studies, and landmark photographic series.",
    themeColor: "#3D3A37",
    centerPosition: [-14, 0, 0],
    dimensions: [8, 4, 36],
    doorPosition: [-10, 0, 0], // Door on right wall facing corridor
    doorRotation: [0, -Math.PI / 2, 0],
    artworks: [
      // Long West Wall (X = -17.82) - 8 Artworks
      {
        id: "r5-w1",
        image: "/images/room-5/t1.jpg",
        title: "Chromatic Tension I",
        artist: "Studio Ades",
        year: "2024",
        category: "Retrospective",
        description: "Monumental study in suspended fluid tension and pigment dynamics.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "west",
        position: [-17.82, 1.8, -14.0],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r5-w2",
        image: "/images/room-5/t2.png",
        title: "Monochrome Undulations II",
        artist: "Studio Ades",
        year: "2024",
        category: "Retrospective",
        description: "Large-format silver gelatin print of flowing organic curves.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "west",
        position: [-17.82, 1.8, -10.0],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r5-w3",
        image: "/images/room-5/3.png",
        title: "Travertine Diptych III",
        artist: "Studio Ades",
        year: "2025",
        category: "Retrospective",
        description: "Sharp stone textures and cast shadows in stark geometric harmony.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "west",
        position: [-17.82, 1.8, -6.0],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r5-w4",
        image: "/images/room-5/t4.png",
        title: "Golden Hour Solitude IV",
        artist: "Studio Ades",
        year: "2025",
        category: "Retrospective",
        description: "Minimal coastal landscape bathed in warm horizontal evening light.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "west",
        position: [-17.82, 1.8, -2.0],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r5-w5",
        image: "/images/room-5/t5.png",
        title: "Vertical Monolith V",
        artist: "Studio Ades",
        year: "2025",
        category: "Retrospective",
        description: "Towering skyscraper corner cutting cleanly into cloudless sky.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "west",
        position: [-17.82, 1.8, 2.0],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r5-w6",
        image: "/images/room-5/t6.png",
        title: "Architectural Grid VI",
        artist: "Studio Ades",
        year: "2026",
        category: "Retrospective",
        description: "Balcony tessellations forming an abstract modernist pattern.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "west",
        position: [-17.82, 1.8, 6.0],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r5-w7",
        image: "/images/room-5/t7.png",
        title: "Prismatic Horizon VII",
        artist: "Studio Ades",
        year: "2026",
        category: "Retrospective",
        description: "Atmospheric diffraction gradients captured across alpine summit ridgelines.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "west",
        position: [-17.82, 1.8, 10.0],
        rotation: [0, Math.PI / 2, 0]
      },
      {
        id: "r5-w8",
        image: "/images/room-5/t8.png",
        title: "Dune Crests VIII",
        artist: "Studio Ades",
        year: "2026",
        category: "Retrospective",
        description: "High-contrast wind sculpted ridges in sweeping desert landscape.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "west",
        position: [-17.82, 1.8, 14.0],
        rotation: [0, Math.PI / 2, 0]
      },

      // North Wall (Z = -17.82) - 2 Artworks
      {
        id: "r5-n1",
        image: "/images/room-5/t9.png",
        title: "Forest Solitude IX",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Dramatic mountain forest illuminated by dawn light rays.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "north",
        position: [-15.5, 1.8, -17.82],
        rotation: [0, 0, 0]
      },
      {
        id: "r5-n2",
        image: "/images/room-5/t10.jpg",
        title: "Granite Sanctuary X",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Towering glacial peaks rising above subalpine meadow flora.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "north",
        position: [-12.5, 1.8, -17.82],
        rotation: [0, 0, 0]
      },

      // East Wall Upper Section (X = -10.18, North of door: Z = -18 to -1.5) - 3 Artworks
      {
        id: "r5-e1",
        image: "/images/room-5/t11.jpg",
        title: "Alpine Horizon XI",
        artist: "Studio Ades",
        year: "2025",
        category: "Masterpiece",
        description: "Yosemite peaks reflected in mirror-like river waters.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "east",
        position: [-10.18, 1.8, -14.0],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r5-e2",
        image: "/images/room-5/t12.jpg",
        title: "Volumetric Cathedral XII",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Sunlight pouring through towering redwood forest canopy.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "east",
        position: [-10.18, 1.8, -9.5],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r5-e3",
        image: "/images/room-5/art-13.jpg",
        title: "Patagonian Zenith XIII",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Cerro Torre granite spires piercing swirling storm clouds.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "east",
        position: [-10.18, 1.8, -5.0],
        rotation: [0, -Math.PI / 2, 0]
      },

      // East Wall Lower Section (X = -10.18, South of door: Z = 1.5 to 18) - 3 Artworks
      {
        id: "r5-e4",
        image: "/images/room-5/art-14.jpg",
        title: "Metropolis Grid XIV",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Vibrant city illumination captured from high altitude.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "east",
        position: [-10.18, 1.8, 5.0],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r5-e5",
        image: "/images/room-5/art-15.jpg",
        title: "Concrete Canyon XV",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Sharp architectural geometry descending through dramatic urban chasms.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "east",
        position: [-10.18, 1.8, 9.5],
        rotation: [0, -Math.PI / 2, 0]
      },
      {
        id: "r5-e6",
        image: "/images/room-5/art-16.jpg",
        title: "Canopy Shimmer XVI",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Emerald green botanical foliage capturing morning dew refractions.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "east",
        position: [-10.18, 1.8, 14.0],
        rotation: [0, -Math.PI / 2, 0]
      },

      // South Wall (Z = 17.82) - 2 Artworks
      {
        id: "r5-s1",
        image: "/images/room-5/art-17.jpg",
        title: "Neon Reflections XVII",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Vibrant urban reflections dancing across wet city streets.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "south",
        position: [-15.5, 1.8, 17.82],
        rotation: [0, Math.PI, 0]
      },
      {
        id: "r5-s2",
        image: "/images/room-5/art-18.jpg",
        title: "Golden Hour Pines XVIII",
        artist: "Studio Ades",
        year: "2026",
        category: "Masterpiece",
        description: "Silhouetted evergreen ridge line fading into warm sunset horizon.",
        width: 2.2,
        height: 1.5,
        room: "room-5",
        wall: "south",
        position: [-12.5, 1.8, 17.82],
        rotation: [0, Math.PI, 0]
      }
    ]
  }
];

export interface NavigationNode {
  id: string;
  label: string;
  room?: string;
  position: [number, number, number];
  cameraTarget: [number, number, number];
  nextId?: string;
  prevId?: string;
}

export const NAVIGATION_NODES: NavigationNode[] = [
  // 1. Entrance Area (South-West corner of Room 5)
  {
    id: "entrance",
    label: "Main Gallery Entrance",
    room: "room-5",
    position: [-15, 1.65, 15],
    cameraTarget: [-15, 1.65, 0],
    nextId: "room-5-center",
    prevId: "room-1-center"
  },
  // 2. Room 5 Center
  {
    id: "room-5-center",
    label: "Room 5 - Retrospective Gallery",
    room: "room-5",
    position: [-14, 1.65, 0],
    cameraTarget: [-10, 1.65, 0],
    nextId: "corridor-west",
    prevId: "entrance"
  },
  // 3. Central Corridor West (near Room 5 door)
  {
    id: "corridor-west",
    label: "Central Corridor (West)",
    room: "hallway",
    position: [-7, 1.65, 0],
    cameraTarget: [4, 1.65, 0],
    nextId: "room-4-center",
    prevId: "room-5-center"
  },
  // 4. Room 4 (Top Left)
  {
    id: "room-4-center",
    label: "Room 4 - Natural Horizons",
    room: "room-4",
    position: [-3, 1.65, -10.6],
    cameraTarget: [-3, 1.65, -17],
    nextId: "room-3-center",
    prevId: "corridor-west"
  },
  // 5. Room 3 (Top Right)
  {
    id: "room-3-center",
    label: "Room 3 - Geometric Structures",
    room: "room-3",
    position: [11, 1.65, -10.6],
    cameraTarget: [11, 1.65, -17],
    nextId: "corridor-east",
    prevId: "room-4-center"
  },
  // 6. Central Corridor East
  {
    id: "corridor-east",
    label: "Central Corridor",
    room: "hallway",
    position: [6.5, 1.65, 0],
    cameraTarget: [-10, 1.65, 0],
    nextId: "room-1-center",
    prevId: "room-3-center"
  },
  // 7. Room 1 (Bottom Right)
  {
    id: "room-1-center",
    label: "Room 1 - Urban Perspectives",
    room: "room-1",
    position: [11, 1.65, 10.6],
    cameraTarget: [11, 1.65, 17],
    nextId: "room-2-center",
    prevId: "corridor-east"
  },
  // 8. Room 2 (Bottom Left)
  {
    id: "room-2-center",
    label: "Room 2 - Light & Shadow",
    room: "room-2",
    position: [-3, 1.65, 10.6],
    cameraTarget: [-3, 1.65, 17],
    nextId: "entrance",
    prevId: "room-1-center"
  }
];
