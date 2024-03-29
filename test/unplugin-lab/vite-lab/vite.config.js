import { defineConfig } from 'vite'

import ExportCollector from '../../../src/vite'

export default defineConfig({
  plugins: [
    ExportCollector({
      entries: ['./src/index.js'],
    }),
  ],
  build: {
    lib: {
      format: ['es'],
      entry: './src/index.js',
      name: 'viteLab',
      fileName: 'index',
    },
  },
})
