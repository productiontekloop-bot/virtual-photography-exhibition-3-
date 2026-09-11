import { TextureLoader, Texture, SRGBColorSpace, LinearFilter } from 'three';
import { ArtworkData, EXHIBITIONS } from '../data/exhibitions';
import { getOptimizedImageUrl } from './imageOptimizer';

// Singleton TextureLoader
const textureLoader = new TextureLoader();

// In-memory cache for loaded WebGL textures
interface CachedTextureEntry {
  texture: Texture;
  refCount: number;
  lastAccessed: number;
}

const textureCache = new Map<string, CachedTextureEntry>();
const pendingLoads = new Map<string, Set<(texture: Texture) => void>>();
const progressListeners = new Set<(loaded: number, total: number) => void>();
const textureLoadQueue: Array<() => void> = [];
let activeTextureLoads = 0;
let textureQueueScheduled = false;
let requestedTextureCount = 0;
let loadedTextureCount = 0;

// Maximum number of distinct high-res image textures to keep in GPU memory simultaneously
const MAX_CACHED_TEXTURES = 64;

const MAX_CONCURRENT_TEXTURE_LOADS = 6;

function processTextureLoadQueue() {
  textureQueueScheduled = false;
  while (activeTextureLoads < MAX_CONCURRENT_TEXTURE_LOADS && textureLoadQueue.length > 0) {
    activeTextureLoads += 1;
    textureLoadQueue.shift()?.();
  }
}

function finishTextureLoad() {
  activeTextureLoads = Math.max(0, activeTextureLoads - 1);
  if (textureLoadQueue.length > 0 && !textureQueueScheduled) {
    textureQueueScheduled = true;
    setTimeout(processTextureLoadQueue, 0);
  }
}

function notifyProgress() {
  progressListeners.forEach((listener) => listener(loadedTextureCount, requestedTextureCount));
}

function releaseTexture(cacheKey: string) {
  const entry = textureCache.get(cacheKey);
  if (!entry) return;
  entry.refCount = Math.max(0, entry.refCount - 1);
  if (entry.refCount === 0 && !pendingLoads.has(cacheKey)) {
    entry.texture.dispose();
    textureCache.delete(cacheKey);
  }
}

export function subscribeToTextureProgress(listener: (loaded: number, total: number) => void) {
  progressListeners.add(listener);
  listener(loadedTextureCount, requestedTextureCount);
  return () => progressListeners.delete(listener);
}

export function preloadRoomAssets(roomIds: string[]) {
  roomIds.forEach((roomId) => {
    const room = EXHIBITIONS.find((candidate) => candidate.id === roomId);
    room?.artworks.forEach((artwork) => loadArtworkTexture(artwork, () => undefined));
  });
}

/**
 * Load artwork texture with caching, compression, and LRU eviction
 */
export function loadArtworkTexture(
  artwork: ArtworkData,
  onLoaded: (tex: Texture) => void
): () => void {
  const optimizedUrl = getOptimizedImageUrl(artwork.image, 720, 75);
  const cacheKey = optimizedUrl;

  let isSubscribed = true;

  // 1. If already in cache, reuse immediately
  const existing = textureCache.get(cacheKey);
  if (existing) {
    existing.refCount += 1;
    existing.lastAccessed = Date.now();
    onLoaded(existing.texture);

    return () => {
      isSubscribed = false;
      releaseTexture(cacheKey);
    };
  }

  // Share an in-flight request between artwork meshes and preloads.
  const pending = pendingLoads.get(cacheKey);
  if (pending) {
    pending.add((texture) => {
      if (!isSubscribed) return;
      const entry = textureCache.get(cacheKey);
      if (entry) {
        entry.refCount += 1;
        entry.lastAccessed = Date.now();
      }
      onLoaded(texture);
    });
    return () => {
      isSubscribed = false;
    };
  }

  pendingLoads.set(cacheKey, new Set());
  requestedTextureCount += 1;
  notifyProgress();

  // Queue image decoding and GPU uploads so entering a room cannot start a large burst.
  textureLoadQueue.push(() => textureLoader.load(
    optimizedUrl,
    (texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
      texture.generateMipmaps = false;
      texture.minFilter = LinearFilter;
      texture.anisotropy = 1;

      // Check if cache size exceeds limit, evict oldest unreferenced textures
      if (textureCache.size >= MAX_CACHED_TEXTURES) {
        evictOldestTextures();
      }

      const entry: CachedTextureEntry = {
        texture,
        refCount: isSubscribed ? 1 : 0,
        lastAccessed: Date.now()
      };
      textureCache.set(cacheKey, entry);
      loadedTextureCount += 1;
      notifyProgress();
      const listeners = pendingLoads.get(cacheKey);
      pendingLoads.delete(cacheKey);
      listeners?.forEach((listener) => listener(texture));
      if (isSubscribed) onLoaded(texture);
      finishTextureLoad();
    },
    undefined,
    () => {
      pendingLoads.delete(cacheKey);
      loadedTextureCount += 1;
      notifyProgress();
      finishTextureLoad();
    }
  ));
  processTextureLoadQueue();

  return () => {
    isSubscribed = false;
    releaseTexture(cacheKey);
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
 * Clear all cached textures when cleaning up
 */
export function clearAllTextureCaches() {
  for (const entry of textureCache.values()) {
    entry.texture.dispose();
  }
  textureCache.clear();
}
