import { TextureLoader, Texture, CanvasTexture, SRGBColorSpace, LinearMipmapLinearFilter, LinearFilter } from 'three';
import { ArtworkData } from '../data/exhibitions';
import { getOptimizedImageUrl } from './imageOptimizer';

// Singleton TextureLoader
const textureLoader = new TextureLoader();

// In-memory cache for loaded WebGL textures
interface CachedTextureEntry {
  texture: Texture;
  url: string;
  roomId: string;
  refCount: number;
  lastAccessed: number;
}

const textureCache = new Map<string, CachedTextureEntry>();
const placeholderCache = new Map<string, CanvasTexture>();

// Maximum number of distinct high-res image textures to keep in GPU memory simultaneously
const MAX_CACHED_TEXTURES = 32;

const ARTWORK_LOAD_DISTANCE = 18;

/**
 * Keep the current room and nearby artwork textures ready while avoiding an eager
 * request for the full gallery at startup.
 */
export function isRoomWithinLoadDistance(
  roomId: string,
  activeRoomId: string,
  visitorPos: [number, number, number],
  artworkPosition?: [number, number, number]
): boolean {
  if (roomId === 'hallway' || roomId === activeRoomId) return true;
  if (!artworkPosition) return false;

  const dx = artworkPosition[0] - visitorPos[0];
  const dz = artworkPosition[2] - visitorPos[2];
  return dx * dx + dz * dz <= ARTWORK_LOAD_DISTANCE * ARTWORK_LOAD_DISTANCE;
}

/**
 * Procedural art style generator for realistic, high-definition photography artwork placeholders
 */
export function getOrCreatePlaceholderTexture(artwork: ArtworkData): CanvasTexture {
  const cached = placeholderCache.get(artwork.id);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  const targetW = 512;
  const targetH = 358;
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const empty = new CanvasTexture(canvas);
    placeholderCache.set(artwork.id, empty);
    return empty;
  }

  // Deterministic seed hash
  let hash = 0;
  const seedStr = artwork.id + artwork.title + artwork.category;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const rng = (offset = 0) => {
    const x = Math.sin(hash + offset) * 10000;
    return x - Math.floor(x);
  };

  const cat = artwork.category.toLowerCase();
  const title = artwork.title;

  // 1. Photographic Scenery Background
  if (cat.includes('nature') || cat.includes('landscape') || cat.includes('forest') || cat.includes('alpine') || cat.includes('botanical')) {
    // Landscape / Nature photography placeholder
    const skyGrad = ctx.createLinearGradient(0, 0, 0, targetH * 0.65);
    skyGrad.addColorStop(0, '#2b4162');
    skyGrad.addColorStop(0.5, '#726a95');
    skyGrad.addColorStop(1, '#e8a598');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, targetW, targetH * 0.65);

    // Sun / Moon glow
    const sunGrad = ctx.createRadialGradient(targetW * 0.6, targetH * 0.35, 10, targetW * 0.6, targetH * 0.35, 180);
    sunGrad.addColorStop(0, 'rgba(255, 245, 220, 0.9)');
    sunGrad.addColorStop(0.3, 'rgba(255, 200, 140, 0.4)');
    sunGrad.addColorStop(1, 'rgba(255, 200, 140, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(targetW * 0.6, targetH * 0.35, 180, 0, Math.PI * 2);
    ctx.fill();

    // Distant mountain layer
    ctx.fillStyle = '#4a3f55';
    ctx.beginPath();
    ctx.moveTo(0, targetH * 0.5);
    ctx.lineTo(targetW * 0.25, targetH * 0.32);
    ctx.lineTo(targetW * 0.5, targetH * 0.48);
    ctx.lineTo(targetW * 0.75, targetH * 0.35);
    ctx.lineTo(targetW, targetH * 0.45);
    ctx.lineTo(targetW, targetH);
    ctx.lineTo(0, targetH);
    ctx.closePath();
    ctx.fill();

    // Midground pine ridge / mountain silhouette
    ctx.fillStyle = '#262938';
    ctx.beginPath();
    ctx.moveTo(0, targetH * 0.58);
    ctx.lineTo(targetW * 0.35, targetH * 0.44);
    ctx.lineTo(targetW * 0.65, targetH * 0.55);
    ctx.lineTo(targetW, targetH * 0.48);
    ctx.lineTo(targetW, targetH);
    ctx.lineTo(0, targetH);
    ctx.closePath();
    ctx.fill();

    // Foreground lake reflection / meadow
    const groundGrad = ctx.createLinearGradient(0, targetH * 0.6, 0, targetH);
    groundGrad.addColorStop(0, '#1a1f2c');
    groundGrad.addColorStop(1, '#0e121a');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, targetH * 0.6, targetW, targetH * 0.4);

    // Water reflection shimmer
    ctx.strokeStyle = 'rgba(255, 220, 180, 0.15)';
    ctx.lineWidth = 2;
    for (let y = targetH * 0.65; y < targetH; y += 12) {
      ctx.beginPath();
      ctx.moveTo(targetW * 0.4 + (Math.random() - 0.5) * 60, y);
      ctx.lineTo(targetW * 0.8 + (Math.random() - 0.5) * 60, y);
      ctx.stroke();
    }
  } else if (cat.includes('arch') || cat.includes('brutal') || cat.includes('form') || cat.includes('interior') || cat.includes('geometric')) {
    // Architecture / Form photography placeholder
    const bgGrad = ctx.createLinearGradient(0, 0, targetW, targetH);
    bgGrad.addColorStop(0, '#1c1e24');
    bgGrad.addColorStop(0.5, '#2e3440');
    bgGrad.addColorStop(1, '#181a1f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, targetW, targetH);

    // Clean diagonal cantilever structure
    ctx.fillStyle = '#434c5e';
    ctx.beginPath();
    ctx.moveTo(0, targetH * 0.2);
    ctx.lineTo(targetW * 0.7, 0);
    ctx.lineTo(targetW * 0.85, targetH * 0.8);
    ctx.lineTo(0, targetH);
    ctx.closePath();
    ctx.fill();

    // Highlight edge
    ctx.strokeStyle = '#88c0d0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, targetH * 0.2);
    ctx.lineTo(targetW * 0.7, 0);
    ctx.lineTo(targetW * 0.85, targetH * 0.8);
    ctx.stroke();

    // Rhythmic window / mullion grid lines
    ctx.strokeStyle = 'rgba(236, 239, 244, 0.18)';
    ctx.lineWidth = 1.5;
    for (let x = 80; x < targetW * 0.7; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, targetH * 0.25);
      ctx.lineTo(x + 120, targetH * 0.85);
      ctx.stroke();
    }
  } else if (cat.includes('portrait') || cat.includes('fine art') || cat.includes('character')) {
    // Portrait / Studio chiaroscuro photography placeholder
    const bgGrad = ctx.createRadialGradient(targetW * 0.5, targetH * 0.45, 50, targetW * 0.5, targetH * 0.5, targetW * 0.6);
    bgGrad.addColorStop(0, '#3b2f2f');
    bgGrad.addColorStop(0.6, '#1e1717');
    bgGrad.addColorStop(1, '#0d0a0a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, targetW, targetH);

    // Elegant studio portrait silhouette
    ctx.fillStyle = '#d4a373';
    ctx.globalAlpha = 0.85;
    // Head / Neck / Shoulders
    ctx.beginPath();
    ctx.arc(targetW * 0.5, targetH * 0.38, targetH * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(targetW * 0.44, targetH * 0.52);
    ctx.lineTo(targetW * 0.56, targetH * 0.52);
    ctx.lineTo(targetW * 0.75, targetH * 0.95);
    ctx.lineTo(targetW * 0.25, targetH * 0.95);
    ctx.closePath();
    ctx.fill();

    // Rim lighting highlight
    ctx.strokeStyle = '#faedcd';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(targetW * 0.5, targetH * 0.38, targetH * 0.18, -Math.PI * 0.4, Math.PI * 0.3);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  } else if (cat.includes('urban') || cat.includes('city') || cat.includes('night') || cat.includes('motion')) {
    // Urban / Nightlife / Neon photography placeholder
    ctx.fillStyle = '#0b0c10';
    ctx.fillRect(0, 0, targetW, targetH);

    // Cyberpunk neon wet street reflections
    const neonGrad1 = ctx.createRadialGradient(targetW * 0.3, targetH * 0.4, 10, targetW * 0.3, targetH * 0.4, 250);
    neonGrad1.addColorStop(0, 'rgba(255, 0, 127, 0.65)');
    neonGrad1.addColorStop(1, 'rgba(255, 0, 127, 0)');
    ctx.fillStyle = neonGrad1;
    ctx.fillRect(0, 0, targetW, targetH);

    const neonGrad2 = ctx.createRadialGradient(targetW * 0.7, targetH * 0.35, 10, targetW * 0.7, targetH * 0.35, 220);
    neonGrad2.addColorStop(0, 'rgba(0, 240, 255, 0.65)');
    neonGrad2.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = neonGrad2;
    ctx.fillRect(0, 0, targetW, targetH);

    // Traffic light trails
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ff0055';
    ctx.beginPath();
    ctx.moveTo(0, targetH * 0.7);
    ctx.bezierCurveTo(targetW * 0.3, targetH * 0.68, targetW * 0.6, targetH * 0.75, targetW, targetH * 0.62);
    ctx.stroke();

    ctx.strokeStyle = '#00e5ff';
    ctx.beginPath();
    ctx.moveTo(0, targetH * 0.75);
    ctx.bezierCurveTo(targetW * 0.4, targetH * 0.78, targetW * 0.7, targetH * 0.72, targetW, targetH * 0.8);
    ctx.stroke();
  } else {
    // Abstract / Macro / Textural photography placeholder
    const radGrad = ctx.createRadialGradient(targetW * 0.45, targetH * 0.45, 30, targetW * 0.5, targetH * 0.5, targetW * 0.55);
    radGrad.addColorStop(0, '#e67e22');
    radGrad.addColorStop(0.4, '#2980b9');
    radGrad.addColorStop(0.8, '#2c3e50');
    radGrad.addColorStop(1, '#1a252f');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, targetW, targetH);

    // Swirling fluid dynamics rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    for (let r = 60; r < 360; r += 36) {
      ctx.beginPath();
      ctx.ellipse(targetW * 0.5, targetH * 0.5, r, r * 0.65, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 2. High-grade photographic film grain
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 3000; i++) {
    const px = Math.random() * targetW;
    const py = Math.random() * targetH;
    ctx.fillRect(px, py, 1.5, 1.5);
  }

  // 3. Fine Art Inner Border & Matte Vignette
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, targetW - 32, targetH - 32);

  // 4. Curatorial Label Watermark
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 24px "Plus Jakarta Sans", "Helvetica Neue", sans-serif';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText(title.toUpperCase(), 36, targetH - 42);

  ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(`${artwork.artist} • ${artwork.year}`, 36, targetH - 20);

  ctx.textAlign = 'right';
  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(artwork.category.toUpperCase(), targetW - 36, targetH - 20);

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.needsUpdate = true;

  placeholderCache.set(artwork.id, tex);
  return tex;
}

/**
 * Load artwork texture with caching, compression, and LRU eviction
 */
export function loadArtworkTexture(
  artwork: ArtworkData,
  onLoaded: (tex: Texture) => void
): () => void {
  const optimizedUrl = getOptimizedImageUrl(artwork.image, 720, 75);
  const cacheKey = artwork.id;

  let isSubscribed = true;

  // 1. If already in cache, reuse immediately
  const existing = textureCache.get(cacheKey);
  if (existing) {
    existing.refCount += 1;
    existing.lastAccessed = Date.now();
    onLoaded(existing.texture);

    return () => {
      isSubscribed = false;
      if (existing) {
        existing.refCount = Math.max(0, existing.refCount - 1);
      }
    };
  }

  // 2. Load asynchronously via Three.js TextureLoader
  textureLoader.load(
    optimizedUrl,
    (texture) => {
      if (!isSubscribed) {
        // Cancelled before load completed
        texture.dispose();
        return;
      }

      texture.colorSpace = SRGBColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = LinearMipmapLinearFilter;
      texture.anisotropy = 4; // High-precision sampling from oblique angles

      // Check if cache size exceeds limit, evict oldest unreferenced textures
      if (textureCache.size >= MAX_CACHED_TEXTURES) {
        evictOldestTextures();
      }

      const entry: CachedTextureEntry = {
        texture,
        url: optimizedUrl,
        roomId: artwork.room,
        refCount: 1,
        lastAccessed: Date.now()
      };
      textureCache.set(cacheKey, entry);
      onLoaded(texture);
    },
    undefined,
    () => {
      // On error, fallback remains active
    }
  );

  return () => {
    isSubscribed = false;
    const entry = textureCache.get(cacheKey);
    if (entry) {
      entry.refCount = Math.max(0, entry.refCount - 1);
    }
  };
}

/**
 * Evicts least recently accessed textures with 0 active references
 */
function evictOldestTextures() {
  const unreferenced: [string, CachedTextureEntry][] = [];
  for (const [key, entry] of textureCache.entries()) {
    if (entry.refCount <= 0) {
      unreferenced.push([key, entry]);
    }
  }

  // Sort by oldest accessed first
  unreferenced.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

  // Evict top 8
  const toEvict = unreferenced.slice(0, 8);
  for (const [key, entry] of toEvict) {
    entry.texture.dispose();
    textureCache.delete(key);
  }
}

/**
 * Dispose texture for a specific artwork when unmounted
 */
export function unloadArtworkTexture(artworkId: string) {
  const entry = textureCache.get(artworkId);
  if (entry) {
    entry.refCount = Math.max(0, entry.refCount - 1);
    if (entry.refCount <= 0) {
      entry.texture.dispose();
      textureCache.delete(artworkId);
    }
  }
}

/**
 * Clear all cached textures when cleaning up
 */
export function clearAllTextureCaches() {
  for (const entry of textureCache.values()) {
    entry.texture.dispose();
  }
  textureCache.clear();

  for (const tex of placeholderCache.values()) {
    tex.dispose();
  }
  placeholderCache.clear();
}
