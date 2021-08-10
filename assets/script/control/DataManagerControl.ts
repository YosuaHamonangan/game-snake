import { _decorator, Component, game, sys } from "cc";
const { ccclass } = _decorator;

@ccclass("DataManagerControl")
export class DataManagerControl extends Component {
  static Instance: DataManagerControl;
  public score = 0;
  public highscore = 0;

  start() {
    if (!DataManagerControl.Instance) {
      game.addPersistRootNode(this.node);
      DataManagerControl.Instance = this;
    }

    this.highscore = sys.localStorage.getItem("hiscore") || 0;
  }

  setHighScore(val: number) {
    if (val > this.highscore) {
      this.highscore = val;
      sys.localStorage.setItem("hiscore", val);
    }
  }
}
