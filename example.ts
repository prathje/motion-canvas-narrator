import { makeScene2D } from '@motion-canvas/2d';
import { createMockNarrator } from './src';

export default makeScene2D(function* (view) {
  const narrator = createMockNarrator(
    { wordsPerMinute: 120 },
    { rate: 1.0, volume: 0.8 }
  );

  // Basic usage - automatically waits for narration to finish
  yield* narrator.speak("Welcome to the simplified Motion Canvas Narrator!");
  
  // Sequential narration - each waits for the previous to complete
  yield* narrator.speak("This text plays after the first one finishes.");
  
  // Play with custom audio options
  yield* narrator.speak("This starts with custom effects.", { 
    offset: 1,
    playbackRate: 1.2,
    gain: -3
  });
});