import {
  _decorator,
  Component,
  Node,
  Graphics,
  UITransform,
  SystemEventType,
} from "cc";
const { ccclass, property, requireComponent } = _decorator;

@ccclass("Rect")
@requireComponent(UITransform)
export class Rect extends Graphics {
  start() {
    this.node.on(SystemEventType.SIZE_CHANGED, () => {
      this.drawRect();
    });

    this.node.on(SystemEventType.ANCHOR_CHANGED, () => {
      this.drawRect();
    });

    this.node.on(SystemEventType.ANCHOR_CHANGED, () => {
      this.drawRect();
    });

    this.drawRect();
  }

  drawRect() {
    const uiTranform = this.getComponent(UITransform);
    if (!uiTranform) return;
    const {
      contentSize: { x: w, y: h },
      anchorPoint,
    } = uiTranform;
    const x = -w * anchorPoint.x;
    const y = -h * anchorPoint.y;

    this.clear();
    this.rect(x, y, w, h);
    this.fill();
    this.stroke();
  }
}
