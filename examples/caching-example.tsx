import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { 
  createMockNarrator, 
  createElevenLabsNarrator
} from '../lib';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  const text = createRef<Txt>();

  view.add(
    <>
      <Circle
        ref={circle}
        width={140}
        height={140}
        fill={'#10b981'}
        y={-50}
      />
      <Txt
        ref={text}
        fontSize={40}
        fontWeight={800}
        fill={'#ffffff'}
        text={'Caching Demo'}
        y={100}
      />
    </>
  );

  // Example 1: Basic Mock Narrator
  const cachedNarrator = createMockNarrator(
    { wordsPerMinute: 3 },
    {
      rate: 1.0,
      volume: 0.8
    }
  );

  yield* text().text('Mock Narrator', 0.5);
  
  // First call
  yield* cachedNarrator.speak("This is a mock narrator that simulates audio generation.");
  
  yield* waitFor(0.5);
  
  // Second call - same text
  yield* all(
    cachedNarrator.speak("This is a mock narrator that simulates audio generation."),
    circle().fill('#3b82f6', 1)
  );

  yield* waitFor(1);

  // Example 2: ElevenLabs with Server Caching (commented out to avoid API calls)
  /*
  const elevenLabsNarrator = createElevenLabsNarrator({
    apiKey: process.env.ELEVENLABS_API_KEY!,
    voiceId: 'your-voice-id',
    enableServerCache: true  // Server-side caching enabled
  });

  yield* text().text('ElevenLabs Server Cache', 0.5);

  // First call makes API request and caches on server
  yield* elevenLabsNarrator.speak("This audio will be cached on the server for team sharing.");
  
  // Second call uses server cache
  yield* elevenLabsNarrator.speak("This audio will be cached on the server for team sharing.");
  */

  yield* text().text('Server Cache Demo', 0.5);

  yield* all(
    cachedNarrator.speak("Server-side caching provides persistent storage and team collaboration."),
    circle().fill('#8b5cf6', 1),
    circle().rotation(180, 1)
  );

  // Final message
  yield* all(
    text().text('Caching Complete!', 1),
    circle().scale(1.5, 1).to(1, 1)
  );
});