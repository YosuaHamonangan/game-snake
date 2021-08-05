import { Enum } from "cc";
export enum ASSET_EXTENSION {
  PNG = ".png",
}

export enum ASSET_TYPE {
  IMAGE = "image",
  SPRITESHEET = "spritesheet",
  AUDIO = "audio",
}

export enum ASSET_KEY {
  SNAKE,
  TILE,
  FOOD,
  WALL,
  ONLINE,
}

export const ASSET_KEY_PROP = { type: Enum(ASSET_KEY) };
