import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt, Node, Rect } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { ThreadGenerator } from '@motion-canvas/core/lib/threading';
import { easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import { createMockNarrator, Narrator, SpeakOptions } from '../src';

// Advanced subtitle wrapper with word-by-word highlighting
class AdvancedSubtitledNarrator {
  private narrator: Narrator;
  private subtitleContainer: Node;
  private subtitleBackground: Rect;

  constructor(narrator: Narrator, subtitleContainer: Node, subtitleBackground: Rect) {
    this.narrator = narrator;
    this.subtitleContainer = subtitleContainer;
    this.subtitleBackground = subtitleBackground;
  }

  public *speak(text: string, options: SpeakOptions = {}): ThreadGenerator {
    // Prepare narration to get duration
    const narration = yield this.narrator.prepare(text);
    const duration = narration.getDuration();

    // Start narration and advanced subtitles simultaneously
    yield* all(
      narration.play({
        ...options
      }),
      this.displayAdvancedSubtitle(text, duration)
    );
  }

  private *displayAdvancedSubtitle(text: string, duration: number): ThreadGenerator {
    const words = text.split(' ');
    const timePerWord = duration / words.length;

    // Clear previous subtitles
    this.subtitleContainer.removeChildren();

    // Show background
    yield* this.subtitleBackground.opacity(0.9, 0.3);

    // Create word components
    const wordComponents: Txt[] = [];
    let currentX = -(words.length * 25); // Approximate centering

    words.forEach((word, index) => {
      const wordTxt = new Txt({
        text: word,
        fontSize: 28,
        fontWeight: 500,
        fill: '#cccccc', // Start dimmed
        x: currentX,
        y: 0,
        opacity: 0
      });
      
      this.subtitleContainer.add(wordTxt);
      wordComponents.push(wordTxt);
      currentX += word.length * 15 + 20; // Approximate word spacing
    });

    // Animate words appearing and highlighting
    const wordAnimations = wordComponents.map((wordTxt, index) => {
      return function* (): ThreadGenerator {
        // Wait for word's turn
        yield* waitFor(index * timePerWord);
        
        // Fade in and highlight word
        yield* all(
          wordTxt.opacity(1, 0.2),
          wordTxt.fill('#ffffff', 0.2),
          wordTxt.scale(1.1, 0.1, easeInOutCubic),
          wordTxt.scale(1.0, 0.2, easeInOutCubic)
        );
        
        // Dim after a moment
        yield* waitFor(timePerWord * 0.8);
        yield* wordTxt.fill('#aaaaaa', 0.3);
      };
    });

    // Run all word animations concurrently
    yield* all(...wordAnimations.map(anim => anim()));

    // Hold final state briefly
    yield* waitFor(0.5);

    // Fade out all subtitles
    yield* all(
      this.subtitleBackground.opacity(0, 0.5),
      ...wordComponents.map(word => all(
        word.opacity(0, 0.5),
        word.scale(0.8, 0.5)
      ))
    );

    // Clean up
    this.subtitleContainer.removeChildren();
  }
}

export default makeScene2D(function* (view) {
  const narrator = createMockNarrator(
    { wordsPerMinute: 150 },
    { rate: 1.0, volume: 0.8 }
  );

  // Create components
  const circle = createRef<Circle>();
  const subtitleContainer = createRef<Node>();
  const subtitleBackground = createRef<Rect>();

  view.add(
    <>
      <Circle
        ref={circle}
        width={120}
        height={120}
        fill={'#4287f5'}
        y={-150}
      />
      
      {/* Subtitle area with background */}
      <Rect
        ref={subtitleBackground}
        width={800}
        height={80}
        fill={'rgba(0, 0, 0, 0.8)'}
        radius={10}
        y={250}
        opacity={0}
      />
      
      <Node 
        ref={subtitleContainer}
        y={250}
      />
    </>
  );

  // Create advanced subtitled narrator
  const advancedNarrator = new AdvancedSubtitledNarrator(
    narrator, 
    subtitleContainer(), 
    subtitleBackground()
  );

  // Example 1: Word-by-word highlighting
  yield* advancedNarrator.speak("Welcome to advanced subtitle highlighting with motion canvas!");
  
  yield* waitFor(1);

  // Example 2: Subtitles with complex animation
  yield* all(
    advancedNarrator.speak("Watch each word light up as the narrator speaks it aloud."),
    circle().rotation(360, 4),
    circle().scale(1.5, 2).to(1, 2)
  );

  yield* waitFor(1);

  // Example 3: Fast speech with word tracking
  yield* advancedNarrator.speak("Even with faster speech the subtitles keep perfect sync!", {
    playbackRate: 1.5
  });

  // Final fade out
  yield* all(
    circle().opacity(0, 1),
    subtitleBackground().opacity(0, 1)
  );
});