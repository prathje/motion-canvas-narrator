/**
 * Parallel Batch Resolution Example
 * 
 * This example demonstrates how to use createBatch() to pre-fetch multiple narrations
 * in parallel from ElevenLabs API, significantly reducing total generation time.
 * 
 * Key Insight: Use batch.speak() to collect all narrations you'll use,
 * then call batch.resolve() once to fetch them all in parallel.
 * 
 * Performance Comparison:
 * - Sequential (old): 3 narrations × ~10s per call = ~30 seconds total
 * - Parallel (new): 3 narrations fetched simultaneously = ~10 seconds total
 * 
 * Setup Instructions:
 * 1. Install the ElevenLabs package: npm install @elevenlabs/elevenlabs-js
 * 2. Get your API key from https://elevenlabs.io/
 * 3. Set environment variable: export ELEVENLABS_API_KEY="your-api-key"
 * 4. Replace 'YOUR_VOICE_ID' with an actual ElevenLabs voice ID
 */

import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createElevenLabsNarrator } from '../src';

export default makeScene2D(function* (view) {
  const narrator = createElevenLabsNarrator({
    modelId: 'eleven_v3',
    voiceId: 'YOUR_VOICE_ID',
    apiKey: process.env.ELEVENLABS_API_KEY || 'YOUR_API_KEY',
  });

  const circle = createRef<Circle>();
  const text = createRef<Txt>();

  view.add(
    <>
      <Circle
        ref={circle}
        width={140}
        height={140}
        fill={'#7c3aed'}
        y={-50}
      />
      <Txt
        ref={text}
        fontSize={50}
        fontWeight={800}
        fill={'#ffffff'}
        text={'Parallel Batch'}
        y={100}
      />
    </>
  );

  // CREATE A BATCH - collect all narrations you'll use
  // This is just like writing speak() calls, but collected for pre-fetching
  const batch = narrator.createBatch();
  batch.speak("Welcome to the parallel batch example!");
  batch.speak("Notice how we collect all our narrations first.");
  batch.speak("Then we resolve them all at once in parallel.");
  batch.speak("This is much faster than waiting for each one.");
  batch.speak("Now all the audio is cached and ready to go!");
  batch.speak("The remaining speak calls will be instant!");

  // PRE-FETCH ALL AUDIO IN PARALLEL
  // This sends all 6 requests to ElevenLabs at the same time
  // Takes ~10 seconds instead of ~60 seconds!
  console.log("Starting parallel batch pre-fetch...");
  yield* batch.resolve();
  console.log("Pre-fetch complete! All audio is now cached.");

  yield* waitFor(0.5);

  // Now all speak() calls are instant because audio is cached
  // Play narrations with animations
  yield* all(
    narrator.speak("Welcome to the parallel batch example!"),
    circle().fill('#ef4444', 2),
    text().text('Point 1', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak("Notice how we collect all our narrations first."),
    circle().fill('#f97316', 2),
    text().text('Point 2', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak("Then we resolve them all at once in parallel."),
    circle().fill('#eab308', 2),
    text().text('Point 3', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak("This is much faster than waiting for each one."),
    circle().fill('#10b981', 2),
    text().text('Point 4', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak("Now all the audio is cached and ready to go!"),
    circle().fill('#3b82f6', 2),
    text().text('Point 5', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak("The remaining speak calls will be instant!"),
    circle().scale(1.5, 2).to(1, 2),
    text().text('Complete!', 1)
  );

  yield* waitFor(1);
});
