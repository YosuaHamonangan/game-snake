import {
  ASSET_EXTENSION,
  IMAGE_KEY,
  ASSET_TYPE,
  AUDIO_KEY,
  SPRITESHEET_KEY,
} from "../enum/asset";
import { AssetInfo } from "../interface/asset";

function getShopeeAssetUrl(url: string) {
  return `http://cf.shopee.co.id/file/${url}`;
}

let assets: AssetInfo[];
export function getAssets(): AssetInfo[] {
  if (assets) return assets;
  assets = [];

  assets.push({
    key: IMAGE_KEY.LOGO_SHOPEE_ULAR,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/logo-shopee-ular",
  });

  assets.push({
    key: SPRITESHEET_KEY.SNAKE,
    type: ASSET_TYPE.SPRITESHEET,
    url: "",
    localUrl: "image/snake",
    config: {
      frameWidth: 96,
      frameHeight: 96,
    },
  });

  assets.push({
    key: IMAGE_KEY.TILE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/tile",
  });

  assets.push({
    key: IMAGE_KEY.FOOD,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/apple",
  });

  assets.push({
    key: IMAGE_KEY.WALL,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/wall",
  });

  assets.push({
    key: IMAGE_KEY.ARROW_UP,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/arrow-up",
  });

  assets.push({
    key: IMAGE_KEY.ARROW_DOWN,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/arrow-down",
  });

  assets.push({
    key: IMAGE_KEY.ARROW_LEFT,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/arrow-left",
  });

  assets.push({
    key: IMAGE_KEY.ARROW_RIGHT,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/arrow-right",
  });

  assets.push({
    key: IMAGE_KEY.TROPHY,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/trophy",
  });

  assets.push({
    key: IMAGE_KEY.SOUND_ON,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/sound-on",
  });

  assets.push({
    key: IMAGE_KEY.SOUND_OFF,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/sound-off",
  });

  assets.push({
    key: AUDIO_KEY.BG,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "audio/bg-music",
  });

  assets.push({
    key: AUDIO_KEY.CRASH,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "audio/crash",
  });

  assets.push({
    key: AUDIO_KEY.EAT,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "audio/eat",
  });

  assets.push({
    key: AUDIO_KEY.TURN,
    type: ASSET_TYPE.AUDIO,
    url: "",
    localUrl: "audio/turn",
  });

  assets.push({
    key: IMAGE_KEY.ONLINE,
    type: ASSET_TYPE.IMAGE,
    url: getShopeeAssetUrl("6119dca1932fa645d831b3ab57614677"),
    ext: ASSET_EXTENSION.PNG,
  });

  return assets;
}
