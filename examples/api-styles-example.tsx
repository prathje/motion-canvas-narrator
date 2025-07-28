import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createMockNarrator, createFileNarrator, fluent, FileProvider } from '../src';

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
        text={'API Styles'}
        y={100}
      />
    </>
  );

  const narrator = createMockNarrator(
    { wordsPerMinute: 180 },
    {
      cache: { enabled: true, keyStrategy: 'hash' }
    }
  );

  // Style 1: Original API with options object
  yield* text().text('Original API', 0.5);
  yield* all(
    narrator.speak("This is the original API style with options object", { 
      cacheId: "original_demo",
      playbackRate: 1.1 
    }),
    circle().fill('#ef4444', 1)
  );

  yield* waitFor(0.5);

  // Style 2: ID-first methods (simpler for common cases)
  yield* text().text('ID-First API', 0.5);
  yield* all(
    narrator.cached("welcome_v2", "This puts the cache ID first for better readability"),
    circle().fill('#10b981', 1)
  );

  yield* waitFor(0.5);

  // Style 3: FileProvider for user audio files
  yield* text().text('File Provider', 0.5);
  
  const fileNarrator = createFileNarrator({
    audioDirectory: './assets'
  });
  
  // Note: Would work with real audio files
  // yield* fileNarrator.speak('./custom.mp3');
  // yield* fileNarrator.speak(FileProvider.createRequest('./custom.mp3', 'Custom narration'));
  
  // For demo, show the API pattern
  yield* all(
    narrator.speak("This represents the FileProvider for user audio files", { 
      cacheId: "file_demo" 
    }),
    circle().fill('#8b5cf6', 1)
  );

  yield* waitFor(0.5);

  // Style 4: Fluent/Builder Pattern (most flexible)
  yield* text().text('Fluent API', 0.5);
  
  const fluentNarrator = fluent(narrator);
  
  yield* all(
    fluentNarrator
      .say("This is the fluent builder pattern")
      .withId("fluent_demo")
      .atRate(1.2)
      .withGain(-3)
      .speak(),
    circle().fill('#f59e0b', 1)
  );

  yield* waitFor(0.5);

  // Style 5: Fluent with cached shorthand
  yield* text().text('Fluent Cached', 0.5);
  yield* all(
    fluentNarrator
      .cached("cached_fluent", "Fluent API with cache ID first")
      .atRate(0.9)
      .delayed(0.2)
      .speak(),
    circle().fill('#ec4899', 1)
  );

  yield* waitFor(0.5);

  // Style 6: Fluent with FileProvider
  yield* text().text('Fluent File', 0.5);
  
  const fluentFileNarrator = fluent(fileNarrator);
  
  // Note: Would work with real files
  // yield* fluentFileNarrator
  //   .say(FileProvider.createRequest("./outro.mp3", "Thanks for watching!"))
  //   .withGain(3)
  //   .speak();
  
  yield* all(
    fluentFileNarrator
      .say("This represents fluent FileProvider usage")
      .withId("file_fluent")
      .speak(),
    circle().fill('#06b6d4', 1)
  );

  yield* waitFor(0.5);

  // Style 7: Complex fluent example
  yield* text().text('Complex Fluent', 0.5);
  yield* all(
    fluentNarrator
      .say("Complex example with multiple options chained together")
      .withId("complex_demo")
      .atRate(1.3)
      .withGain(-6)
      .trimmed(0.5, 4.0)
      .delayed(0.3)
      .speak(),
    circle().rotation(180, 2),
    circle().scale(1.3, 1).to(1, 1)
  );

  yield* waitFor(0.5);

  // Style 8: Prepare vs Speak (for advanced use cases)
  yield* text().text('Prepare Pattern', 0.5);
  
  // Prepare narration for reuse
  const preparedNarration = yield fluentNarrator
    .say("This narration is prepared once and reused")
    .withId("prepared_demo")
    .prepare();
  
  // Play it multiple times with different settings
  yield* all(
    preparedNarration.play({ gain: -3 }),
    circle().fill('#84cc16', 1)
  );
  
  yield* waitFor(0.3);
  
  yield* all(
    preparedNarration.play({ playbackRate: 1.5, gain: 3 }),
    circle().fill('#f97316', 1)
  );

  yield* waitFor(1);

  // Summary
  yield* all(
    text().text('Choose Your Style!', 1),
    circle().fill('#6366f1', 1),
    circle().scale(1.5, 1).to(1, 1)
  );
});