import { _decorator, Sprite, assetManager, SpriteFrame } from "cc";
import { EDITOR } from "cc/env";
import { SPRITESHEET_KEY_PROP, SPRITESHEET_KEY } from "../enum/asset";
import { getSpriteFrameId } from "../util/asset";
const { ccclass, property } = _decorator;

@ccclass("Dummy Sprite Sheet")
export class DummySpriteSheet extends Sprite {
  @property({ ...SPRITESHEET_KEY_PROP, displayOrder: -501 })
  private assetKey: SPRITESHEET_KEY = SPRITESHEET_KEY._;

  @property({ step: 1, min: 0, displayOrder: -500 })
  frameKey = 0;

  onLoad() {
    this.updateFrame();
  }

  private updateFrame() {
    if (this.assetKey === SPRITESHEET_KEY._) {
      return;
    }

    if (!EDITOR) {
      const id = getSpriteFrameId(this.assetKey, this.frameKey);
      const frame = assetManager.assets.get(id) as SpriteFrame;
      this.spriteFrame = frame;
    }
  }

  public setToFrame(frameKey: number) {
    this.frameKey = frameKey;
    this.updateFrame();
  }
}
