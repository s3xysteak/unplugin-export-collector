import { URL, fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { parseSync } from '@swc/core'
import { isUndefined } from '@s3xysteak/utils'

export function isDirectory(path: string) {
  return statSync(path).isDirectory()
}

export function solvePath(rawPath: string, base?: string) {
  const _p = join(base ?? fileURLToPath(new URL('./', import.meta.url)), rawPath)
  const p = existsSync(_p)
    ? isDirectory(_p)
      ? join(_p, 'index')
      : _p
    : _p

  const extensionList = ['', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']

  const ext = extensionList.find(ext => existsSync(p + ext))
  if (isUndefined(ext))
    throw new Error(`File not found: ${p}`)

  return p + ext
}

export function parser(path: string, base?: string): string[] {
  const result: string[] = []

  const recursion = (path: string, base?: string) => {
    const filePath = solvePath(path, base)

    const module = parseSync(readFileSync(filePath, 'utf-8'), {
      syntax: 'typescript',
      target: 'es2020',
    })

    module.body.forEach((node) => {
      if (node.type === 'ExportAllDeclaration')
        recursion(node.source.value, dirname(filePath))

      if (node.type === 'ExportNamedDeclaration') {
        node.specifiers.forEach((specifier) => {
          if (specifier.type === 'ExportSpecifier')
            result.push(specifier?.exported?.value ?? specifier.orig.value)
          if (specifier.type === 'ExportNamespaceSpecifier')
            recursion(specifier.name.value, dirname(filePath))
        })
      }

      if (node.type === 'ExportDeclaration') {
        node.declaration.type === 'VariableDeclaration' && node.declaration.declarations.forEach((declaration) => {
          declaration.id.type === 'Identifier' && result.push(declaration.id.value)
        })

        node.declaration.type === 'FunctionDeclaration' && result.push(node.declaration.identifier.value)
        node.declaration.type === 'ClassDeclaration' && result.push(node.declaration.identifier.value)
      }
    })
  }

  recursion(path, base)

  return result
}
