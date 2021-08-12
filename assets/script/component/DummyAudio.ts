import { _decorator, AudioSource, assetManager, AudioClip } from "cc";
import { EDITOR } from "cc/env";
import { AUDIO_KEY, AUDIO_KEY_PROP } from "../enum/asset";
import { getAudioId } from "../util/asset";
const { ccclass, property } = _decorator;

@ccclass("Dummy Audio Source")
export class DummyAudio extends AudioSource {
  @property({ ...AUDIO_KEY_PROP, displayOrder: -1000 })
  private assetKey: AUDIO_KEY = AUDIO_KEY._;

  onLoad() {
    this.updateClip();
    super.onLoad();
  }

  public updateClip() {
    if (this.assetKey === AUDIO_KEY._) {
      return;
    }

    if (EDITOR) {
    } else {
      const id = getAudioId(this.assetKey);
      const clip = assetManager.assets.get(id) as AudioClip;
      this.clip = clip;
    }
  }
}
