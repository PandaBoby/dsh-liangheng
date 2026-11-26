import { defineConfig } from 'tsdown'

// Declarations come from `tsc -b tsconfig.build.json` (lib/types), so the
// bundler only emits JavaScript. Both halves are ESM inside a `type: module`
// package, hence `fixedExtension: false` for plain .js output, and the CSS
// modules are injected into the client bundle so hosts load one file.
const shared = {
  outDir: 'lib',
  format: 'esm' as const,
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
  { ...shared, entry: { index: 'src/index.ts' } },
  { ...shared, entry: { client: 'src/client/index.ts' } },
])
