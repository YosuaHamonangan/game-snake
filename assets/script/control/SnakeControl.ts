import { _decorator, Component, Node, UITransform, Vec3 } from "cc";
import { DummySpriteSheet } from "../../prefab/AssetLoader/component/DummySpritSheet";
import {
  SNAKE_DIRECTION,
  SNAKE_SECTION_FRAME,
  SNAKE_SECTION_TYPE,
} from "../enum/snake";
import { FieldControl } from "./FieldControl";
const { ccclass, property } = _decorator;

function dirToAngle(dir: SNAKE_DIRECTION): number {
  switch (dir) {
    case SNAKE_DIRECTION.RIGHT:
      return 270;
    case SNAKE_DIRECTION.LEFT:
      return 90;
    case SNAKE_DIRECTION.UP:
      return 0;
    case SNAKE_DIRECTION.DOWN:
      return 180;
  }
}

@ccclass("SnakeControl")
export class SnakeControl extends Component {
  private sprite?: DummySpriteSheet | null;
  private uiTransform?: UITransform | null;
  private tileSize: number = 0;
  private dir = SNAKE_DIRECTION.UP;

  onLoad() {
    this.sprite = this.getComponent(DummySpriteSheet);
    this.uiTransform = this.getComponent(UITransform);
  }

  start() {
    const fieldControl = this.node.parent?.getComponent(FieldControl);
    if (fieldControl) {
      this.tileSize = fieldControl.TileSize;
    }

    this.adjustSize();
  }

  private adjustSize() {
    this.uiTransform?.contentSize.set(this.tileSize, this.tileSize);
  }
  public setType(
    type: SNAKE_SECTION_TYPE,
    config?: { hasFood?: boolean; prvDir?: SNAKE_DIRECTION }
  ) {
    let frame = 0;
    switch (type) {
      case SNAKE_SECTION_TYPE.HEAD:
        frame = SNAKE_SECTION_FRAME.HEAD;
        break;
      case SNAKE_SECTION_TYPE.BODY:
        frame = SNAKE_SECTION_FRAME.BODY;
        let rotation = new Vec3(0, 0, dirToAngle(this.dir));

        if (config) {
          if (config.prvDir !== undefined && config.prvDir !== this.dir) {
            frame = SNAKE_SECTION_FRAME.TURN;

            const deltaAngle = rotation.z - dirToAngle(config.prvDir);
            if (deltaAngle === 90 || deltaAngle === -270)
              rotation.add3f(0, 0, 180);
            else rotation.add3f(0, 0, 90);
          }

          if (config.hasFood) {
            if (frame === SNAKE_SECTION_FRAME.BODY) {
              frame = SNAKE_SECTION_FRAME.BODY_FOOD;
            } else {
              frame = SNAKE_SECTION_FRAME.TURN_FOOD;
            }
          }
        }

        this.node.setRotationFromEuler(rotation);
        break;
      case SNAKE_SECTION_TYPE.TAIL:
        frame = SNAKE_SECTION_FRAME.TAIL;
        break;
    }
    this.sprite?.setToFrame(frame);
  }

  public setDir(dir: SNAKE_DIRECTION) {
    this.dir = dir;
    let rotation = new Vec3(0, 0, dirToAngle(dir));
    this.node.setRotationFromEuler(rotation);
  }
}
