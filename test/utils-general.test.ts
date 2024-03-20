import { URL, fileURLToPath } from 'node:url'
import { resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { findPath } from '@/core/utils'

describe('utils-general', () => {
  const base = fileURLToPath(new URL('./', import.meta.url))

  it('findPath', async () => {
    const generate = (path: string) => findPath(path, base)
    const target = resolve(base, './parserLab/index.ts')

    expect(await generate('./parserLab/index.ts')).toBe(target)
    expect(await generate('./parserLab/index')).toBe(target)
    expect(await generate('./parserLab')).toBe(target)
  })
})
