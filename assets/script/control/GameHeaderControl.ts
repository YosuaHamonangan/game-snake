import { _decorator, Component, Node, Label } from "cc";
import { FIELD_EVENT } from "../enum/field";
import { DataManagerControl } from "./DataManagerControl";
const { ccclass, property } = _decorator;

@ccclass("GameHeaderControl")
export class GameHeaderControl extends Component {
  @property(Node)
  field?: Node | null;

  @property(Label)
  scoreLabel?: Label | null;

  @property(Label)
  highScoreLabel?: Label | null;

  start() {
    if (this.field) {
      this.field.on(FIELD_EVENT.SCORE_UPDATE, (score: number) => {
        if (this.scoreLabel) {
          this.scoreLabel.string = score.toString();
        }
      });
    }

    if (DataManagerControl.Instance && this.highScoreLabel) {
      this.highScoreLabel.string =
        DataManagerControl.Instance.highscore.toString();
    }

    if (this.scoreLabel) {
      this.scoreLabel.string = "0";
    }
  }
}
