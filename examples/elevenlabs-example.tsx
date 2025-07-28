/**
 * ElevenLabs Text-to-Speech Integration Example with Browser Persistent Caching
 * 
 * Setup Instructions:
 * 1. Install the ElevenLabs package: npm install @elevenlabs/elevenlabs-js
 * 2. Get your API key from https://elevenlabs.io/
 * 3. Set environment variable: export ELEVENLABS_API_KEY="your-api-key"
 * 4. Get voice IDs from your ElevenLabs dashboard or API
 * 5. Replace 'YOUR_VOICE_ID' and 'ANOTHER_VOICE_ID' with actual voice IDs
 * 
 * Available Models:
 * - 'eleven_flash_v2_5': Fast, high-quality synthesis (default)
 * - 'eleven_multilingual_v2': Supports multiple languages
 * - 'eleven_turbo_v2_5': Even faster synthesis
 * - 'eleven_monolingual_v1': English-only, high quality
 * 
 * Browser Persistent Caching (IndexedDB):
 * - Audio files are cached in browser's IndexedDB
 * - Persist across browser sessions and page reloads
 * - Automatic cleanup based on age and size limits
 * - Manual cache cleanup available via cleanupCache()
 * - Works entirely within browser security constraints
 */

import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { createElevenLabsNarrator } from '../src';

export default makeScene2D(function* (view) {
  // Create ElevenLabs narrator with eleven_flash_v2_5 model (fastest, high-quality)
  // Replace 'YOUR_VOICE_ID' with an actual ElevenLabs voice ID
  const narrator = createElevenLabsNarrator({
    voiceId: 'YOUR_VOICE_ID',           // Required: ElevenLabs voice ID
    modelId: 'eleven_flash_v2_5',       // Optional: defaults to eleven_flash_v2_5
    // apiKey: 'your-api-key',          // Optional: will use ELEVENLABS_API_KEY env var if not provided
    
    // Browser Cache Configuration (Optional)
    maxCacheSize: 50,                   // Maximum cache size in MB (default: 100MB)
    maxCacheAge: 7,                     // Maximum cache age in days (default: 30 days)
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
        text={'ElevenLabs TTS'}
        y={100}
      />
    </>
  );

  // Example 1: Basic ElevenLabs narration with eleven_flash_v2_5 model
  yield* narrator.speak("Welcome to ElevenLabs text-to-speech integration with Motion Canvas!");

  yield* waitFor(0.5);

  // Example 2: Different voice using the same model
  const secondNarrator = createElevenLabsNarrator({
    voiceId: 'ANOTHER_VOICE_ID',        // Use a different voice ID
    modelId: 'eleven_flash_v2_5',       // Same fast model
  });

  yield* all(
    secondNarrator.speak("Here's the same eleven_flash_v2_5 model with a different voice."),
    circle().fill('#ef4444', 2),
    text().text('Different Voice', 1)
  );

  yield* waitFor(0.5);

  // Example 3: Using eleven_multilingual_v2 model for multilingual support
  const multilingualNarrator = createElevenLabsNarrator({
    voiceId: 'YOUR_VOICE_ID',
    modelId: 'eleven_multilingual_v2',  // Multilingual model
  });

  yield* all(
    multilingualNarrator.speak("Hello! 你好! Hola! Bonjour! This is multilingual text-to-speech!"),
    circle().scale(1.5, 2).to(1, 2),
    text().text('Multilingual', 1)
  );

  yield* waitFor(0.5);

  // Example 4: Environment variable usage demonstration
  // This works when ELEVENLABS_API_KEY is set in your environment
  const envNarrator = createElevenLabsNarrator({
    voiceId: 'YOUR_VOICE_ID',
    // No apiKey needed - will use ELEVENLABS_API_KEY environment variable
  });

  yield* all(
    envNarrator.speak("API key loaded from environment variable automatically!"),
    circle().rotation(360, 3),
    text().text('Environment!', 1)
  );

  yield* waitFor(0.5);

  // Final message
  yield* all(
    narrator.speak("That's how easy it is to use ElevenLabs with Motion Canvas Narrator!"),
    circle().fill('#7c3aed', 1),
    text().text('Amazing!', 1)
  );
});