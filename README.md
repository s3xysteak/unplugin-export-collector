# :tada: export-collector

English | [简体中文](./README-zh.md)

ESM export collector.

## :rocket: Feature

Collect all export from a esm file.
Based on `NodeJS` and `swc`, you may want to use it in `scripts` or hooks in module bundler.

## :wrench: Usage

Consumed in `src/index.ts` is:

```js
// src/index.ts
export const one = 1
export const getThree = () => 3

export * from './func1' // export from another file.
export * from 'vue' // reExport from deps will be ignored.
```

in `src/func1.ts` is:

```js
// src/func1.ts
function func1() {}
function funcRe() {}

export { func1, funcRe as fRe }
```

The result will be :

```js
import { expCollector } from 'export-collector'

const val = await expCollector('./src') // base on root as default.

console.log(val)
// ['one', 'getThree', 'func1', 'fRe']
```

Or customize the base path.

```js
// ...
const val = await expCollector(
  './index.ts',
  fileURLToPath(new URL('./src/', import.meta.url))
)
// the value will be same as above example.
```
