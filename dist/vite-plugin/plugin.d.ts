import { Plugin } from 'vite';
export interface MotionCanvasNarratorPluginOptions {
    audioPath?: string;
    maxFileSize?: number;
    allowedMimeTypes?: string[];
}
export declare function motionCanvasNarratorPlugin(options?: MotionCanvasNarratorPluginOptions): Plugin;
//# sourceMappingURL=plugin.d.ts.map