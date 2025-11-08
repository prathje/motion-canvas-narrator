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
- **Custom Providers**: Easily add your own TTS providers (contributions welcome!).
- **Server Caching**: Cache audio files on the server to avoid re-generating them.
- **Mock Narrator**: For testing without audio generation, useful for planning scripts and subtitles.

## Provider Support

| **Provider**	      | **TTS** 	  |  **Voice Cloning** 	  |  **Fine Grained Timestamps** 	  | **Remarks**      |
|--------------------|:----------:|:---------------------:|:-------------------------------:|------------------|
| **ElevenLabs** 	   |    ✅ 	     |           	           |                	                | Requires Account |
| **Open AI**    	   |     	      |           	           |                	                | Missing          |
| **Google TTS** 	   |     	      |           	           |                	                | Missing          |
| **speechify**  	   |     	      |           	           |                	                | Missing        |


Other potential providers:
- [piper1](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/API_HTTP.md): GPL licensed, can be easily set up on your machine.
- [Web Speech API](https://github.com/mdn/dom-examples/blob/main/web-speech-api/speak-easy-synthesis/script.js): Built-in browser TTS, no API key required, but does not support exporting audio files.
- [speechify](https://speechify.com/)


## Planned Features

- **In-Editor Recording**: Record your own narrations directly in the Motion Canvas editor.
- **Subtitles**: Display precise subtitles with your narrations (check out the example project for rudimentary subtitles).
- **Caption Export**: Export subtitles in various formats (e.g., WebVTT).
- **Detailed Timestamping**: Timestamps for individual characters and words allow better synchronization and subtitles ([example](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)).


## Usage

Using Motion Canvas Narrator in your Motion Canvas project is straightforward and only requires a few steps to set up.
You can also check out the example project that includes subtitles used for the demo video here: [Example Project](https://github.com/prathje/motion-canvas-narrator-example-project)

### 1. Install the Package

```bash
npm install https://github.com/prathje/motion-canvas-narrator.git
```

### 2. Enable the Narrator Plugin in your *vite.config.ts*
This plugin is responsible for caching audio files on the server, so you don't have to re-generate them every time you run your project.
You only need to add the plugin to your `vite.config.ts` file:



```typescript
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

import { motionCanvasNarratorPlugin } from 'motion-canvas-narrator/vite-plugin';

export default defineConfig({
  plugins: [
    motionCanvas(),
    ffmpeg(), // make sure that you setup ffmpeg to export audio as well
    // Add the narrator plugin for server-side audio caching:
    motionCanvasNarratorPlugin(),
  ]
});
```


### 3. Create a Narrator (e.g., using ElevenLabs)
The narrator serves as the primary interface for generating audio from text.

```typescript
import { createElevenLabsNarrator } from 'motion-canvas-narrator';
const narrator = createElevenLabsNarrator({
    modelId: 'eleven_v3',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    apiKey: '<YOUR_ELEVENLABS_API_KEY>'
});
```

### 4. Use the Narrator in Your Motion Canvas Project
To use the narrator, you can start narrations in your scenes as simply as:
```typescript
  yield* narrator.speak("Welcome!");
```
This will generate frames for the duration of the narration.
Note that the narration seamlessly integrates with Motion Canvas' animation system, allowing you to synchronize animations with the narration, using `all` for example:

```typescript
  yield* all(
      // ... other animations ...
    narrator.speak("Welcome!")
  );
```

### 5. Advanced Usage
You can also customize the narration further by providing additional options such as volume and playback rate:
```typescript
    yield* narrator.speak("Hello, world!", { gain: -5.2, playbackRate: 1.2 });
```

## Contributing

If you'd like to contribute to this project, please feel free to open issues or pull requests.
