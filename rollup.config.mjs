import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'es',
            sourcemap: true,
            inlineDynamicImports: true,
        },
        external: [
            '@motion-canvas/core', 
            '@motion-canvas/2d'
        ],
        plugins: [
            resolve({
                preferBuiltins: false,
                browser: true,
                exportConditions: ['import', 'module', 'default']
            }), 
            json(), 
            commonjs(), 
            typescript({
                compilerOptions: {
                    experimentalDecorators: true,
                    emitDecoratorMetadata: false,
                    useDefineForClassFields: false
                }
            })
        ],
    },
    {
        input: 'src/vite-plugin/plugin.ts',
        output: {
            file: 'dist/vite-plugin.js',
            format: 'es',
            sourcemap: true,
        },
        external: [
            'fs',
            'path',
            'vite'
        ],
        plugins: [
            resolve({
                preferBuiltins: false,
                browser: true,
                exportConditions: ['import', 'module', 'default']
            }), 
            json(), 
            commonjs(), 
            typescript({
                compilerOptions: {
                    experimentalDecorators: true,
                    emitDecoratorMetadata: false,
                    useDefineForClassFields: false
                }
            })
        ],
    },
];
