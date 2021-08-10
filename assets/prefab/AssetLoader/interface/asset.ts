import {
  ASSET_EXTENSION,
  ASSET_TYPE,
  AUDIO_KEY,
  IMAGE_KEY,
  SPRITESHEET_KEY,
} from "../enum/asset";

export interface ImageInfo {
  key: IMAGE_KEY;
  type: ASSET_TYPE.IMAGE;
  url: string;
  ext?: ASSET_EXTENSION;
  localUrl?: string;
}

export interface SpritesheetConfig {
  frameWidth?: number;
  frameHeight?: number;
  paddingX?: number;
  paddingY?: number;
}

export interface SpritesheetInfo {
  key: SPRITESHEET_KEY;
  type: ASSET_TYPE.SPRITESHEET;
  url: string;
  ext?: ASSET_EXTENSION;
  localUrl?: string;
  config?: SpritesheetConfig;
}

export interface AudioInfo {
  key: AUDIO_KEY;
  type: ASSET_TYPE.AUDIO;
  url: string;
  ext?: ASSET_EXTENSION;
  localUrl?: string;
}

export type AssetInfo = ImageInfo | SpritesheetInfo | AudioInfo;
