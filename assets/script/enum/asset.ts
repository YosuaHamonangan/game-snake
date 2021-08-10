import { Enum } from "cc";
export enum ASSET_EXTENSION {
  PNG = ".png",
}

export enum ASSET_TYPE {
  IMAGE = "image",
  SPRITESHEET = "spritesheet",
  AUDIO = "audio",
}

export enum IMAGE_KEY {
  _ = 0,
  TILE = 2,
  FOOD = 3,
  WALL = 4,
  ARROW_UP = 5,
  ARROW_DOWN = 6,
  ARROW_LEFT = 7,
  ARROW_RIGHT = 8,
  LOGO_SHOPEE_ULAR = 9,
  TROPHY = 10,
  SOUND_ON = 11,
  SOUND_OFF = 12,
  ONLINE = 100,
}
export const IMAGE_KEY_PROP = { type: Enum(IMAGE_KEY) };

export enum SPRITESHEET_KEY {
  _ = 0,
  SNAKE = 1,
}
export const SPRITESHEET_KEY_PROP = { type: Enum(SPRITESHEET_KEY) };

export enum AUDIO_KEY {
  _ = 0,
  BG = 1,
  CRASH = 2,
  EAT = 3,
  TURN = 4,
}
export const AUDIO_KEY_PROP = { type: Enum(AUDIO_KEY) };
