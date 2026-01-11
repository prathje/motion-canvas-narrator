# Changelog

## [0.1.0] - Initial Release
Basic functionality.

## [0.2.0]

### Merged text and NarrationOptions into a single object parameter
Previous:
```ts
narrator.speak(text, options);
```

Now you pass a unified object, e.g.:
```ts
narrator.speak({ text, ...options });
narrator.resolve({ text, ...options });
```

### Sound Settings removed from NarrationOptions use NarrationPlaybackOptions instead
Sound settings are now configured directly on the narrator instance and can be passed to the narrator methods.
The Narration now only contains the metadata and the audio string.
They were not configured properly before.

```ts
const narrator = createMockNarrator();

// set narrator default playback options
narrator.setDefaultPlaybackOptions({
    gain: -5.2,
    playbackRate: 1.2,
});
    
// or provide them per narration
narrator.speak({
    text: "Hello, world!",
    }, 
    {
        gain: -5.2, // Override default volume for this narration
    }
);

// also available when using start()
narrator.start(narration,
    {
        gain: -5.2, // Override default volume for this narration
    }
);
```

### Added support for Minimax TTS Provider
Thanks to NeverOccurs for the contribution! See PR [here](https://github.com/prathje/motion-canvas-narrator/pull/3).

### Introduced DedupedProvider
A wrapper provider that deduplicates identical text requests to avoid generating the same audio multiple times when the same text is requested more than once.

### Migrated to motion-canvas-cache package
The AudioCache and ViteCachePlugin have been replaced with the generic `motion-canvas-cache` package. This provides a cleaner separation of concerns:

**Breaking Changes:**
- **Vite Plugin**: Import `motionCanvasCachePlugin` directly from `motion-canvas-cache` instead of the old `motionCanvasNarratorPlugin`
- **AudioUtils**: The following methods have been moved to `CacheUtils` from `motion-canvas-cache`:
  - `AudioUtils.generateAudioId()` → `CacheUtils.generateCacheKey()`
  - `AudioUtils.streamToArrayBuffer()` → `CacheUtils.streamToArrayBuffer()`
  - `AudioUtils.blobToDataUrl()` → `CacheUtils.blobToDataUrl()`
- **AudioUtils** now only contains audio-specific methods: `getAudioDuration()` and its helpers

**Migration Guide:**
```ts
// Before
import { motionCanvasNarratorPlugin } from 'motion-canvas-narrator/vite-plugin';

// After
import { motionCanvasCachePlugin } from 'motion-canvas-cache/vite-plugin';
```

The cache directory now defaults to `motion-canvas-cache` instead of `narrator-cache`.

## Addition of Narrator.resolveAll method
This allows resolving multiple narrations in parallel, e.g.:
```ts
const narrations = yield narrator.resolveAll(["A", "B", "C"]);
```


## [0.3.0] WIP
