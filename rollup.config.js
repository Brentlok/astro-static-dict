import typescript from '@rollup/plugin-typescript'

export default [
    {
        input: 'index.ts',
        output: {
          file: 'dist/index.js',
          format: 'esm',
        },
        plugins: [typescript({
          declaration: true,
          declarationDir: 'dist',
          exclude: './after_build.ts'
        })],
    },
    {
        input: 'client/index.ts',
        output: {
          file: 'dist/client/index.js',
          format: 'esm',
        },
        plugins: [typescript()],
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
        plugins: [typescript()],
    },
]