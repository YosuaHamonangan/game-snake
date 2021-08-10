import { _decorator, Component, Node, Label, Vec3 } from "cc";
import { PANEL_EVENT } from "../enum/panel";
import { DataManagerControl } from "./DataManagerControl";
const { ccclass, property } = _decorator;

@ccclass("PanelControl")
export class PanelControl extends Component {
  @property(Label)
  scoreLabel?: Label | null;

  private showPos?: Vec3 | null;
  private hidePos = new Vec3(-10000, -10000);

  start() {
    this.showPos = this.node.position.clone();
    this.hide();
  }

  hide() {
    this.node.setPosition(this.hidePos);
  }

  show() {
    if (this.scoreLabel) {
      this.scoreLabel.string = DataManagerControl.Instance.score.toString();
    }

    this.node.setPosition(this.showPos!);
  }

  onPlayAgain() {
    this.node.emit(PANEL_EVENT.PLAY_AGAIN);
  }

  onCancel() {
    this.node.emit(PANEL_EVENT.CANCEL);
  }
}
