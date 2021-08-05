import { _decorator, Component, Node, RichText } from "cc";
import { ASSET_LOADER_EVENT } from "../enum/assetEvent";
const { ccclass, property } = _decorator;

@ccclass("AssetLoaderUI")
export class AssetLoaderUI extends Component {
  @property(RichText)
  public progressText?: RichText;

  @property(RichText)
  public labelText?: RichText;

  start() {
    this.node.on(ASSET_LOADER_EVENT.START, (progress: number) => {
      this.updateText(progress);
    });

    this.node.on(
      ASSET_LOADER_EVENT.ASSET_LOAD_SUCCESS,
      (progress: number, key: string) => {
        this.updateText(progress, key);
      }
    );

    this.node.on(ASSET_LOADER_EVENT.COMPLETE, (progress: number) => {
      this.updateText(progress);
    });
  }

  public updateText(progress: number, key?: string) {
    const { progressText, labelText } = this;
    const progressPercent = Math.floor(progress * 100);

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
