import {
  ASSET_TYPE,
  AUDIO_KEY,
  IMAGE_KEY,
  SPRITESHEET_KEY,
} from "../enum/asset";

export function getImageId(key: IMAGE_KEY) {
  return `image_${key}`;
}

export function getSpriteFrameId(
  key: SPRITESHEET_KEY,
  frameKey?: number | string
) {
  if (frameKey !== undefined) return `spritesheet_${key}_${frameKey}`;
  return `spritesheet_${key}`;
}

export function getAudioId(key: AUDIO_KEY) {
  return `audio_${key}`;
}

export function getAssetId(type: ASSET_TYPE, key: number) {
  switch (type) {
    case ASSET_TYPE.SPRITESHEET: {
      return getSpriteFrameId(key);
    }

    case ASSET_TYPE.IMAGE: {
      return getImageId(key);
    }

    case ASSET_TYPE.AUDIO: {
      return getAudioId(key);
    }
  }
}
