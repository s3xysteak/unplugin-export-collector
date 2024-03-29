import { defineConfig } from 'vite'

import ExportCollector from '../../../src/vite'

export default defineConfig({
  plugins: [
    ExportCollector(),
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
