import { _decorator, Component, Node, director } from "cc";
import { ASSET_LOADER_EVENT } from "../../prefab/AssetLoader/enum/assetEvent";
import { SCENE_KEY } from "../enum/sceneKey";
const { ccclass, property } = _decorator;

@ccclass("SceneSelect")
export class SceneSelect extends Component {
  goToGame() {
    director.loadScene(SCENE_KEY.GAME);
  }

  goToMenu() {
    director.loadScene(SCENE_KEY.MENU);
  }
}
