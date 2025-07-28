import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createElevenLabsNarrator } from '../lib';

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
        text={'Server Cache Demo'}
        y={100}
      />
    </>
  );

  // Create narrator with server-side caching enabled
  const narrator = createElevenLabsNarrator(
    {
      // You'll need to provide your actual API key and voice ID
      apiKey: process.env.ELEVENLABS_API_KEY || 'your-api-key-here',
      voiceId: 'your-voice-id-here',
      modelId: 'eleven_flash_v2_5',
      
      // Server cache configuration
      enableServerCache: true,
      serverCacheUrl: '/__narrator-audio/'
    },
    {
      rate: 1.0,
      volume: 0.8,
    }
  );

  yield* text().text('Server Cache Loading...', 0.5);
  
  // First call - will generate audio and upload to server
  yield* narrator.speak("This audio will be cached on the server for faster future access.");
  
  yield* all(
    circle().fill('#3b82f6', 1),
    text().text('First Generation', 0.5)
  );

  yield* waitFor(1);

  // Second call - will use server cache (fast)
  yield* all(
    narrator.speak("This audio will be cached on the server for faster future access."),
    circle().scale(1.2, 1).to(1, 1),
    text().text('Server Cache Hit', 0.5)
  );

  yield* waitFor(1);

  // Different text - will generate new audio and cache it on server
  yield* all(
    circle().fill('#8b5cf6', 1),
    text().text('New Audio Generated', 0.5)
  );

  yield* narrator.speak("This is different text that will create a new cache entry on the server.");

  yield* all(
    circle().rotation(180, 1),
    text().text('Server Cache Demo', 0.5)
  );

  yield* waitFor(1);

  // Show the benefits of server-side caching
  yield* all(
    circle().fill('#ec4899', 1),
    text().text('Benefits Shown!', 1)
  );

  yield* narrator.speak("Server-side caching provides persistent storage, team sharing, and reduced API costs.");

  yield* waitFor(0.5);

  // Final message
  yield* all(
    text().text('Cache Complete!', 1),
    circle().scale(1.5, 1).to(1, 1)
  );
});