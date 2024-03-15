import { dirname } from 'node:path'
import { readFileSync } from 'node:fs'
import { parse as swcParse, parseSync as swcParseSync } from '@swc/core'

import { solvePath } from '@utils/general'

export interface ParseValue {
  exp: string[]
  refer: string[]
}

export async function parse(content: string): Promise<ParseValue> {
  const exp: string[] = []
  const refer: string[] = []

  const module = await swcParse(content, {
    syntax: 'ecmascript',
    target: 'es2020',
  })

  module.body.forEach((node) => {
    if (node.type === 'ExportAllDeclaration')
      refer.push(node.source.value)

    if (node.type === 'ExportNamedDeclaration') {
      node.specifiers.forEach((specifier) => {
        if (specifier.type === 'ExportSpecifier')
          exp.push(specifier?.exported?.value ?? specifier.orig.value)
        if (specifier.type === 'ExportNamespaceSpecifier')
          refer.push(specifier.name.value)
      })
    }

    if (node.type === 'ExportDeclaration') {
      node.declaration.type === 'VariableDeclaration' && node.declaration.declarations.forEach((declaration) => {
        declaration.id.type === 'Identifier' && exp.push(declaration.id.value)
      })

      node.declaration.type === 'FunctionDeclaration' && exp.push(node.declaration.identifier.value)
      node.declaration.type === 'ClassDeclaration' && exp.push(node.declaration.identifier.value)
    }
  })

  return {
    exp,
    refer,
  }
}

export function parser(path: string, base?: string): string[] {
  const result: string[] = []

  const recursion = (path: string, base?: string) => {
    const filePath = solvePath(path, base)

    const module = swcParseSync(readFileSync(filePath, 'utf-8'), {
      syntax: 'ecmascript',
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
