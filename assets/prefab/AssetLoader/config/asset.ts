import { ASSET_EXTENSION, ASSET_KEY, ASSET_TYPE } from "../enum/asset";
import { AssetConfig } from "../interface/asset";

function getShopeeAssetUrl(url: string) {
  return `https://cf.shopee.co.id/file/${url}`;
}

export function getAssets() {
  const assets = new Array<AssetConfig>();

  assets.push({
    key: ASSET_KEY.SNAKE,
    type: ASSET_TYPE.SPRITESHEET,
    url: "",
    localUrl: "image/snake",
    config: {
      frameWidth: 96,
      frameHeight: 96,
    },
  });

  assets.push({
    key: ASSET_KEY.TILE,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/tile",
  });

  assets.push({
    key: ASSET_KEY.FOOD,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/apple",
  });

  assets.push({
    key: ASSET_KEY.WALL,
    type: ASSET_TYPE.IMAGE,
    url: "",
    localUrl: "image/wall",
  });

  assets.push({
    key: ASSET_KEY.ONLINE,
    type: ASSET_TYPE.IMAGE,
    url: getShopeeAssetUrl("6119dca1932fa645d831b3ab57614677"),
  });

  return assets;
}
