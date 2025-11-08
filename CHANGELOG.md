# Changelog



## [0.0.2] - 2025-11-08

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
They were not configured properly before.

```ts
const narrator = createMockNarrator();

// set narrator default sound options
narrator.setDefaultPlaybackOptions({
    volume: 0.8,
    playbackRate: 1.2,
});
    
// or provide them per narration
narrator.speak({
    text: "Hello, world!",
    }, 
    {
        volume: 0.5, // Override default volume for this narration
    }
);

// also available when using play()
narrator.play(narration,
    {
        volume: 0.5, // Override default volume for this narration
    }
);
```

