import { URL, fileURLToPath } from 'node:url'
import { resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { findPath } from '../src/core/utils'

describe('utils-general', () => {
  const cwd = fileURLToPath(new URL('./', import.meta.url))

  it('findPath', async () => {
    const generate = (path: string) => findPath(path, cwd)
    const target = resolve(cwd, './parser-lab/index.js')

    expect(await generate('./parser-lab/index.ts')).toBe(resolve(cwd, './parser-lab/index.ts'))
    expect(await generate('./parser-lab/index')).toBe(target)
    expect(await generate('./parser-lab')).toBe(target)
  })
})
