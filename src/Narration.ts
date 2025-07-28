import {SoundSettings} from '@motion-canvas/core';


export class Narration {
  public readonly id: string;
  public readonly text: string;
  public readonly duration: number;
  public readonly sound: SoundSettings;

  constructor(
    id: string,
    text: string,
    duration: number,
    sound: SoundSettings
  ) {
    this.id = id;
    this.text = text;
    this.duration = duration;
    this.sound = sound;
  }
}
