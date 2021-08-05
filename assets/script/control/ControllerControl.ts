import { _decorator, Component, Event, Node } from "cc";
import { FIELD_EVENT } from "../enum/field";
import { SNAKE_DIRECTION } from "../enum/snake";
const { ccclass, property } = _decorator;

@ccclass("Controller Control")
export class ControllerControl extends Component {
  @property(Node)
  field?: Node | null;

  onBtnClick(event: Event, dir: string) {
    if (this.field) {
      const dirKey = dir as keyof typeof SNAKE_DIRECTION;
      this.field.emit(FIELD_EVENT.CHANGE_DIR, SNAKE_DIRECTION[dirKey]);
    }
  }
}
