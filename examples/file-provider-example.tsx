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

  // Example 1: Basic FileProvider usage
  const fileNarrator = createFileNarrator({
    audioDirectory: './assets/audio' // Optional base directory
  });
});
