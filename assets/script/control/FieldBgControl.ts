import { _decorator, Component, Node, UITransform, Sprite } from "cc";
import { DummySprite } from "../component/DummySprite";
import { FieldControl } from "./FieldControl";
const { ccclass, property } = _decorator;

@ccclass("FieldBgControl")
export class FieldBgControl extends Component {
  private sprite?: DummySprite | null;
  private uiTransform?: UITransform | null;

  start() {
    this.sprite = this.getComponent(DummySprite);
    this.uiTransform = this.getComponent(UITransform);
    this.adjustSize();
  }

  private adjustSize() {
    const { sprite, uiTransform } = this;

    if (sprite?.spriteFrame && uiTransform) {
      const { Cols, Rows, TileSize } =
        this.node.parent?.getComponent(FieldControl)!;

      sprite.type = Sprite.Type.TILED;
      const spriteFrame = sprite.spriteFrame;
      const { x: originalWidth } = uiTransform.contentSize;
      const width = Cols * (spriteFrame.width / 2);
      const height = Rows * (spriteFrame.height / 2);
      uiTransform.contentSize.set(width, height);

      const scale = originalWidth / width;
      this.node.scale.set(scale, scale);
    }
  }
}
