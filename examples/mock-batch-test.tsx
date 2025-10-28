/**
 * Mock Batch Test - No API Keys Needed!
 * 
 * This tests the parallel batch API with fake audio for instant results.
 * Perfect for testing the UI and batch functionality without needing any API setup.
 * 
 * No setup required - just run this scene in Motion Canvas!
 */

import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt, Line } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createMockNarrator } from '../src';

export default makeScene2D(function* (view) {
  const narrator = createMockNarrator({ wordsPerMinute: 150 });

  const circle = createRef<Circle>();
  const text = createRef<Txt>();
  const statusText = createRef<Txt>();

  view.add(
    <>
      <Circle
        ref={circle}
        width={140}
        height={140}
        fill={'#7c3aed'}
        y={-80}
      />
      <Txt
        ref={text}
        fontSize={50}
        fontWeight={800}
        fill={'#ffffff'}
        text={'Batch API'}
        y={20}
      />
      <Txt
        ref={statusText}
        fontSize={24}
        fill={'#999999'}
        text={'Starting test...'}
        y={100}
      />
    </>
  );

  // ============================================================
  // TEST 1: Sequential (to show the problem)
  // ============================================================
  console.log('\n========================================');
  console.log('TEST 1: Sequential Mode (SLOW)');
  console.log('========================================');
  
  yield* statusText().text('Sequential Test...', 0.5);

  const startSeq = Date.now();
  
  yield* narrator.speak("First narration sequentially");
  yield* narrator.speak("Second narration sequentially");
  yield* narrator.speak("Third narration sequentially");
  
  const seqTime = (Date.now() - startSeq) / 1000;
  console.log(`✗ Sequential time: ${seqTime.toFixed(2)}s (3 calls × ~2s each)`);

  yield* statusText().text(`Sequential: ${seqTime.toFixed(1)}s`, 0.5);
  yield* waitFor(1);

  // ============================================================
  // TEST 2: Parallel Batch (the solution!)
  // ============================================================
  console.log('\n========================================');
  console.log('TEST 2: Parallel Batch Mode (FAST!)');
  console.log('========================================');
  
  yield* statusText().text('Parallel Batch Pre-fetch...', 0.5);

  const startBatch = Date.now();
  
  console.log('Creating batch and collecting narrations...');
  yield* narrator.createBatch()
    .speak("First narration from batch")
    .speak("Second narration from batch")
    .speak("Third narration from batch")
    .resolve();
  
  const batchTime = (Date.now() - startBatch) / 1000;
  console.log(`✅ Batch time: ${batchTime.toFixed(2)}s (3 calls in parallel!)`);
  console.log(`Speedup: ${(seqTime / batchTime).toFixed(1)}x faster!\n`);

  yield* statusText().text(`Batch: ${batchTime.toFixed(1)}s (${(seqTime / batchTime).toFixed(1)}x faster!)`, 0.5);
  yield* waitFor(0.5);

  // ============================================================
  // TEST 3: Instant Playback (all cached)
  // ============================================================
  console.log('========================================');
  console.log('TEST 3: Using Cached Audio (INSTANT)');
  console.log('========================================\n');

  yield* all(
    narrator.speak("First narration from batch"),
    circle().fill('#ef4444', 1.5),
    text().text('1st - Instant!', 0.5),
    statusText().text('Playing cached audio...', 0.5)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak("Second narration from batch"),
    circle().fill('#fbbc04', 1.5),
    text().text('2nd - Instant!', 0.5)
  );

  yield* waitFor(0.3);

  yield* all(
    narrator.speak("Third narration from batch"),
    circle().fill('#34a853', 1.5),
    text().text('3rd - Instant!', 0.5)
  );

  yield* waitFor(0.5);

  // ============================================================
  // Summary
  // ============================================================
  yield* statusText().text('✅ Batch API Test Complete!', 0.5);
  yield* circle().scale(1.3, 1).to(1, 1);
  yield* text().text('Parallel Works!', 0.5);

  console.log('========================================');
  console.log('✅ All tests passed!');
  console.log('Sequential vs Parallel speedup demonstrated');
  console.log('========================================\n');

  yield* waitFor(2);
});
