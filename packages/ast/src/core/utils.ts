import { existsSync, promises as fs } from 'node:fs'
import process from 'node:process'
import { isFunction, isUndefined } from '@s3xysteak/utils'
import { normalize, resolve } from 'pathe'

export async function isDirectory(path: string) {
  const stat = await fs.stat(path)
  return stat.isDirectory()
}

export async function findPath(rawPath: string, cwd?: string) {
  const _p = resolve(cwd ?? process.cwd(), rawPath)
  const p = !existsSync(_p)
    ? _p
    : await isDirectory(_p)
      ? resolve(_p, 'index')
      : _p

  const ext = findExtension(p, cwd)
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
export function findExtension(path: string, cwd: string = process.cwd()) {
  const p = resolve(cwd, path)
  const extensionList = ['', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']

  const ext = extensionList.find(ext => existsSync(p + ext))
  return ext
}

export function addExtension(path: string, cwd: string = process.cwd()) {
  return path + findExtension(path, cwd)
}

export function toValue<T>(val: T | ((...args: any) => T)) {
  return isFunction(val) ? val() : val
}
