import { _decorator, Component, game, AudioSource } from "cc";
const { ccclass } = _decorator;

@ccclass("AudioControl")
export class AudioControl extends Component {
  static Instance: AudioControl;
  audioSource: AudioSource | null = null;
  isPlaying = true;
  start() {
    if (!AudioControl.Instance) {
      game.addPersistRootNode(this.node);
      AudioControl.Instance = this;
    }

    this.audioSource = this.getComponent(AudioSource);
  }

  on() {
    if (!this.audioSource) return;
    this.audioSource.volume = 1;
    this.isPlaying = true;
  }

  off() {
    if (!this.audioSource) return;
    this.audioSource.volume = 0;
    this.isPlaying = false;
  }
}
