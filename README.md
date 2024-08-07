# :tada: unplugin-export-collector

English | [简体中文](./README-zh.md)

ESM export collector with out-of-the-box support `unplugin-auto-import`.

## :hammer: Install

```sh
$ pnpm i -D unplugin-export-collector
```

## :rocket: Feature

Recursively collect all named exports from an ESM file.

Consumed in `src/index.ts` is:

```js
// src/index.ts
export const one = 1
export * from './func1' // export from another file.
// export * from '~/func2' // Also support aliases.
export * from 'vue' // reExport from deps will be ignored.
```

in `src/func1.ts` is:

```js
// src/func1.ts
function func1() {}
export { func1 as funcRe }
```

Just get named export list:

```js
import { expCollector } from 'unplugin-export-collector/core'

console.log(await expCollector('./src/index.ts'))
// ['one', 'funcRe']
```

Or support `unplugin-auto-import`. You can read the total document below, here we take Vite as an example:

```js
import ExportCollector from 'unplugin-export-collector/vite'

export default defineConfig({
  plugins: [
    ExportCollector({ /* options */ }),
  ],
})
```

It will generate a file at `./src/imports.js` in default while bundling, you can export it and use it in project like that:

```ts
import { defineConfig } from 'vite'
import Imports from 'my-project/imports' // You need to handle the export files manually when bundling

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

Also support `resolvers`, just need to configure the option `type: 'resolvers'`:

```js
ExportCollector({
  type: 'resolvers'
})
```

Use in project:

```ts
import { defineConfig } from 'vite'
import Resolvers from 'my-project/resolvers'

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

## :wrench: Usage

> More details see the unit test in `test` folder, and the examples in `test/unplugin-lab`.

### Generate autoImport function

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

### Options:

Please move to the [type declaration](./src/core/types.ts), all options are well commented.

### Just get export list

Use like :

```js
import { expCollector } from 'unplugin-export-collector/core'

const val = await expCollector('./src/index.ts') // base on root as default.

console.log(val)
// ['one', 'funcRe']
```

Or customize the base path.

```js
// ...
const val = await expCollector(
  './index.ts',
  {
    base: fileURLToPath(new URL('./src/index.ts', import.meta.url))
    // alias: { '~': fileURLToPath(new URL('.', import.meta.url)) } // Also support aliases.
  }
)
// the value will be same as above example.
```

The `core` exports a series of methods, briefly described as follows:

- `expGenerator`: Reads a file, generates the `autoImport` method, and writes it.
- `expGeneratorData`: Reads a file but does not write, returns the string of the `autoImport` method.
- `expCollector`: Reads a file, returns an array of named exports.
- `parser`: Reads a string, returns an array of named exports at one level and an array of re-export paths.
