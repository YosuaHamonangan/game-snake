import { _decorator, Sprite, assetManager, SpriteFrame, CCBoolean } from "cc";
import { EDITOR } from "cc/env";
import { AssetLoaderControl } from "../control/AssetLoaderControl";
import { IMAGE_KEY, IMAGE_KEY_PROP } from "../enum/asset";
import { ASSET_LOADER_EVENT } from "../enum/assetEvent";
import { getImageId } from "../util/asset";
const { ccclass, property } = _decorator;

@ccclass("Dummy Sprite")
export class DummySprite extends Sprite {
  @property({ ...IMAGE_KEY_PROP, displayOrder: -500 })
  private assetKey: IMAGE_KEY = IMAGE_KEY._;

  @property({ type: CCBoolean, displayOrder: -499 })
  private waitAsset = false;

  onLoad() {
    if (this.waitAsset) {
      this.waitForAsset();
    } else {
      this.updateFrame();
    }
  }

  public updateFrame() {
    if (this.assetKey === IMAGE_KEY._) {
      return;
    }

    if (EDITOR) {
    } else {
      const id = getImageId(this.assetKey);
      const frame = assetManager.assets.get(id) as SpriteFrame;
      this.spriteFrame = frame;
    }
  }

  private waitForAsset() {
    if (AssetLoaderControl.Instance) {
      AssetLoaderControl.Instance.node.on(
        ASSET_LOADER_EVENT.ASSET_LOAD_SUCCESS,
        (progress: number, loadedId: string) => {
          const id = getImageId(this.assetKey);
          if (id === loadedId) {
            this.updateFrame();
          }
        }
      );
    }
  }
}
