import { _decorator, Sprite, Node, assetManager, SpriteFrame } from "cc";
import { ASSET_KEY, ASSET_KEY_PROP } from "../enum/asset";
import { getAssetId } from "../util/asset";
const { ccclass, property } = _decorator;

@ccclass("DummySprite")
export class DummySprite extends Sprite {
  @property(ASSET_KEY_PROP)
  assetKey: ASSET_KEY | null = null;

  onLoad() {
    if (this.assetKey !== null) {
      this.setSpriteFrameByKey(this.assetKey);
    }
  }

  public setSpriteFrameByKey(key: ASSET_KEY) {
    // @ts-ignore
    if (!CC_EDITOR) {
      const id = getAssetId(key);
      const frame = assetManager.assets.get(id) as SpriteFrame;
      this.spriteFrame = frame;
    }
  }
}
