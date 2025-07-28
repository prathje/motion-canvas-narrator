import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { 
  createMockNarrator, 
  createFileNarrator,
  createElevenLabsNarrator
} from '../src';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  const text = createRef<Txt>();

  view.add(
    <>
      <Circle
        ref={circle}
        width={140}
        height={140}
        fill={'#6366f1'}
        y={-50}
      />
      <Txt
        ref={text}
        fontSize={40}
        fontWeight={800}
        fill={'#ffffff'}
        text={'Simplified API'}
        y={100}
      />
    </>
  );

  // Example 1: Basic narrator usage
  const narrator = createMockNarrator(
    { wordsPerMinute: 180 },
    { rate: 1.0, volume: 0.8 }
  );

  yield* text().text('Basic Usage', 0.5);
  yield* all(
    narrator.speak("This is the simplified Motion Canvas Narrator!"),
    circle().fill('#ef4444', 1)
  );

  yield* waitFor(0.5);

  // Example 2: Advanced audio options
  yield* text().text('Audio Effects', 0.5);
  yield* all(
    narrator.speak("This narration has custom audio effects", { 
      playbackRate: 1.2,
      gain: -3,
      detune: 100  // New: pitch shift in cents
    }),
    circle().fill('#10b981', 1)
  );

  yield* waitFor(0.5);

  // Example 3: Different providers
  const elevenLabsNarrator = createElevenLabsNarrator({
    apiKey: 'demo-key' // This would use mock data
  });
  
  yield* text().text('Different Provider', 0.5);
  yield* all(
    elevenLabsNarrator.speak("This uses a different provider"),
    circle().fill('#8b5cf6', 1)
  );

  yield* waitFor(0.5);

  // Example 4: FileProvider usage
  const fileNarrator = createFileNarrator({
    audioDirectory: './assets/audio'
  });

  yield* text().text('File Provider', 0.5);
  
  // For FileProvider, the "text" parameter is the file path
  // This would load an actual audio file in a real scenario
  yield* all(
    narrator.speak("FileProvider would load actual audio files from disk"),
    circle().fill('#f59e0b', 1)
  );

  yield* waitFor(0.5);

  // Example 5: Caching demonstration
  yield* text().text('Caching Works', 0.5);
  
  // Same text will be cached by provider
  const cachedText = "This text will be cached by the provider";
  
  yield* all(
    narrator.speak(cachedText, { gain: -6, playbackRate: 1.3 }),
    circle().fill('#ec4899', 1)
  );
  
  yield* waitFor(0.3);
  
  // Second call uses cached audio but with different playback settings
  yield* all(
    narrator.speak(cachedText, { gain: 3, playbackRate: 0.8 }),
    circle().fill('#06b6d4', 1)
  );

  yield* waitFor(1);

  // Summary
  yield* all(
    text().text('Simplified & Clean!', 1),
    circle().fill('#6366f1', 1),
    circle().scale(1.2, 1).to(1, 1)
  );
});