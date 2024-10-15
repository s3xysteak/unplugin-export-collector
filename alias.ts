import { fileURLToPath } from 'node:url'

function r(p: string) {
  return fileURLToPath(new URL(p, import.meta.url))
}

export default {
  '~shared': r('./packages/shared/src'),
}
