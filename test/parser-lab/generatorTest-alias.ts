// --- Auto-Generated By Unplugin-Export-Collector ---

const __UnExportList = ["ClassIndex","custom","fRe","func1","func2","func3","funcIndex","getThree","two"] as const

/**
 * @returns Call in `imports` option of `unplugin-auto-import`.
 */
export default function autoImport(map?: Partial<{ [K in typeof __UnExportList[number]]: string }>): Record<string, (string | [string, string])[]> {
  return {
    'unplugin-export-collector': __UnExportList.map(v => map && map[v] ? [v, map[v]] as [string, string] : v),
  }
}

// --- Auto-Generated By Unplugin-Export-Collector ---
