import { _decorator, Sprite, Node, assetManager, SpriteFrame } from "cc";
import { ASSET_KEY, ASSET_KEY_PROP } from "../enum/asset";
import { getAssetId, getSpriteFrameId } from "../util/asset";
const { ccclass, property } = _decorator;

@ccclass("Dummy Sprite Sheet")
export class DummySpriteSheet extends Sprite {
  @property(ASSET_KEY_PROP)
  assetKey: ASSET_KEY | null = null;

  @property({ step: 1, min: 0 })
  frameKey = 0;

  onLoad() {
    if (this.assetKey !== null) {
      this.setSpriteFrameByKey(this.assetKey, this.frameKey);
    }
  }

  public setSpriteFrameByKey(key: ASSET_KEY, frameKey: number) {
    this.assetKey = key;
    this.frameKey = frameKey;
    // @ts-ignore
    if (!CC_EDITOR) {
      const assetId = getAssetId(key);
      const id = getSpriteFrameId(assetId, frameKey);
      const frame = assetManager.assets.get(id) as SpriteFrame;
      this.spriteFrame = frame;
    }
  }

  public setToFrame(frameKey: number) {
    if (this.assetKey !== null) {
      this.setSpriteFrameByKey(this.assetKey, frameKey);
    }
  }
}
