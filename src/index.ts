import { readFileSync } from 'node:fs'
import { parseSync } from '@swc/core'

export function getPath(rawPath: string) {
  // TODO
  return rawPath
}

export function parser(path: string): string[] {
  const result: string[] = []

  const module = parseSync(readFileSync(getPath(path), 'utf-8'), {
    syntax: 'typescript',
    target: 'es2020',
  })

  module.body.forEach((node) => {
    if (node.type === 'ExportAllDeclaration')
      parser(node.source.value)

    if (node.type === 'ExportNamedDeclaration') {
      node.specifiers.forEach((specifier) => {
        if (specifier.type === 'ExportSpecifier')
          result.push(specifier.orig.value)
        if (specifier.type === 'ExportNamespaceSpecifier')
          parser(specifier.name.value)
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

  return result
}
