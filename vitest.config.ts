import { defineConfig } from 'vitest/config'
import alias from './alias'

export default defineConfig({
  test: {
    environment: 'node',
    alias,
    typecheck: {
      enabled: true,
    },
  },
})
