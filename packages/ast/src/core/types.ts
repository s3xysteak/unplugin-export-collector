export interface ExpGeneratorDataOptions {
  /**
   * The base path of the project.
   * @default process.cwd()
   */
  cwd: string

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

export interface UnpluginFactoryOptions extends ExpGeneratorOptions {
  /**
   * The list of entry files to generate the auto import.
   * @default ['./src/index']
   */
  entries: string[]
}
