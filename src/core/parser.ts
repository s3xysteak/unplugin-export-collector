import { dirname } from 'node:path'
import { promises as fs } from 'node:fs'
import { parse as swcParse } from '@swc/core'
import { p } from '@s3xysteak/utils'

import { solvePath } from '@utils/general'

export interface ParseValue {
  exp: string[]
  refer: string[]
}

export async function parser(content: string): Promise<ParseValue> {
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

export async function expCollector(path: string, base?: string): Promise<string[]> {
  const result: string[] = []

  const recursion = async (path: string, base?: string) => {
    const filePath = solvePath(path, base)
    const content = await fs.readFile(filePath, 'utf-8')

    const { exp, refer } = await parser(content)
    result.push(...exp)
    await p(refer, { concurrency: Number.POSITIVE_INFINITY })
      .forEach(async path => await recursion(path, dirname(filePath)))
  }

  await recursion(path, base)

  return result
}
