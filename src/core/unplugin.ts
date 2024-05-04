import process from 'node:process'
import { createUnplugin } from 'unplugin'
import { resolve } from 'pathe'
import { type Awaitable, type Callable, toPromise } from '@s3xysteak/utils'
import { addExtension } from './utils'
import { type ExpGeneratorOptions, expGenerator } from './generator'

export interface UnpluginFactoryOptions extends ExpGeneratorOptions {
  /**
   * The list of entry files to generate the auto import.
   * @default ['./src/index']
   */
  entries: string[]
}

export default createUnplugin<Callable<Awaitable<Partial<UnpluginFactoryOptions>>> | undefined>((options = {}) => {
  return {
    name: 'unplugin-auto-import-generator',
    async buildStart() {
      options = await toPromise(options)

      const {
        entries = ['./src/index'],
        base = process.cwd(),
      } = options

      const _entries = entries
        .map(path => addExtension(path, base))
        .map(entry => resolve(base, entry))

      for (const entry of _entries)
        await expGenerator(entry, options)
    },
  }
})
