import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [
    {
        input: 'client/index.ts',
        output: {
          file: 'dist/client/index.js',
          format: 'esm',
        },
        plugins: [typescript({
            declaration: true,
            declarationDir: 'dist',
            exclude: './after_build.ts'
        })],
    },
    {
        input: 'server/index.ts',
        output: {
          file: 'dist/server/index.js',
          format: 'esm',
        },
        plugins: [typescript()],
    },
    {
        input: 'integration/index.ts',
        output: {
          file: 'dist/integration/index.js',
          format: 'esm',
        },
        plugins: [typescript(), nodeResolve(), commonjs()],
    },
]