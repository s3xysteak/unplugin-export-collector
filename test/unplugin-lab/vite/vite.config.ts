import { defineConfig } from 'vite'

import ExportCollector from '../../../src/vite'

export default defineConfig({
  plugins: [
    ExportCollector(async () => {
      return {
        include: ['hi'],
      }
    }) as any,
  ],
  build: {
    lib: {
      formats: ['es'],
      entry: './src/index.ts',
      fileName: 'index',
    },
  },
})
