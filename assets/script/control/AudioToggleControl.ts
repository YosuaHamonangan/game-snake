import { _decorator, Component, Node, Toggle, ToggleComponent } from "cc";
import { AudioControl } from "./AudioControl";
const { ccclass } = _decorator;

@ccclass("Audio Toggle Control")
export class AudioToggleControl extends Component {
  start() {
    if (AudioControl.Instance) {
      const toggleComponent = this.getComponent(ToggleComponent);
      if (!toggleComponent) return;

      toggleComponent.isChecked = AudioControl.Instance.isPlaying;
    }
  }

  toggleMusic(toggle: Toggle) {
    if (!AudioControl.Instance) return;
    if (toggle.isChecked) {
      AudioControl.Instance.on();
    } else {
      AudioControl.Instance.off();
    }
  }
}
