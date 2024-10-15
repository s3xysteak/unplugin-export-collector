import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { resolve } from 'pathe'
import { collect } from '../src'

const cwd = fileURLToPath(new URL('.', import.meta.url))

describe('esm parser', () => {
  it('collect', async () => {
    expect(await collect(resolve(cwd, './fixture/TS.ts'))).toMatchSnapshot()
    expect(await collect(resolve(cwd, './fixture/JS.js'))).toMatchSnapshot()
  })
})
