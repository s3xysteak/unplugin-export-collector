import { URL, fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { solvePath } from '@utils/general'

describe('utils-general', () => {
  const base = fileURLToPath(new URL('./', import.meta.url))

  it('solvePath', async () => {
    const generate = (path: string) => solvePath(path, base)
    const target = join(base, './parserLab/index.ts')

    expect(await generate('./parserLab/index.ts')).toBe(target)
    expect(await generate('./parserLab/index')).toBe(target)
    expect(await generate('./parserLab')).toBe(target)
  })
})
