import { _decorator, Component, Node, Label } from "cc";
import { DataManagerControl } from "./DataManagerControl";
const { ccclass, property } = _decorator;

@ccclass("MenuControl")
export class MenuControl extends Component {
  @property(Label)
  highScoreLabel?: Label | null;

  start() {
    if (DataManagerControl.Instance) {
      if (this.highScoreLabel) {
        this.highScoreLabel.string =
          DataManagerControl.Instance.highscore.toString();
      }
    }
  }
}
