    # Examples

This directory contains example usage of the Motion Canvas Narrator package.

## Basic Example (`basic.tsx`)

Demonstrates the core features of the narrator:

- **Basic narration** - Simple text-to-speech integration
- **Synchronized animations** - Narration playing alongside visual animations  
- **Sequential narration** - Waiting for narration to finish before continuing
- **Audio effects** - Gain control and playback rate adjustment
- **Audio trimming** - Playing specific portions of narration
- **Offset timing** - Starting narration with a delay
- **Visual feedback** - Text updates showing narration progress

## Subtitle Examples

### Simple Subtitles (`subtitles.tsx`)
Shows how to create a wrapper that displays subtitles synchronized with narration:

- **Typing effect** - Subtitles appear with typewriter animation
- **Synchronized timing** - Text displays exactly with speech
- **Fade transitions** - Smooth subtitle appearance/disappearance
- **Fast speech support** - Readable subtitles even with high playback rates

### Advanced Subtitles (`advanced-subtitles.tsx`)
Demonstrates word-by-word subtitle highlighting:

- **Word highlighting** - Each word lights up as it's spoken
- **Perfect synchronization** - Timing calculated from narration duration
- **Visual feedback** - Background and scaling effects
- **Complex animations** - Subtitles integrated with scene animations

## ElevenLabs Integration (`elevenlabs-example.tsx`)

Shows how to use the real ElevenLabs TTS provider:

- **API Integration** - Real TTS using ElevenLabs API
- **Voice Selection** - Multiple voices (Rachel, Sarah, Antoni, etc.)
- **Quality Settings** - Stability, similarity boost, style controls
- **Rate Control** - Speech speed adjustment
- **Accurate Duration** - Gets real audio duration from generated files
- **Error Handling** - Proper API error management

## Simplified Architecture (`simplified-example.tsx`)

Demonstrates the clean, simplified Motion Canvas Narrator API:

- **Simplified Configuration** - No complex caching setup at narrator level
- **Motion Canvas Integration** - Full support for SoundSettings including detune
- **Provider-Specific Features** - Each provider handles its own optimization
- **Clean API** - Removed unnecessary complexity while maintaining power
- **Audio Effects** - Gain, playback rate, detune, and trimming support
- **Fluent Interface** - Method chaining for complex configurations
- **Prepare & Reuse** - Efficient narration reuse patterns

## API Styles (`api-styles-example.tsx`)

Demonstrates different ways to use the narrator API for maximum developer convenience:

- **Original API** - Options object with cacheId parameter
- **ID-First Methods** - `cached(id, text)` shortcuts for common cases
- **FileProvider** - Dedicated provider for user-provided audio files
- **Fluent Interface** - Method chaining for complex configurations
- **Builder Pattern** - Flexible construction of narration requests
- **Prepare vs Speak** - Advanced patterns for narration reuse

## File Provider (`file-provider-example.tsx`)

Shows how to use pre-recorded audio files instead of TTS:

- **Audio File Loading** - Support for local files, URLs, and blob URLs
- **Directory Configuration** - Optional base directory for relative paths
- **Subtitle Support** - Provide text transcripts for audio files
- **Duration Detection** - Automatic audio duration measurement
- **Caching** - File-based narrations can be cached too
- **Validation** - Check file accessibility before use
- **Mixed Usage** - Combine with TTS providers in same scene

### Setup:
1. Install the ElevenLabs SDK (optional dependency):
   ```bash
   npm install @elevenlabs/elevenlabs-js
   ```
2. Get an API key from [ElevenLabs](https://elevenlabs.io)
3. Copy `.env.example` to `.env` and add your key:
   ```
   ELEVENLABS_API_KEY=your_api_key_here
   ```
4. Use the `createElevenLabsNarrator` factory

### Key Features Shown:

1. **Native Flow Control** - Use `yield*` vs `yield` to control timing
2. **Audio Control** - Gain, playback rate, and trimming options
3. **Concurrent Execution** - Use `all()` to run speech with animations
4. **Background Speech** - Use `yield` (no `*`) for non-blocking narration
5. **Sequential Flow** - Multiple `yield*` calls wait for each to complete

### Usage:

#### Basic Factory Pattern:
```ts
// Using provider-specific factory (recommended)
const narrator = createMockNarrator(
  { wordsPerSecond: 2.5 }, // Provider config
  { 
    rate: 1.0,
    volume: 0.8
  } // Narrator config
);

// Or using generic factory
const narrator = createNarrator({
  provider: 'mock',
  wordsPerSecond: 2.5,
  rate: 1.0,
  volume: 0.8
});
```

#### Basic Usage:
```ts
// Sequential (waits for each to complete)  
yield* narrator.speak("Hello world!");
yield* narrator.speak("Second sentence");

// Concurrent (runs together)
yield* all(
  narrator.speak("Moving circle!"),
  circle().position.x(300, 2)
);

// Start narration but don't wait (background speech)
yield narrator.speak("Background narration");
yield* circle.position.x(300, 2); // Runs while speech continues

// With audio effects (overrides config)
yield* narrator.speak("Faster and quieter", { 
  playbackRate: 1.5, 
  gain: -6 
});

// With trimming and offset  
yield* narrator.speak("Only middle part plays", { 
  trim: { start: 1.0, end: 3.0 },
  offset: 2
});
```

#### Advanced Usage with Narration Class:
```ts
// Prepare narration for reuse
const narration = yield narrator.prepare("Reusable narration!");

// Play with different settings
yield* narration.play({ gain: -3, playbackRate: 0.8 });
yield* waitFor(1);
yield* narration.play({ gain: 3, playbackRate: 1.5 }); // Same audio, different playback
```

#### Subtitle Integration:
```ts
// Simple subtitle wrapper
class SubtitledNarrator {
  constructor(narrator: Narrator, subtitleText: Txt) {
    this.narrator = narrator;
    this.subtitleText = subtitleText;
  }

  *speak(text: string, options: SpeakOptions = {}): ThreadGenerator {
    yield* all(
      this.narrator.speak(text, options),
      this.displaySubtitle(text)
    );
  }

  private *displaySubtitle(text: string): ThreadGenerator {
    yield* this.subtitleText.text(text, 0.5); // Typing effect
    yield* waitFor(0.5);
    yield* this.subtitleText.opacity(0, 0.3); // Fade out
    yield* this.subtitleText.opacity(1, 0); // Reset
  }
}

// Usage
const subtitledNarrator = new SubtitledNarrator(narrator, subtitleTextRef());
yield* subtitledNarrator.speak("This text appears as subtitles!");

#### Simplified Configuration:
```ts
// Clean, simple narrator setup
const narrator = createMockNarrator(
  { wordsPerSecond: 2.5 },  // Provider config
  { 
    rate: 1.0,              // Playback rate
    volume: 0.8             // Volume level
  }                         // Narrator config
);

// Advanced audio effects (Motion Canvas SoundSettings compatible)
yield* narrator.speak("Enhanced audio", {
  playbackRate: 1.2,      // Speed adjustment
  gain: -3,               // Volume in dB
  detune: 100,            // Pitch shift in cents
  trim: { start: 1, end: 4 } // Audio trimming
});

// FileProvider for user audio files
const fileNarrator = createFileNarrator({
  audioDirectory: './assets/audio'
});

yield* fileNarrator.speak(FileProvider.createRequest('./intro.mp3', 'Welcome!'));
```

#### API Style Options:
```ts
// 1. Basic API (clean and simple)
yield* narrator.speak("Hello world", { playbackRate: 1.2 });

// 2. Fluent/Builder pattern (flexible)
import { fluent } from 'motion-canvas-narrator';

const fluentNarrator = fluent(narrator);

yield* fluentNarrator
  .say("Complex narration example")
  .atRate(1.3)
  .withGain(-6)
  .trimmed(0.5, 4.0)
  .delayed(0.3)
  .speak();

// 3. FileProvider for user audio files
import { createFileNarrator, FileProvider } from 'motion-canvas-narrator';

const fileNarrator = createFileNarrator({
  audioDirectory: './assets/audio'
});

// File request with subtitle text
yield* fileNarrator.speak(
  FileProvider.createRequest('./intro.mp3', 'Welcome to our presentation!')
);

// Fluent file usage
const fluentFileNarrator = fluent(fileNarrator);
yield* fluentFileNarrator
  .say(FileProvider.createRequest('./outro.mp3', 'Thanks for watching!'))
  .withGain(3)
  .speak();

// 4. Prepare pattern (for reuse)
const narration = yield fluentNarrator
  .say("Reusable narration")
  .prepare();

// Play multiple times with different settings
yield* narration.play({ gain: -3 });
yield* narration.play({ playbackRate: 1.5 });

// 5. Generic factory with FileProvider
const fileNarratorGeneric = createNarrator({
  provider: 'file',
  audioDirectory: './assets'
});
```

#### ElevenLabs Integration:
```ts
// Using ElevenLabs TTS
const narrator = createElevenLabsNarrator(
  {
    apiKey: process.env.ELEVENLABS_API_KEY!,
    defaultModel: 'eleven_multilingual_v2'
  },
  {
    voice: 'Rachel',        // Voice name
    rate: 1.0,              // Speech rate
    volume: 0.8,            // Similarity boost
    style: 0.3,             // Style variation (ElevenLabs-specific)
    useSpeakerBoost: true   // Speaker boost (ElevenLabs-specific)
  }
);

// Use exactly like any other narrator
yield* narrator.speak("High quality text-to-speech with ElevenLabs!");
```

## Adding Custom Providers

To use real TTS services, implement the `NarrationProvider` interface and create a factory:

```ts
// 1. Implement the provider
class ElevenLabsProvider implements NarrationProvider {
  name = 'ElevenLabs TTS';
  private apiKey: string;
  private defaultModel: string;
  
  constructor(config: { apiKey: string; defaultModel?: string }) {
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel || 'eleven_monolingual_v1';
  }
  
  async prepareNarration(text: string, context: NarrationContext): Promise<Narration> {
    // Use narrator's context for voice, rate, etc.
    const voice = context.voice || 'Rachel'; // Use narrator's voice or default
    const stabilityAdjustment = context.rate ? (2 - context.rate) * 0.2 : 0.5;
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: context.model || this.defaultModel,
        voice_settings: {
          stability: Math.max(0, Math.min(1, stabilityAdjustment)),
          similarity_boost: context.volume || 0.5,
          speed: context.rate || 1.0 // Provider handles rate
        }
      })
    });
    
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const duration = estimateDurationFromText(text, context.rate);
    
    return new Narration({
      text,
      audioUrl,
      duration
    });
  }
}

// 2. Create a factory function
export function createElevenLabsNarrator(
  providerConfig: { apiKey: string; defaultModel?: string },
  narratorConfig: NarratorConfig = {}
): Narrator {
  const provider = new ElevenLabsProvider(providerConfig);
  return new Narrator(provider, narratorConfig);
}

// 3. Usage:
const narrator = createElevenLabsNarrator(
  {
    apiKey: process.env.ELEVENLABS_API_KEY!,
    defaultModel: 'eleven_multilingual_v2'
  },
  {
    voice: 'Rachel',    // Provider uses this
    rate: 1.2,          // Provider adjusts settings based on this
    volume: 0.9         // Provider maps this to voice settings
  }
);
```
