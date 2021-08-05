import {
  _decorator,
  Component,
  Node,
  assetManager,
  resources,
  Asset,
  ImageAsset,
  SpriteFrame,
  math,
  Texture2D,
  EventHandler,
} from "cc";

import { getAssets } from "../config/asset";
import { ASSET_EXTENSION, ASSET_TYPE } from "../enum/asset";
import { ASSET_LOADER_EVENT } from "../enum/assetEvent";
import { AssetConfig, AssetTypeConfig } from "../interface/asset";
import { getAssetId, getSpriteFrameId } from "../util/asset";
const { ccclass, property } = _decorator;

@ccclass("AssetLoaderControl")
export class AssetLoaderControl extends Component {
  @property(EventHandler)
  private onComplete: EventHandler[] = [];

  private assetsToLoad: Array<AssetConfig> = getAssets();

  private loadCount = 0;

  private allowLocalAsset = true;

  start() {
    this.startAssetsLoad();
  }

  public startAssetsLoad() {
    const { allowLocalAsset } = this;

    this.node.emit(ASSET_LOADER_EVENT.START, this.getProgress());
    this.assetsToLoad.forEach((asset) => {
      const { key, type, url, ext, localUrl, config } = asset;
      if (allowLocalAsset && localUrl) {
        this.loadLocalAsset(getAssetId(key), type, localUrl, config);
      } else {
        this.loadRemoteAsset(getAssetId(key), type, url, ext, config);
      }
    });
  }

  private loadLocalAsset(
    key: string,
    type: ASSET_TYPE,
    url: string,
    config?: AssetTypeConfig
  ) {
    resources.load(url, (e, data) => {
      this.handleLoadedAsset(key, type, url, e, data, config);

      if (e) {
        this.loadLocalAsset(key, type, url, config);
      }
    });
  }

  private loadRemoteAsset(
    key: string,
    type: ASSET_TYPE,
    url: string,
    ext?: ASSET_EXTENSION,
    config?: AssetTypeConfig
  ) {
    assetManager.loadRemote(url, { ext }, (e, data) => {
      this.handleLoadedAsset(key, type, url, e, data, config);
      if (e) {
        this.loadRemoteAsset(key, type, url, ext, config);
      }
    });
  }

  private handleLoadedAsset(
    id: string,
    type: ASSET_TYPE,
    url: string,
    e: Error | null,
    data: Asset,
    config?: AssetTypeConfig
  ) {
    if (!e) {
      this.loadCount += 1;
      this.handleLoadedAssetByType(id, data._uuid, type, config);
      this.node.emit(
        ASSET_LOADER_EVENT.ASSET_LOAD_SUCCESS,
        this.getProgress(),
        id,
        url
      );
    } else {
      this.node.emit(
        ASSET_LOADER_EVENT.ASSET_LOAD_FAILURE,
        this.getProgress(),
        id,
        url
      );
    }

    if (this.loadCount === this.assetsToLoad.length) {
      this.node.emit(ASSET_LOADER_EVENT.COMPLETE, this.getProgress());
      this.onComplete.forEach((f) => f.emit([]));
    }
  }

  private getProgress() {
    return this.loadCount / this.assetsToLoad.length;
  }

  private remapAssetManagerEntry(id: string, uuid: string) {
    const entry = assetManager.assets.get(uuid);

    if (!entry) return;

    assetManager.assets.add(id, entry);
    assetManager.assets.remove(uuid);
  }

  private handleLoadedAssetByType(
    id: string,
    uuid: string,
    type: ASSET_TYPE,
    config?: AssetTypeConfig
  ) {
    this.remapAssetManagerEntry(id, uuid);

    switch (type) {
      case ASSET_TYPE.SPRITESHEET: {
        this.handleLoadedSpritesheet(id, config);
        break;
      }

      case ASSET_TYPE.IMAGE: {
        this.handleLoadedImage(id);
        break;
      }

      case ASSET_TYPE.AUDIO: {
        break;
      }

      default: {
        break;
      }
    }
  }

  private handleLoadedSpritesheet(id: string, config?: AssetTypeConfig) {
    const imageAsset = assetManager.assets.get(id) as ImageAsset;
    const { width, height } = imageAsset || {};
    const { frameWidth, frameHeight, paddingX, paddingY } = {
      paddingX: 0,
      paddingY: 0,
      ...config,
    };

    if (!width || !height || !frameWidth || !frameHeight) return;

    const texture = new Texture2D();
    texture.image = imageAsset;

    let frameIndex = 0;
    for (let row = 0; row < height; row += frameHeight + paddingY) {
      for (let col = 0; col < width; col += frameWidth + paddingX) {
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        spriteFrame.rect = math.rect(col, row, frameWidth, frameHeight);
        assetManager.assets.add(
          getSpriteFrameId(id, frameIndex++),
          spriteFrame
        );
      }
    }
  }

  private handleLoadedImage(id: string) {
    const imageAsset = assetManager.assets.get(id) as ImageAsset;

    if (!imageAsset) return;

    const spriteFrame = SpriteFrame.createWithImage(imageAsset);
    assetManager.assets.add(id, spriteFrame);
  }
}
