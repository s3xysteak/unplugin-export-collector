import process from 'node:process'
import type { Awaitable, Callable } from '@s3xysteak/utils'
import { resolve } from 'pathe'
import { createUnplugin } from 'unplugin'
import type { UnpluginFactoryOptions } from './types'
import { addExtension, toValue } from './utils'
import { expGenerator } from '.'

export default createUnplugin<Callable<Awaitable<Partial<UnpluginFactoryOptions>>> | undefined>((options = {}) => {
  return {
    name: 'unplugin-auto-import-generator',
    async buildStart() {
      options = await toValue(options)

      const {
        entries = ['./src/index'],
        cwd = process.cwd(),
      } = options

      const _entries = entries
        .map(path => addExtension(path, cwd))
        .map(entry => resolve(cwd, entry))

      for (const entry of _entries)
        await expGenerator(entry, options)
    },
  }
})
