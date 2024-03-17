import process from 'node:process'
import { URL, fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { existsSync, promises as fs } from 'node:fs'
import { isUndefined } from '@s3xysteak/utils'

export async function isDirectory(path: string) {
  const stat = await fs.stat(path)
  return stat.isDirectory()
}

export async function solvePath(rawPath: string, base?: string) {
  const _p = join(base ?? fileURLToPath(new URL('./', import.meta.url)), rawPath)
  const p = !existsSync(_p)
    ? _p
    : await isDirectory(_p)
      ? join(_p, 'index')
      : _p

  const extensionList = ['', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']

  const ext = extensionList.find(ext => existsSync(p + ext))
  if (isUndefined(ext))
    throw new Error(`File not found: ${p}`)

  return p + ext
}

export async function getPkg() {
  const pkgPath = join(process.cwd(), './package.json')
  const pkg = await fs.readFile(pkgPath, 'utf-8').then(val => JSON.parse(val))
  return pkg
}
