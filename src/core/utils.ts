import process from 'node:process'
import { existsSync, promises as fs } from 'node:fs'
import { isFunction, isUndefined } from '@s3xysteak/utils'
import { normalize, resolve } from 'pathe'

export async function isDirectory(path: string) {
  const stat = await fs.stat(path)
  return stat.isDirectory()
}

export async function findPath(rawPath: string, base?: string) {
  const _p = resolve(base ?? process.cwd(), rawPath)
  const p = !existsSync(_p)
    ? _p
    : await isDirectory(_p)
      ? resolve(_p, 'index')
      : _p

  const ext = findExtension(p, base)
  if (isUndefined(ext))
    throw new Error(`File not found: ${p}`)

  return p + ext
}

export async function getPkg(path?: string) {
  const pkgPath = path ? normalize(path) : resolve(process.cwd(), './package.json')
  const pkg = await fs.readFile(pkgPath, 'utf-8').then(val => JSON.parse(val))

  const isTs = !!(pkg?.devDependencies?.typescript || pkg?.dependencies?.typescript)

  return {
    raw: pkg,
    isTs,
  }
}

/** return extension with `.` */
export function findExtension(path: string, base: string = process.cwd()) {
  const p = resolve(base, path)
  const extensionList = ['', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']

  const ext = extensionList.find(ext => existsSync(p + ext))
  return ext
}

export function addExtension(path: string, base: string = process.cwd()) {
  return path + findExtension(path, base)
}

export function toValue<T>(val: T | ((...args: any) => T)) {
  return isFunction(val) ? val() : val
}
