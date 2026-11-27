import { defineConfig } from 'tsdown'

const pkgName = 'dsh-liangheng'

// Declarations come from `tsc -b tsconfig.build.json` (lib/types), so the
// bundler only emits JavaScript. `fixedExtension: false` keeps plain .js names
// for both halves; the host half is ESM, the browser half is not (see below).
const shared = {
  outDir: 'lib',
  fixedExtension: false,
  dts: false,
  clean: false,
  sourcemap: true,
  // The default scope name is `[hash]_[local]`, and lightningcss derives that
  // hash from the file path too — so the same source produced different class
  // names per checkout and `lib/client.js` could never be reproducible. Keying
  // it on content alone makes the build portable, which is what lets CI check
  // the committed output.
  css: { inject: true, modules: { generateScopedName: '[content-hash]_[local]' } },
  deps: { neverBundle: [/^@deepseek-ai\//, /^node:/, 'react', 'react-dom', 'react/jsx-runtime'] },
}

export default defineConfig([
  { ...shared, format: 'esm', entry: { index: 'src/index.ts' } },
  {
    ...shared,
    format: 'cjs',
    // `fixedExtension` still renames CJS output to `.cjs`; the host serves the
    // bundle at the `./client` export path, so the name has to stay `client.js`.
    outExtensions: () => ({ js: '.js' }),
    entry: { client: 'src/client/index.ts' },
    // The browser half is not an ES module: the Web shell loads plugin bundles
    // as a classic <script> that must call `__ModuleLoader__.load({id, factory})`
    // exactly once, and every side effect has to wait inside that factory until
    // the module system materializes it. A bare ESM bundle parses to a syntax
    // error there and the plugin page reports `loaded without registering`.
    // The id is the package name the boot graph keys the row on; `require` is
    // the module system's resolver, so shared modules resolve from the shell's
    // platform table instead of being bundled.
    banner: `window.__ModuleLoader__.load({id:\`${pkgName}\`,factory:require=>{var module={exports:{}};var exports=module.exports;`,
    footer: 'return module.exports}});',
  },
])
