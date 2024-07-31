import process from 'node:process'
import { promises as fs } from 'node:fs'
import { isUndefined } from '@s3xysteak/utils'
import { extname, resolve } from 'pathe'
import { expCollector } from './parser'
import { findPath, getPkg } from './utils'

import { COMMENT, generateTemplate, importsTemplate, resolversTemplate } from './template'

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
   * @default false
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
   * The path to write the generated file. The default value is the path of the entry file.
   */
  writeTo: string
}
/**
 * Entry
 */
export async function expGenerator(path: string, options: Partial<ExpGeneratorOptions> = {}) {
  const {
    data,
    dataRaw,
    targetPath,
    pkgContext: { isTs },
  } = await expGeneratorData(path, options)

  const {
    base = process.cwd(),
  } = options

  return isUndefined(options?.writeTo)
    ? await fs.writeFile(targetPath, data)
    : await fs.writeFile(
      resolve(base, extname(options.writeTo) || `${options.writeTo}.${isTs ? 'ts' : 'js'}`),
      dataRaw,
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
    exportDefault = false,
    alias,
    type = 'imports',
  } = options ?? {}

  exclude.push(rename)

  const targetPath = await findPath(path, base)

  const expList = await expCollector(path, { base, alias })
  const content = await fs.readFile(targetPath, 'utf-8')

  const exportList = [...expList, ...include].filter(i => !exclude.includes(i)).sort()

  const valRaw = type === 'imports'
    ? importsTemplate(exportList, pkgName, rename, exportDefault)[typescript ? 'ts' : 'js']
    : resolversTemplate(exportList, pkgName, rename, exportDefault)[typescript ? 'ts' : 'js']

  const val = generateTemplate(content, valRaw).trim()
  const dataRaw = `
${COMMENT}

${valRaw.trim()}

${COMMENT}
`.trim()

  return {
    data: `${val}\n`,
    dataRaw: `${dataRaw}\n`,
    targetPath,
    pkgContext: {
      pkg,
      isTs,
    },
  }
}
