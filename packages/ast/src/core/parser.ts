import { promises as fs } from 'node:fs'
import process from 'node:process'
import { p } from '@s3xysteak/utils'
import { parse as swcParse } from '@swc/core'
import { dirname } from 'pathe'

import { resolveAlias } from './alias'
import { findPath, getPkg } from './utils'

interface ExpCollectorOptions {
  cwd?: string
  alias?: Record<string, string>
}

export async function expCollector(path: string, options?: ExpCollectorOptions): Promise<string[]> {
  const {
    cwd,
    alias = {},
  } = options ?? {}

  const result = new Set<string>()

  const recursion = async (path: string, cwd?: string) => {
    const filePath = await findPath(path, cwd)
    const content = await fs.readFile(filePath, 'utf-8')

    const { exp, refer } = await parser(content)

    exp.forEach(val => result.add(val))

    await p(refer, { concurrency: Number.POSITIVE_INFINITY })
      .forEach(async path => await recursion(resolveAlias(path, alias), dirname(filePath)))
  }

  await recursion(path, cwd ?? process.cwd())

  return Array.from(result)
}

export interface ParseValue {
  exp: string[]
  refer: string[]
}
export async function parser(content: string): Promise<ParseValue> {
  const exp: string[] = []
  const refer: string[] = []

  const { raw: pkg, isTs } = await getPkg()

  const module = await swcParse(content, {
    syntax: isTs ? 'typescript' : 'ecmascript',
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
      if (node.declaration.type === 'VariableDeclaration') {
        node.declaration.declarations.forEach(declaration =>
          declaration.id.type === 'Identifier' && exp.push(declaration.id.value),
        )
      }

      if (node.declaration.type === 'FunctionDeclaration')
        exp.push(node.declaration.identifier.value)
      if (node.declaration.type === 'ClassDeclaration')
        exp.push(node.declaration.identifier.value)
    }
  })

  const deps = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]
  return {
    exp,
    refer: refer.filter(path => !deps.includes(path)),
  }
}
