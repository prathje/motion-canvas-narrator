import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { 
  createFileNarrator, 
  FileProvider,
  fluent 
} from '../src';

export default makeScene2D(function* (view) {
  const circle = createRef<Circle>();
  const text = createRef<Txt>();

  view.add(
    <>
      <Circle
        ref={circle}
        width={140}
        height={140}
        fill={'#059669'}
        y={-50}
      />
      <Txt
        ref={text}
        fontSize={40}
        fontWeight={800}
        fill={'#ffffff'}
        text={'File Provider'}
        y={100}
      />
    </>
  );

  // Example 1: Basic FileProvider usage
  const fileNarrator = createFileNarrator({
    audioDirectory: './assets/audio' // Optional base directory
  });

  yield* text().text('Basic Usage', 0.5);

  // Note: These examples show the API - in real usage you'd provide actual audio files
  try {
    // Method 1: Using FileNarrationOptions for complex requests
    const complexRequest = FileProvider.createRequest(
      './intro.mp3', 
      'Welcome to our presentation about Motion Canvas!'
    );
    
    // This would work with real audio files:
    // yield* fileNarrator.speak(complexRequest);
    
    // For demo, we'll simulate this
    yield* all(
      // Simulated file narration (would be replaced by actual file audio)
      waitFor(2.5), // Simulate audio duration
      circle().fill('#dc2626', 2.5)
    );

    yield* waitFor(0.5);

    // Method 2: Direct URL usage (provider handles it as audioUrl)
    yield* text().text('Direct URL', 0.5);
    
    // The FileProvider can handle URLs directly
    // yield* fileNarrator.speak('./outro.wav');
    
    yield* all(
      waitFor(1.8), // Simulate audio duration
      circle().fill('#7c3aed', 1.8),
      text().text('URL Handled', 0.5)
    );

    yield* waitFor(0.5);

    // Example 2: FileProvider with different base directory
    const assetsFileNarrator = createFileNarrator({
      audioDirectory: './assets/narration'
    });

    yield* text().text('Different Directory', 0.5);

    // Files from different base directory
    // yield* assetsFileNarrator.speak(FileProvider.createRequest('./welcome.mp3'));
    
    yield* all(
      waitFor(2.1), // Simulate cached audio
      circle().fill('#f59e0b', 2.1)
    );

    yield* waitFor(0.5);

    // Example 3: Fluent interface with FileProvider  
    const fluentFileNarrator = fluent(fileNarrator);

    yield* text().text('Fluent Files', 0.5);
    
    // Complex file narration with fluent interface
    // yield* fluentFileNarrator
    //   .say(FileProvider.createRequest('./complex.mp3', 'Complex narration with effects'))
    //   .withId('complex_file')
    //   .atRate(1.2)  // Playback rate adjustment
    //   .withGain(-3) // Volume adjustment
    //   .trimmed(1.0, 5.0) // Play only seconds 1-5
    //   .speak();

    yield* all(
      waitFor(2.8), // Simulate complex audio
      circle().rotation(180, 2.8),
      circle().fill('#ec4899', 2.8)
    );

    yield* waitFor(0.5);

    // Example 4: Mixed providers in same scene
    // You can use FileProvider alongside other providers
    const mixedSceneDemo = async function* () {
      yield* text().text('Mixed Providers', 0.5);
      
      // File-based intro
      // yield* fileNarrator.speak('./intro.mp3');
      yield* waitFor(1.5);
      
      // You could switch to TTS for dynamic content here
      // const ttsNarrator = createMockNarrator();
      // yield* ttsNarrator.speak("And now for some dynamic content");
      
      yield* all(
        circle().fill('#06b6d4', 2),
        text().text('Mixed Demo', 1)
      );
    };

    yield* mixedSceneDemo();

    yield* waitFor(0.5);

    // Example 5: Validation and error handling
    yield* text().text('Validation', 0.5);

    // FileProvider includes validation utilities
    const provider = new FileProvider();
    
    // In real usage, you can validate files before using them:
    // const isValidFile = yield provider.validateAudioFile('./test.mp3');
    // if (!isValidFile) {
    //   console.warn('Audio file not accessible');
    // }

    yield* all(
      circle().scale(0.8, 1).to(1.2, 1).to(1, 1),
      text().text('Validated', 1)
    );

  } catch (error) {
    // In real usage, handle file loading errors
    console.log('File provider demo - would work with real audio files');
    yield* text().text('Demo Mode', 0.5);
  }

  yield* waitFor(0.5);

  // Summary
  yield* all(
    text().text('FileProvider Ready!', 1),
    circle().fill('#059669', 1),
    circle().rotation(360, 2)
  );
});