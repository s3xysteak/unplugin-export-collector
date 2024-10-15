import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { findPath } from '../src/core/utils'

describe('utils-general', () => {
  const base = fileURLToPath(new URL('./', import.meta.url))

  it('findPath', async () => {
    const generate = (path: string) => findPath(path, base)
    const target = resolve(base, './parser-lab/index.js')

    expect(await generate('./parser-lab/index.ts')).toBe(resolve(base, './parser-lab/index.ts'))
    expect(await generate('./parser-lab/index')).toBe(target)
    expect(await generate('./parser-lab')).toBe(target)
  })
})
