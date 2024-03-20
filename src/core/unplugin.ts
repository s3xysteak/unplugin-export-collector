import process from 'node:process'
import { createUnplugin } from 'unplugin'
import { resolve } from 'pathe'
import { addExtension } from './utils'
import { type ExpGeneratorOptions, expGeneratorData } from './generator'

export interface UnpluginFactoryOptions extends ExpGeneratorOptions {
  entries: string[]
}

export default createUnplugin<Partial<UnpluginFactoryOptions>>((options = {}) => {
  const {
    entries = ['./src/index.ts'],
  } = options
  const _entries = entries.map(addExtension).map(entry => resolve(process.cwd(), entry))

  return {
    name: 'unplugin-auto-import-generator',
    transformInclude: id => _entries.includes(id),
    transform: async (_, id) => (await expGeneratorData(id, options)).data,
  }
})
