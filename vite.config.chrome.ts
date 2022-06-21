/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve as pathResolve } from 'path'

import { defineConfig } from 'vite'

const resolve = (path: string) => pathResolve(__dirname, path)

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        a: '/chromeExt/content.ts',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [],
  resolve: {
    dedupe: ['@types/react'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    resolveSnapshotPath: (testPath, snapExtension) => testPath + snapExtension,
  },
})
