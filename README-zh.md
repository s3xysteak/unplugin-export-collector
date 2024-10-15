# :tada: unplugin-export-collector

[English](./README.md) | 简体中文

收集ESM所有导出的工具，附带开箱即用的 `unplugin-auto-import` 支持。

## :hammer: Install

```sh
$ pnpm i -D unplugin-export-collector
```

## :rocket: 功能

从一个ESM文件中递归的收集所有具名导出。

假设有 `src/index.ts` :

```js
// src/index.ts
export const one = 1
export * from './func1' // 从另一个文件导出。
// export * from '~/func2' // 也支持别名
export * from 'vue' // 依赖的重导出将会被忽略。
```

还有 `src/func1.ts` :

```js
// src/func1.ts
function func1() {}
export { func1 as funcRe }
```

只是获取所有具名导出:

```js
import { expCollector } from 'unplugin-export-collector/core'

console.log(await expCollector('./src/index.ts'))
// ['one', 'funcRe']
```

或者支持 `unplugin-auto-import`，你可以在下面看到完整说明，这里以Vite为例：

```js
import ExportCollector from 'unplugin-export-collector/vite'

export default defineConfig({
  plugins: [
    ExportCollector({ /* options */ }),
  ],
})
```

这会在打包时默认在`./src/imports.js`生成一个文件，你可以将其导出后像这样在项目中使用：

```ts
import Imports from 'my-project/imports'
import { defineConfig } from 'vite' // 你需要自行处理打包时的导出项

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        Imports()
      ]
    }),
  ]
})
```

同样支持使用resolvers，只需要将选项设置为 `type: 'resolvers'`:

```js
ExportCollector({
  type: 'resolvers'
})
```

在项目中使用：

```ts
import Resolvers from 'my-project/resolvers'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [
        Resolvers()
      ]
    }),
  ]
})
```

## :wrench: 使用

> 更多细节见 `test` 文件夹中的单元测试，与 `test/unplugin-lab` 中的示例。

### 生成 autoImport 方法

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import ExportCollector from 'unplugin-export-collector/vite'

export default defineConfig({
  plugins: [
    ExportCollector({ /* options */ }),
  ],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import ExportCollector from 'unplugin-export-collector/rollup'

export default {
  plugins: [
    ExportCollector({ /* options */ }),
    // other plugins
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-export-collector/webpack').default({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import ExportCollector from 'unplugin-export-collector/esbuild'

build({
  /* ... */
  plugins: [
    ExportCollector({
      /* options */
    }),
  ],
})
```

<br></details>

### 选项:

请移步至[类型声明](./src/core/types.ts)，所有选项都带有详细的注释说明。

### 获取具名导出的名称数组

像这样使用 :

```js
import { expCollector } from 'unplugin-export-collector/core'

const val = await expCollector('./src') // 默认情况下基于项目根目录。

console.log(val)
// ['one', 'funcRe']
```

你也可以自定义base路径。

```js
// ...
const val = await expCollector(
  './index.ts',
  {
    cwd: fileURLToPath(new URL('./src/', import.meta.url))
    // alias: { '~': fileURLToPath(new URL('.', import.meta.url)) } // 也支持别名
  }
)
// 结果将会和上面的例子相同。
```

`core` 中暴露了一系列方法，这里只做简短的说明：

- `expGenerator` 读取文件，生成autoImport方法并写入
- `expGeneratorData` 读取文件但不写入，返回autoImport方法的字符串
- `expCollector` 读取文件，返回具名导出数组
- `parser` 读取字符串，返回一层的具名导出数组和重导出路径数组
