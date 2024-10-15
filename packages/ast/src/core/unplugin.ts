import process from 'node:process'
import { createUnplugin } from 'unplugin'
import { resolve } from 'pathe'
import type { Awaitable, Callable } from '@s3xysteak/utils'
import { addExtension, toValue } from './utils'
import type { UnpluginFactoryOptions } from './types'
import { expGenerator } from '.'

export default createUnplugin<Callable<Awaitable<Partial<UnpluginFactoryOptions>>> | undefined>((options = {}) => {
  return {
    name: 'unplugin-auto-import-generator',
    async buildStart() {
      options = await toValue(options)

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
