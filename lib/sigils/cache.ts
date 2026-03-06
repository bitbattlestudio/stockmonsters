// lib/sigils/cache.ts

import * as fs from 'fs';
import * as path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'public', 'sprites', 'generated');
const CDN_PATH = '/sprites/generated';

function getCacheKey(
  identifier: string,
  state: number,
  type: string
): string {
  return `${type}_${identifier.toUpperCase()}_${state}.png`;
}

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Check if a sigil exists in the local cache
 */
export async function getCachedSigil(
  identifier: string,
  state: number,
  type: 'stock' | 'market' = 'stock'
): Promise<string | null> {
  const filename = getCacheKey(identifier, state, type);
  const filepath = path.join(CACHE_DIR, filename);

  try {
    if (fs.existsSync(filepath)) {
      return `${CDN_PATH}/${filename}`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save a sigil to the local cache
 */
export async function cacheSigil(
  identifier: string,
  state: number,
  type: 'stock' | 'market',
  imageUrl: string
): Promise<string> {
  ensureCacheDir();

  const filename = getCacheKey(identifier, state, type);
  const filepath = path.join(CACHE_DIR, filename);

  // Download image from PixelLab
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  // Save to local file
  fs.writeFileSync(filepath, Buffer.from(buffer));

  return `${CDN_PATH}/${filename}`;
}

/**
 * Save a sigil from base64 data
 */
export async function cacheSigilFromBase64(
  identifier: string,
  state: number,
  type: 'stock' | 'market',
  base64Data: string
): Promise<string> {
  ensureCacheDir();

  const filename = getCacheKey(identifier, state, type);
  const filepath = path.join(CACHE_DIR, filename);

  // Decode base64 and save
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filepath, buffer);

  return `${CDN_PATH}/${filename}`;
}

/**
 * List all cached sigils
 */
export function listCachedSigils(): string[] {
  ensureCacheDir();

  try {
    return fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith('.png'));
  } catch {
    return [];
  }
}

/**
 * Clear all cached sigils
 */
export function clearCache(): void {
  ensureCacheDir();

  const files = fs.readdirSync(CACHE_DIR);
  for (const file of files) {
    fs.unlinkSync(path.join(CACHE_DIR, file));
  }
}

/**
 * Get cache stats
 */
export function getCacheStats(): { count: number; totalSize: number } {
  ensureCacheDir();

  const files = fs.readdirSync(CACHE_DIR).filter((f) => f.endsWith('.png'));
  let totalSize = 0;

  for (const file of files) {
    const stat = fs.statSync(path.join(CACHE_DIR, file));
    totalSize += stat.size;
  }

  return { count: files.length, totalSize };
}
