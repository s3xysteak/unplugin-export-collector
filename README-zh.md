# :tada: export-collector

[English](./README.md) | 简体中文

收集ESM所有导出的工具。

## :rocket: 功能

收集一个ESM文件的所有导出。
基于 `NodeJS` and `swc`，所以你可能想在 `scripts` 或 打包器的钩子中使用。

## :wrench: 使用

假设有 `src/index.ts` :

```js
// src/index.ts
export const one = 1
export const getThree = () => 3

export * from './func1' // 从另一个文件导出。
export * from 'vue' // 依赖的重导出将会被忽略。
```

还有 `src/func1.ts` :

```js
// src/func1.ts
function func1() {}
function funcRe() {}

export { func1, funcRe as fRe }
```

结果将会是这样 :

```js
import { expCollector } from 'export-collector'

const val = await expCollector('./src') // 默认情况下基于项目根目录。

console.log(val)
// ['one', 'getThree', 'func1', 'fRe']
```

你也可以自定义base路径。

```js
// ...
const val = await expCollector(
  './index.ts',
  fileURLToPath(new URL('./src/', import.meta.url))
)
// 结果将会和上面的例子相同。
```
