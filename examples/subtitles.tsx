import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle, Txt, Node } from '@motion-canvas/2d/lib/components';
import { createRef } from '@motion-canvas/core/lib/utils';
import { all, waitFor } from '@motion-canvas/core/lib/flow';
import { ThreadGenerator } from '@motion-canvas/core/lib/threading';
import { createMockNarrator, Narrator, SpeakOptions } from '../src';

// Subtitle wrapper that displays text while narrator speaks
class SubtitledNarrator {
  private narrator: Narrator;
  private subtitleText: Txt;

  constructor(narrator: Narrator, subtitleText: Txt) {
    this.narrator = narrator;
    this.subtitleText = subtitleText;
  }

  public *speak(text: string, options: SpeakOptions = {}): ThreadGenerator {
    // Start narration and subtitle simultaneously
    yield* all(
      this.narrator.speak(text, options),
      this.displaySubtitle(text)
    );
  }

  private *displaySubtitle(text: string): ThreadGenerator {
    // Show subtitle with typing effect
    yield* this.subtitleText.text('', 0);
    yield* this.subtitleText.text(text, 0.5);
    
    // Keep subtitle visible during speech
    yield* waitFor(0.5); // Wait a bit after typing
    
    // Fade out subtitle
    yield* all(
      this.subtitleText.opacity(0, 0.3),
      this.subtitleText.scale(0.9, 0.3)
    );
    
    // Reset for next subtitle
    yield* this.subtitleText.opacity(1, 0);
    yield* this.subtitleText.scale(1, 0);
  }

  // Proxy other narrator methods
  public async prepare(text: string) {
    return await this.narrator.prepare(text);
  }
}

export default makeScene2D(function* (view) {
  const narrator = createMockNarrator(
    { wordsPerMinute: 120 },
    { rate: 1.0, volume: 0.8 }
  );

  // Create subtitle text component
  const subtitleText = createRef<Txt>();
  const circle = createRef<Circle>();
  const container = createRef<Node>();

  view.add(
    <Node ref={container}>
      <Circle
        ref={circle}
        width={140}
        height={140}
        fill={'#e13238'}
        y={-100}
      />
      
      {/* Subtitle area */}
      <Txt
        ref={subtitleText}
        fontSize={32}
        fontWeight={600}
        fill={'#ffffff'}
        textAlign={'center'}
        y={200}
        text={''}
        shadowColor={'rgba(0,0,0,0.8)'}
        shadowOffset={[2, 2]}
        shadowBlur={4}
      />
    </Node>
  );

  // Create subtitled narrator
  const subtitledNarrator = new SubtitledNarrator(narrator, subtitleText());

  // Example 1: Basic subtitled narration
  yield* subtitledNarrator.speak("Welcome to subtitled narration!");
  
  yield* waitFor(0.5);

  // Example 2: Subtitles with animation
  yield* all(
    subtitledNarrator.speak("Watch the circle move while reading subtitles."),
    circle().position.x(200, 3),
  );

  yield* waitFor(0.5);

  // Example 3: Fast speech with subtitles (helpful for readability)
  yield* subtitledNarrator.speak("This is spoken very quickly but you can still read it!", {
    playbackRate: 2.0
  });

  yield* waitFor(0.5);

  // Example 4: Multiple subtitle segments
  yield* subtitledNarrator.speak("First subtitle segment.");
  yield* subtitledNarrator.speak("Second subtitle segment with different timing.");
  yield* subtitledNarrator.speak("Third and final segment!");

  // Final animation
  yield* all(
    circle().scale(0, 1),
    subtitleText().text("The End", 0.5)
  );
});