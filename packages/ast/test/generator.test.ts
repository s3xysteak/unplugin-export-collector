import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'
import { describe, expect, it } from 'vitest'
import { expGenerator } from '../src/core'

const cwd = fileURLToPath(new URL('.', import.meta.url))

describe('generate', () => {
  /** TS */
  it('expGenerator should work with TS', async () => {
    await expGenerator('./parser-lab/index.ts', {
      cwd,
      include: ['custom'],
      exclude: ['one'],
      writeTo: './parser-lab/generatorTest.ts',
    })
    const result = await fs.readFile(resolve(cwd, './parser-lab/generatorTest.ts'), 'utf-8')
    expect(result).toMatchFileSnapshot('./__snapshots__/1.ts')
  })

  /** JS */
  it('expGenerator should work with JS', async () => {
    await expGenerator('./parser-lab/index.js', {
      cwd,
      include: ['custom'],
      exclude: ['one'],
      typescript: false,
      writeTo: './parser-lab/generatorTest.js',
    })
    const result = await fs.readFile(resolve(cwd, './parser-lab/generatorTest.js'), 'utf-8')
    expect(result).toMatchFileSnapshot('./__snapshots__/2.js')
  })

  /** resolvers */
  it('should work with ts resolvers', async () => {
    await expGenerator('./parser-lab/index.ts', {
      cwd,
      include: ['custom'],
      exclude: ['one'],
      type: 'resolvers',
      writeTo: './parser-lab/generatorTest-resolvers.ts',
    })

    const result = await fs.readFile(resolve(cwd, './parser-lab/generatorTest-resolvers.ts'), 'utf-8')

    expect(result).toMatchFileSnapshot('./__snapshots__/3.ts')
  })

  it('should work with js resolvers', async () => {
    await expGenerator('./parser-lab/index.js', {
      cwd,
      include: ['custom'],
      exclude: ['one'],
      typescript: false,
      type: 'resolvers',
      writeTo: './parser-lab/generatorTest-resolvers.js',
    })

    const result = await fs.readFile(resolve(cwd, './parser-lab/generatorTest-resolvers.js'), 'utf-8')

    expect(result).toMatchFileSnapshot('./__snapshots__/4.js')
  })

  /** aliases */
  it('expGenerator should work with aliases', async () => {
    await expGenerator('./parser-lab/index-alias.ts', {
      cwd,
      include: ['custom'],
      exclude: ['one'],
      alias: {
        '~test': fileURLToPath(new URL('.', import.meta.url)),
      },
      writeTo: './parser-lab/generatorTest-alias.ts',
    })

    const result = await fs.readFile(resolve(cwd, './parser-lab/generatorTest-alias.ts'), 'utf-8')

    expect(result).toMatchFileSnapshot('./__snapshots__/5.ts')
  })
})
