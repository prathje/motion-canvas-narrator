# Motion Canvas Narrator:

Motion Canvas Narrator seamlessly integrates narration into your Motion Canvas workflow.
Inspired by Motion Canvas' idea of letting your code define your animations, this package allows you to define narrations in code, making it easy to synchronize voiceovers and subtitles with your animations.
You define your narrations and let them guide you through your voice recordings while displaying subtitles in the editor - or you let AI generate the audio for you.

Please note that this package is still in early development, so some bugs and missing features are expected. Contributions and suggestions are highly welcome!

## Demo Video (Make sure to enable audio!)
https://github.com/user-attachments/assets/bafdc53d-0370-4efa-b15d-4376cd10462b

The source code is available here: [Example Project](https://github.com/prathje/motion-canvas-narrator-example-project)

## Features

- **Narration in Code**: Define your narrations directly in your Motion Canvas code.
- **AI Narration**: Use AI to generate voiceovers from text.
- **Parallel Batch API**: Pre-fetch multiple narrations in parallel for 3-4x faster generation.
- **Multiple Providers**: ElevenLabs, Google Chirp, File-based, and Mock providers.
- **Custom Providers**: Easily add your own TTS providers (contributions welcome!).
- **Server Caching**: Cache audio files on the server to avoid re-generating them.
- **Auto Caching**: Browser-based caching with IndexedDB persistence.
- **Mock Narrator**: For testing without audio generation, useful for planning scripts and subtitles.

## Provider Support

| **Provider** | **TTS** | **Parallel Batch** | **Languages** | **Setup** |
|---|---|---|---|---|
| **ElevenLabs** | ✅ | ✅ | Multiple | API Key |
| **Google Chirp** | ✅ | ✅ | 30+ | API Key |
| **Mock** | ✅ | ✅ | N/A | None |
| **File-based** | ✅ | ✅ | N/A | Audio Files |

## Installation

```bash
npm install https://github.com/prathje/motion-canvas-narrator.git
```

## Quick Start

### 1. Configure Vite Plugin

Add to your `vite.config.ts`:

```typescript
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';
import { motionCanvasNarratorPlugin } from 'motion-canvas-narrator/vite-plugin';

export default defineConfig({
  plugins: [
    motionCanvas(),
    ffmpeg(),
    motionCanvasNarratorPlugin(),
  ]
});
```

### 2. Basic Usage - Sequential

```typescript
import { createElevenLabsNarrator } from 'motion-canvas-narrator';

export default makeScene2D(function* (view) {
  const narrator = createElevenLabsNarrator({
    voiceId: 'YOUR_VOICE_ID',
    apiKey: 'YOUR_API_KEY',
  });

  yield* narrator.speak("Welcome!");
  yield* narrator.speak("This is sequential");
  yield* narrator.speak("It takes about 30 seconds");
});
```

### 3. Parallel Batch API (Recommended!) - 3-4x Faster

```typescript
import { createElevenLabsNarrator } from 'motion-canvas-narrator';

export default makeScene2D(function* (view) {
  const narrator = createElevenLabsNarrator({
    voiceId: 'YOUR_VOICE_ID',
    apiKey: 'YOUR_API_KEY',
  });

  // PRE-FETCH all narrations in parallel (~10 seconds instead of 30!)
  yield* narrator.createBatch()
    .speak("Welcome!")
    .speak("This is parallel")
    .speak("All fetched at once")
    .resolve();

  // Now all speak() calls are instant (cached)
  yield* narrator.speak("Welcome!");
  yield* narrator.speak("This is parallel");
  yield* narrator.speak("All fetched at once");
});
```

## Google Chirp (30+ Languages, High Quality)

### Setup

```bash
# 1. Get API key from https://console.cloud.google.com/
# 2. Enable Text-to-Speech API
# 3. Set environment variable or pass in config
export GOOGLE_API_KEY="your-api-key"
```

### Basic Usage

```typescript
import { createGoogleChirpNarrator } from 'motion-canvas-narrator';

export default makeScene2D(function* (view) {
  // Method 1: Pass API key directly
  const narrator = createGoogleChirpNarrator({
    apiKey: 'your-api-key',
    voice_name: 'en-US-Neural2-C',
    languageCode: 'en-US',
  });

  // Method 2: Use environment variable
  // const narrator = createGoogleChirpNarrator({
  //   voice_name: 'en-US-Neural2-C',
  // });

  yield* narrator.speak("Welcome to Google Chirp!");
});
```

### Batch API with Google Chirp

```typescript
const narrator = createGoogleChirpNarrator({
  apiKey: 'your-api-key',
  voice_name: 'en-US-Neural2-C',
});

// Pre-fetch 5 narrations in parallel (~2-3 seconds)
yield* narrator.createBatch()
  .speak("Introduction")
  .speak("Point 1")
  .speak("Point 2")
  .speak("Point 3")
  .speak("Conclusion")
  .resolve();

// All speak() calls are now instant
yield* narrator.speak("Introduction");
yield* narrator.speak("Point 1");
yield* narrator.speak("Point 2");
yield* narrator.speak("Point 3");
yield* narrator.speak("Conclusion");
```

### Available Google Chirp Voices

**English:**
- `en-US-Neural2-A` through `en-US-Neural2-H` (8 voices)
- `en-US-Studio-A`, `en-US-Studio-B` (Premium)

**Other Languages:**
- Spanish: `es-ES-Neural2-A`
- French: `fr-FR-Neural2-A`
- German: `de-DE-Neural2-A`
- And 25+ more languages...

## ElevenLabs

### Setup

```bash
export ELEVENLABS_API_KEY="your-api-key"
npm install @elevenlabs/elevenlabs-js  # Optional dependency
```

### Usage

```typescript
import { createElevenLabsNarrator } from 'motion-canvas-narrator';

const narrator = createElevenLabsNarrator({
  voiceId: 'YOUR_VOICE_ID',
  modelId: 'eleven_flash_v2_5',
});

yield* narrator.speak("High quality voice synthesis!");
```

### Batch API with ElevenLabs

```typescript
yield* narrator.createBatch()
  .speak("Text 1")
  .speak("Text 2")
  .speak("Text 3")
  .resolve();

// All cached, instant playback
yield* narrator.speak("Text 1");
yield* narrator.speak("Text 2");
yield* narrator.speak("Text 3");
```

## Performance Comparison

| Approach | 3 Narrations | 5 Narrations | 10 Narrations |
|---|---|---|---|
| Sequential | ~30s | ~50s | ~100s |
| **Batch (ElevenLabs)** | **~10s** | **~10s** | **~10s** |
| **Batch (Google Chirp)** | **~3s** | **~3s** | **~3s** |

## Batch API Reference

```typescript
// Create a batch
const batch = narrator.createBatch();

// Add narrations (chainable)
batch
  .speak("Text 1")
  .speak("Text 2")
  .speak("Text 3");

// Pre-fetch all in parallel
yield* batch.resolve();

// Or chain it all together
yield* narrator.createBatch()
  .speak("Text 1")
  .speak("Text 2")
  .speak("Text 3")
  .resolve();

// Now all speak() calls use cached audio
yield* narrator.speak("Text 1");  // Instant!
```

## Examples

See the `examples/` directory for complete working examples:

- `mock-batch-test.tsx` - Test batch API without API keys
- `parallel-batch-example.tsx` - Batch API with ElevenLabs
- `google-chirp-batch-example.tsx` - Batch API with Google Chirp
- `elevenlabs-example.tsx` - ElevenLabs basic usage
- `basic.tsx` - Basic narration with mock provider

## Synchronizing with Animations

```typescript
import { all } from '@motion-canvas/core/lib/flow';

yield* all(
  narrator.speak("Welcome to the animation!"),
  circle().fill('#ff0000', 2),    // 2 second animation
  text().text('Hello', 1)          // 1 second animation
);
```

## Contributing

If you'd like to contribute to this project, please feel free to open issues or pull requests.
