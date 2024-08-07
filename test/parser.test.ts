import { URL, fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs'
import { resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { expCollector, parser } from '@core/parser'

describe('parser', () => {
  it('parser', async () => {
    const content = await fs.readFile(
      resolve(
        fileURLToPath(new URL('./', import.meta.url)),
        './parser-lab/index.ts',
      ),
      'utf-8',
    )
    const res = await parser(content)

    expect(res.exp).toEqual(['one', 'two', 'getThree', 'funcIndex', 'ClassIndex'])
    expect(res.refer).toEqual(['./core/func1', './core/func2'])
  })

  it('expCollector', async () => {
    const target = ['one', 'two', 'getThree', 'funcIndex', 'ClassIndex', 'func1', 'func2', 'func3', 'fRe'].sort()

    const result = await expCollector('./test/parser-lab').then(res => res.sort())
    expect(result).toEqual(target)
  })
})
