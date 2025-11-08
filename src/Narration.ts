import {SoundSettings} from '@motion-canvas/core';

export class Narration {
  public readonly id: string;
  public readonly text: string;
  public readonly duration: number;
  public readonly audio: string;

  constructor(
    id: string,
    text: string,
    duration: number,
    audio: string
  ) {
    this.id = id;
    this.text = text;
    this.duration = duration; // the original duration of the given audio file
    this.audio = audio;
  }
}
