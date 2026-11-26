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
  css: { inject: true },
  deps: { neverBundle: [/^@deepseek-ai\//, /^node:/, 'react', 'react-dom', 'react/jsx-runtime'] },
}

export default defineConfig([
  { ...shared, entry: { index: 'src/index.ts' } },
  { ...shared, entry: { client: 'src/client/index.ts' } },
])
