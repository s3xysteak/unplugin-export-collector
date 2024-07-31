export const COMMENT = '// --- Auto-Generated By Unplugin-Export-Collector ---'

export function importsTemplate(exportList: string[], pkgName: string, rename: string, exportDefault: boolean) {
  return {
    // * typescript
    ts: `
const __UnExportList = ${JSON.stringify(exportList)} as const

/**
 * @returns Call in \`imports\` option of \`unplugin-auto-import\`.
 */
${exportDefault ? 'export default' : 'export'} function ${rename}(map?: Partial<{ [K in typeof __UnExportList[number]]: string }>): Record<string, (string | [string, string])[]> {
  return {
    '${pkgName}': __UnExportList.map(v => map && map[v] ? [v, map[v]] as [string, string] : v),
  }
}
`,

    // * javascript
    js: `
const __UnExportList = /** @type {const} */ (${JSON.stringify(exportList)})

/**
 * @param {Partial<{ [K in typeof __UnExportList[number]]: string }>} [map]
 * @returns {Record<string, (string | [string, string])[]>} Call in \`imports\` option of \`unplugin-auto-import\`.
 */
${exportDefault ? 'export default' : 'export'} function ${rename}(map) {
  return {
    '${pkgName}': __UnExportList.map(v => map && map[v] ? [v, map[v]] : v),
  }
}
`,
  }
}

export function resolversTemplate(exportList: string[], pkgName: string, rename: string, exportDefault: boolean) {
  return {
    // * typescript
    ts: `
const __UnExportList = ${JSON.stringify(exportList)} as const

/**
 * @returns Call in \`resolvers\` option of \`unplugin-auto-import\`.
 */
${exportDefault ? 'export default' : 'export'} function ${rename}(map?: Partial<{ [K in typeof __UnExportList[number]]: string }>) {
  return (name: string) => {
    if (!__UnExportList.includes(name as any))
      return

    return map && (map as any)[name]
      ? {
          name,
          as: (map as any)[name],
          from: '${pkgName}',
        }
      : {
          name,
          from: '${pkgName}',
        }
  }
}
`,

    // * javascript
    js: `
const __UnExportList = /** @type {const} */ (${JSON.stringify(exportList)})

/**
 * @param {Partial<{ [K in typeof __UnExportList[number]]: string }>} [map]
 * @returns Call in \`resolvers\` option of \`unplugin-auto-import\`.
 */
${exportDefault ? 'export default' : 'export'} function ${rename}(map) {
  /** @param {string} name */
  const func = (name) => {
    if (!__UnExportList.includes(name))
      return

    return map && map[name]
      ? {
          name,
          as: map[name],
          from: '${pkgName}',
        }
      : {
          name,
          from: '${pkgName}',
        }
  }
  return func
}
`,
  }
}
