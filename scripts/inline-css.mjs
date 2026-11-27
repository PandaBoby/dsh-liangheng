/**
 * Fold the extracted stylesheet into the client bundle's module factory.
 *
 * tsdown compiles `*.module.css` into a separate `lib/style.css` and leaves a
 * bare `import './style.css'` in the bundle. The Web shell loads a plugin
 * bundle as a classic <script> that only registers a factory, so that import is
 * a syntax error there, and the <style> tag must also appear when the module
 * system materializes the plugin — not when the script is parsed — because
 * style ownership is claimed during materialization. The CSS therefore goes
 * into the factory body, just before the closing `return module.exports`.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const NL = String.fromCharCode(10)
const cssPath = 'lib/style.css'
const clientPath = 'lib/client.js'
const FOOTER = 'return module.exports}});'
const SOURCE_MAP_TRAILER = /^\/\/# sourceMappingURL=.*$/m

if (!existsSync(cssPath) || !existsSync(clientPath)) {
  console.warn('[inline-css] no stylesheet emitted; nothing to inline')
  process.exit(0)
}

const css = readFileSync(cssPath, 'utf8')
const lines = readFileSync(clientPath, 'utf8').split(NL)
const head = lines[0] === undefined ? '' : lines[0]

if (!head.startsWith('import') || !head.includes('style.css')) {
  console.warn('[inline-css] the client chunk carries no stylesheet import; leaving it alone')
  process.exit(0)
}

lines.shift()
const source = lines.join(NL)
const at = source.lastIndexOf(FOOTER)
if (at < 0) {
  console.warn('[inline-css] the client bundle carries no module factory footer; leaving it alone')
  process.exit(0)
}

const injection = [
  '',
  '{',
  '  const css = ' + JSON.stringify(css),
  "  if (typeof document !== 'undefined') {",
  "    const style = document.createElement('style')",
  "    style.setAttribute('data-dsh-liangheng', '')",
  '    style.textContent = css',
  '    document.head.appendChild(style)',
  '  }',
  '}',
  '',
].join(NL)

writeFileSync(
  clientPath,
  (source.slice(0, at) + injection + source.slice(at)).replace(SOURCE_MAP_TRAILER, ''),
)
rmSync(cssPath)
// A source map that no longer describes the text is worse than none.
rmSync(clientPath + '.map', { force: true })
console.log('[inline-css] inlined ' + css.length + ' bytes of CSS into ' + clientPath)
