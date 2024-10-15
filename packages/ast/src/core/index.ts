import { promises as fs } from 'node:fs'
import process from 'node:process'
import { extname, resolve } from 'pathe'
import type { ExpGeneratorDataOptions, ExpGeneratorOptions } from './types'

import { expCollector } from './parser'
import { getPkg } from './utils'
import { COMMENT, importsTemplate, resolversTemplate } from '~shared/template'

/**
 * Entry
 */
export async function expGenerator(path: string, options: Partial<ExpGeneratorOptions> = {}) {
  const {
    data,
    pkgContext: { isTs },
  } = await expGeneratorData(path, options)

  const {
    type,
    cwd,

    typescript = isTs,
    writeTo = `./src/${type}.${typescript ? 'ts' : 'js'}`,
  } = resolveOptions(options)

  return await fs.writeFile(
    resolve(cwd, extname(writeTo) ? writeTo : `${writeTo}.${typescript ? 'ts' : 'js'}`),
    data,
  )
}

export async function expGeneratorData(path: string, options: Partial<ExpGeneratorDataOptions> = {}) {
  const { raw: pkg, isTs } = await getPkg()

  const {
    cwd,
    include,
    exclude,
    rename,
    exportDefault,
    alias,
    type,

    typescript = isTs,
    pkgName = pkg.name,
  } = resolveOptions(options)

  exclude.push(rename)

  const expList = await expCollector(path, { cwd, alias })

  const exportList = [...expList, ...include].filter(i => !exclude.includes(i)).sort()

  const val = type === 'imports'
    ? importsTemplate(exportList, pkgName, rename, exportDefault)[typescript ? 'ts' : 'js']
    : resolversTemplate(exportList, pkgName, rename, exportDefault)[typescript ? 'ts' : 'js']

  const data = `
${COMMENT}

${val.trim()}

${COMMENT}
`.trim()

  return {
    data: `${data}\n`,
    pkgContext: {
      pkg,
      isTs,
    },
  }
}

function resolveOptions(options: Partial<ExpGeneratorOptions> = {}) {
  const {
    type = 'imports',
    cwd = process.cwd(),
    include = [],
    exclude = [],
    rename = 'autoImport',
    exportDefault = true,
    alias,
    ...rest
  } = options

  return {
    type,
    cwd,
    include,
    exclude,
    rename,
    exportDefault,
    alias,
    ...rest,
  }
}
