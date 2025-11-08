import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createMockNarrator } from '../src';

export default makeScene2D(function* (view) {
  const narrator = createMockNarrator(
    { wordsPerMinute: 150 }, // Provider config
    { 
      rate: 1.0,
      volume: 0.8
    } // Narrator config
  );
  const circle = createRef<Circle>();
  const text = createRef<Txt>();

  view.add(
    <>
      <Circle
        ref={circle}
        width={140}
        height={140}
        fill={'#e13238'}
        x={-300}
      />
      <Txt
        ref={text}
        fontSize={50}
        fontWeight={800}
        fill={'#242424'}
        text={''}
      />
    </>
  );

  // Example 1: Basic narration with visual animation
  yield* all(
    narrator.speak("Welcome to the simplified Motion Canvas Narrator!"),
    text().text("Welcome!", 1),
  );

  // Example 2: Narration while animating
  yield* all(
    narrator.speak("Watch this circle move across the screen."),
    circle().position.x(300, 2),
    text().text("Moving...", 0.5),
  );

  // Example 3: Sequential narration (waits automatically)
  yield* narrator.speak("First, we'll change the color.");
  yield* circle().fill('#4287f5', 1);
  
  yield* narrator.speak("Then we'll make it bigger!");
  yield* all(
    circle().scale(1.5, 1),
    text().text("Bigger!", 0.5),
  );

  // Example 4: Narration with audio effects
  yield* text().text("Audio effects...", 0.5);
  yield* narrator.speak("This narration has custom gain and playback rate.", { 
    gain: -6,  // Quieter
    playbackRate: 1.2  // Faster
  });

  // Example 5: Flow control with yield vs yield*
  yield* text().text("Background speech...", 0.5);
  
  // Start background narration (don't wait for completion)
  yield narrator.speak("This narration plays in the background while the circle animates!");
  
  // Animate while narration continues
  yield* all(
    circle().position.y(-100, 2),
    circle().position.y(0, 2)
  );

  // Example 6: Different playback rates
  yield* text().text("Speed variations...", 0.5);
  
  yield* narrator.speak("This is normal speed.", { playbackRate: 1.0 });
  yield* narrator.speak("This is faster speech.", { playbackRate: 1.5 });
  yield* narrator.speak("This is slower speech.", { playbackRate: 0.7 });

  // Final cleanup
  yield* all(
    circle().scale(1, 0.5),
    text().text("Simplified & Clean!", 0.5),
  );
});
