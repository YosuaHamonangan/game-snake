import { _decorator, Component, Node, director } from "cc";
import { ASSET_LOADER_EVENT } from "../../prefab/AssetLoader/enum/assetEvent";
import { SCENE_KEY } from "../enum/sceneKey";
const { ccclass, property } = _decorator;

@ccclass("Preload")
export class Preload extends Component {
  onAssetLoaded() {
    director.loadScene(SCENE_KEY.GAME);
  }
}
