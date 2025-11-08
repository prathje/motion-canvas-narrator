# Changelog

## [0.0.1] - Initial Release
Basic functionality.

## [0.0.2] - WIP

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

// also available when using play()
narrator.play(narration,
    {
        gain: -5.2, // Override default volume for this narration
    }
);
```

### Added support for Minimax TTS Provider
Thanks to NeverOccurs for the contribution! See PR [here](https://github.com/prathje/motion-canvas-narrator/pull/3).

### Introduced DedupedProvider
A wrapper provider that deduplicates identical text requests to avoid generating the same audio multiple times when the same text is requested more than once.

