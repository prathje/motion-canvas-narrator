/**
 * Google Chirp TTS with Parallel Batch Resolution Example
 * 
 * This example demonstrates using Google Cloud's Chirp text-to-speech model
 * with the parallel batch resolution API for fast, high-quality narration.
 * 
 * Setup Instructions:
 * 1. Get your Google API key from https://console.cloud.google.com/
 * 2. Enable the Text-to-Speech API
 * 3. Either:
 *    a) Set environment variable: export GOOGLE_API_KEY="your-api-key"
 *    b) Pass apiKey directly in config (see example below)
 * 
 * Available Voices:
 * - 'en-US-Neural2-A' through 'en-US-Neural2-H' (high quality neural voices)
 * - 'en-US-Studio-A' (premium studio voice)
 * - Or leave voiceName unset for automatic gender selection
 * 
 * Performance with Parallel Batch:
 * - Sequential: 5 narrations × ~2-3s per call = ~12-15 seconds
 * - Parallel: 5 narrations fetched simultaneously = ~2-3 seconds total!
 */

import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createGoogleChirpNarrator } from '../src';

export default makeScene2D(function* (view) {
  // Create Google Chirp narrator
  // Option 1: Pass API key directly (recommended for development)
  const narrator = createGoogleChirpNarrator({
    apiKey: process.env.GOOGLE_API_KEY || 'your-api-key-here',
    voice_name: 'en-US-Neural2-C',
    languageCode: 'en-US',
  });

  // Option 2: Use only environment variable (recommended for production)
  // const narrator = createGoogleChirpNarrator({
  //   voice_name: 'en-US-Neural2-C',
  //   languageCode: 'en-US',
  // });

  const circle = createRef<Circle>();
  const text = createRef<Txt>();

  view.add(
    <>
      <Circle
        ref={circle}
        width={140}
        height={140}
        fill={'#4285f4'}
        y={-50}
      />
      <Txt
        ref={text}
        fontSize={50}
        fontWeight={800}
        fill={'#ffffff'}
        text={'Google Chirp'}
        y={100}
      />
    </>
  );

  // Define all narrations for the presentation
  const narrations = [
    "Welcome to Google Chirp text-to-speech!",
    "This is a high-quality neural voice from Google Cloud.",
    "We're using the parallel batch API for fast pre-fetching.",
    "All these narrations are being fetched simultaneously.",
    "This is much faster than waiting for each one sequentially!",
  ];

  // PRE-FETCH ALL NARRATIONS IN PARALLEL
  // With Google Chirp, this typically takes 2-3 seconds for 5 narrations
  console.log("Starting parallel batch pre-fetch with Google Chirp...");
  yield* narrator.createBatch()
    .speak(narrations[0])
    .speak(narrations[1])
    .speak(narrations[2])
    .speak(narrations[3])
    .speak(narrations[4])
    .resolve();
  console.log("Pre-fetch complete! All audio is cached.");

  yield* waitFor(0.5);

  // Play narrations with synchronized animations
  // All speak() calls are now instant because audio is cached
  yield* all(
    narrator.speak(narrations[0]),
    circle().fill('#ea4335', 2),
    text().text('Welcome!', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak(narrations[1]),
    circle().fill('#fbbc04', 2),
    text().text('High Quality', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak(narrations[2]),
    circle().fill('#34a853', 2),
    text().text('Fast!', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak(narrations[3]),
    circle().fill('#ea4335', 2),
    text().text('Parallel', 1)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak(narrations[4]),
    circle().scale(1.5, 2).to(1, 2),
    text().text('Done!', 1)
  );

  yield* waitFor(1);
});
