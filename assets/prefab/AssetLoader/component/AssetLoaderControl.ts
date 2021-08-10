import {
  _decorator,
  Component,
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
import { ASSET_TYPE } from "../enum/asset";
import { ASSET_LOADER_EVENT } from "../enum/assetEvent";
import { AssetInfo, SpritesheetInfo } from "../interface/asset";
import { getAssetId, getSpriteFrameId } from "../util/asset";
const { ccclass, property } = _decorator;

@ccclass("AssetLoaderControl")
export class AssetLoaderControl extends Component {
  @property(EventHandler)
  private onComplete: EventHandler[] = [];

  private assetsToLoad: Array<AssetInfo> = getAssets();

  private loadCount = 0;

  private allowLocalAsset = true;

  start() {
    this.startAssetsLoad();
  }

  public startAssetsLoad() {
    const { allowLocalAsset } = this;

    this.node.emit(ASSET_LOADER_EVENT.START, this.getProgress());
    this.assetsToLoad.forEach((info, i) => {
      const { key, type, localUrl } = info;
      const id = getAssetId(type, key);
      if (allowLocalAsset && localUrl) {
        this.loadLocalAsset(id, info);
      } else {
        this.loadRemoteAsset(id, info);
      }
    });
  }

  private loadLocalAsset(id: string, info: AssetInfo) {
    const url = info.localUrl!;
    resources.load(url, (e, data) => {
      this.handleLoadedAsset(id, info, e, data, url);
      if (e) {
        console.log(e);
        // this.loadLocalAsset(key, type, url, config);
      }
    });
  }

  private loadRemoteAsset(id: string, info: AssetInfo) {
    const { url, ext } = info;
    console.log(url);
    console.log(ext);
    assetManager.loadRemote(url, { ext }, (e, data) => {
      this.handleLoadedAsset(id, info, e, data, url);
      if (e) {
        console.log(e);
        // this.loadRemoteAsset(key, type, url, ext, config);
      }
    });
  }

  private handleLoadedAsset(
    id: string,
    info: AssetInfo,
    e: Error | null,
    data: Asset,
    url: string
  ) {
    if (!e) {
      this.loadCount += 1;
      this.handleLoadedAssetByType(id, data._uuid, info);
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

  private handleLoadedAssetByType(id: string, uuid: string, info: AssetInfo) {
    this.remapAssetManagerEntry(id, uuid);

    switch (info.type) {
      case ASSET_TYPE.SPRITESHEET: {
        this.handleLoadedSpritesheet(id, info);
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

  private handleLoadedSpritesheet(id: string, info: SpritesheetInfo) {
    const imageAsset = assetManager.assets.get(id) as ImageAsset;
    const { width, height } = imageAsset || {};
    const {
      frameWidth,
      frameHeight,
      paddingX = 0,
      paddingY = 0,
    } = info.config || {};

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
          getSpriteFrameId(info.key, frameIndex++),
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
