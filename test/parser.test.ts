import { resolve } from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parse, parser } from '@core/parser'

describe('parser', () => {
  const base = fileURLToPath(new URL('./', import.meta.url))

  it('parse', async () => {
    const content = await fs.readFile(resolve(base, './parserLab/index.ts'), 'utf-8')
    const res = await parse(content)

    expect(res.exp).toEqual(['one', 'two', 'getThree', 'funcIndex', 'ClassIndex'])
    expect(res.refer).toEqual(['./core/func1', './core/func2'])
  })

  it('parser', async () => {
    const target = ['one', 'two', 'getThree', 'funcIndex', 'ClassIndex', 'func1', 'func2', 'func3', 'fRe'].sort()

    const generate = (path: string) => parser(path, base).then(res => res.sort())

    expect(await generate('./parserLab')).toEqual(target)
  })
})
