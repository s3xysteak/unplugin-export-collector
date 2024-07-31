import process from 'node:process'
import { promises as fs } from 'node:fs'
import { extname, resolve } from 'pathe'
import { expCollector } from './parser'
import { getPkg } from './utils'

import { COMMENT, importsTemplate, resolversTemplate } from './template'

interface ExpGeneratorDataOptions {
  /**
   * The base path of the project.
   * @default process.cwd()
   */
  base: string

  /**
   * The package name of the project. The default value is the name of the `package.json`.
   * @default pkg.name
   */
  pkgName: string

  /**
   * The list of exports to include.
   * @default []
   */
  include: string[]

  /**
   * The list of exports to exclude.
   * @default []
   */
  exclude: string[]

  /**
   * The name of the export function.
   * @default 'autoImport'
   */
  rename: string

  /**
   * Whether to use TypeScript. The default value will be auto detected by `package.json`.
   * @default isTs
   */
  typescript: boolean

  /**
   * Whether to export the function as default.
   * @default true
   */
  exportDefault: boolean

  alias: Record<string, string>

  /**
   * unplugin-auto-import options
   * @default 'imports'
   */
  type: 'imports' | 'resolvers'
}

export interface ExpGeneratorOptions extends ExpGeneratorDataOptions {
  /**
   * The path to write the generated file. The default value will be automatically resolved by the plugin.
   *
   * @example
   * Values below are possible values by default
   * './src/imports.ts'
   * './src/imports.js'
   * './src/resolvers.ts'
   * './src/resolvers.js'
   */
  writeTo: string
}
/**
 * Entry
 */
export async function expGenerator(path: string, options: Partial<ExpGeneratorOptions> = {}) {
  const {
    data,
    pkgContext: { isTs },
  } = await expGeneratorData(path, options)

  const {
    type = 'imports',
    typescript = isTs,
    base = process.cwd(),
    writeTo = `./src/${type}.${typescript ? 'ts' : 'js'}`,
  } = options

  return await fs.writeFile(
    resolve(base, extname(writeTo) ? writeTo : `${writeTo}.${typescript ? 'ts' : 'js'}`),
    data,
  )
}

export async function expGeneratorData(path: string, options?: Partial<ExpGeneratorDataOptions>) {
  const { raw: pkg, isTs } = await getPkg()

  const {
    base = process.cwd(),
    pkgName = pkg.name,
    include = [],
    exclude = [],
    rename = 'autoImport',
    typescript = isTs,
    exportDefault = true,
    alias,
    type = 'imports',
  } = options ?? {}

  exclude.push(rename)

  const expList = await expCollector(path, { base, alias })

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
