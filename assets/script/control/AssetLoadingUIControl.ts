import { _decorator, Component, Node, Label, ProgressBar } from "cc";
import { ASSET_LOADER_EVENT } from "../enum/assetEvent";
const { ccclass, property } = _decorator;

@ccclass("AssetLoaderUIControl")
export class AssetLoaderUIControl extends Component {
  @property(Node)
  private assetLoader?: Node;

  @property(ProgressBar)
  private progressBar?: ProgressBar;

  @property(Label)
  private progressText?: Label;

  @property(Label)
  private labelText?: Label;

  start() {
    if (!this.assetLoader) {
      throw new Error("No asset loader given");
    }

    this.assetLoader.on(ASSET_LOADER_EVENT.START, (progress: number) => {
      this.updateText(progress);
    });

    this.assetLoader.on(
      ASSET_LOADER_EVENT.ASSET_LOAD_SUCCESS,
      (progress: number, key: string) => {
        this.updateText(progress, key);
      }
    );

    this.assetLoader.on(ASSET_LOADER_EVENT.COMPLETE, (progress: number) => {
      this.updateText(progress);
    });
  }

  public updateText(progress: number, key?: string) {
    const { progressText, labelText, progressBar } = this;
    const progressPercent = Math.floor(progress * 100);

    if (progressBar) {
      progressBar.progress = progress;
    }

    if (progressText) {
      progressText.string = `${progressPercent}%`;
    }

    if (labelText) {
      switch (progressPercent) {
        case 100: {
          labelText.string = "Completed";
          break;
        }

        case 0: {
          labelText.string = "LOADING...";
          break;
        }

        default: {
          labelText.string = `LOADED ${key}`;
          break;
        }
      }
    }
  }
}
