/**
 * Image optimization utilities for virtual exhibition textures.
 * Formats URLs with modern WebP/AVIF auto-format, responsive sizing, and optimal compression.
 */

export function getOptimizedImageUrl(url: string, width = 720, quality = 75): string {
  if (!url) return url;
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  return url;
}

export function getHighResImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes('unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&w=1600&q=85`;
  }
  return url;
}
