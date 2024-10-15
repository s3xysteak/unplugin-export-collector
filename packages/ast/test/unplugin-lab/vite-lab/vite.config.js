import { defineConfig } from 'vite'

import ExportCollector from '../../../src/vite'

export default defineConfig({
  plugins: [
    ExportCollector({ type: 'resolvers' }),
  ],
  build: {
    lib: {
      formats: ['es'],
      entry: ['./src/index.js', './src/imports.js', './src/resolvers.js'],
      fileName: (_, entryName) => `${entryName}.js`,
    },
  },
})
