import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import * as swc from '@swc/core'

function getPath(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

export function main(content: string) {
  swc.parse(content, {
    syntax: 'typescript',
    target: 'es2020',
  }).then((module) => {
    Console.log(module.body)
  })
}

main(readFileSync(getPath('./index.ts'), 'utf-8'))
