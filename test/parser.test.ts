import { join } from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parser, solvePath } from '@/core/parser'

describe('parser', () => {
  const base = fileURLToPath(new URL('./', import.meta.url))

  it('solvePath', () => {
    const generate = (path: string) => solvePath(path, base)
    const target = join(base, './parserLab/index.ts')

    expect(generate('./parserLab/index.ts')).toBe(target)
    expect(generate('./parserLab/index')).toBe(target)
    expect(generate('./parserLab')).toBe(target)
  })

  it('parser', () => {
    const target = ['one', 'two', 'getThree', 'funcIndex', 'ClassIndex', 'func1', 'func2', 'func3', 'fRe'].sort()

    const generate = (path: string) => parser(path, base).sort()

    expect(generate('./parserLab/index.ts')).toEqual(target)
    expect(generate('./parserLab/index')).toEqual(target)
    expect(generate('./parserLab')).toEqual(target)
  })
})
