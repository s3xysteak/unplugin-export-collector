import { URL, fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { existsSync, statSync } from 'node:fs'
import { isUndefined } from '@s3xysteak/utils'

export function isDirectory(path: string) {
  return statSync(path).isDirectory()
}

export function solvePath(rawPath: string, base?: string) {
  const _p = resolve(base ?? fileURLToPath(new URL('./', import.meta.url)), rawPath)
  const p = existsSync(_p)
    ? isDirectory(_p)
      ? resolve(_p, 'index')
      : _p
    : _p

  const extensionList = ['', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']

  const ext = extensionList.find(ext => existsSync(p + ext))
  if (isUndefined(ext))
    throw new Error(`File not found: ${p}`)

  return p + ext
}
