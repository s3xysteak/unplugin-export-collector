import process from 'node:process'
import { createUnplugin } from 'unplugin'
import { resolve } from 'pathe'
import { type Awaitable, type Callable, toPromise } from '@s3xysteak/utils'
import { addExtension } from './utils'
import { type ExpGeneratorOptions, expGenerator } from './generator'

export interface UnpluginFactoryOptions extends ExpGeneratorOptions {
  entries: string[]
}

export default createUnplugin<Callable<Awaitable<Partial<UnpluginFactoryOptions>>> | undefined>((options = {}) => {
  return {
    name: 'unplugin-auto-import-generator',
    async buildStart() {
      options = await toPromise(options)

      const {
        entries = ['./src/index.ts'],
      } = options

      const _entries = entries
        .map(addExtension)
        .map(entry => resolve(process.cwd(), entry))

      for (const entry of _entries)
        await expGenerator(entry, options)
    },
  }
})
