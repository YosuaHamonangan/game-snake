/**
 * Returns the cache key for the corresponding key's asset
 * @param key string
 * @returns assetKey (string)
 */
export function getAssetId(key: number) {
  return `ASSET_${key}`;
}

export function getSpriteFrameId(id: string, frameKey?: number | string) {
  if (frameKey !== undefined) {
    return `ASSET_${id}_${frameKey}`;
  }
  return id;
}
