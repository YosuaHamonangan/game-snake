import { _decorator, Sprite, assetManager, SpriteFrame } from "cc";
import { EDITOR } from "cc/env";
import { IMAGE_KEY, IMAGE_KEY_PROP } from "../enum/asset";
import { getImageId } from "../util/asset";
const { ccclass, property } = _decorator;

@ccclass("Dummy Sprite")
export class DummySprite extends Sprite {
  @property({ ...IMAGE_KEY_PROP, displayOrder: -500 })
  private assetKey: IMAGE_KEY = IMAGE_KEY._;

  onLoad() {
    this.updateFrame();
  }

  public updateFrame() {
    if (this.assetKey === IMAGE_KEY._) {
      this.spriteFrame = null;
      return;
    }

    if (EDITOR) {
    } else {
      const id = getImageId(this.assetKey);
      const frame = assetManager.assets.get(id) as SpriteFrame;
      this.spriteFrame = frame;
    }
  }
}
