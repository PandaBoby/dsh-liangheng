/**
 * Inline the compiled stylesheet into the client chunk.
 *
 * The host loads a plugin's browser half as a plain ES module, so an
 * `import './style.css'` inside it cannot resolve -- only a bundler understands
 * a CSS import. Upstream ships one self-contained client.js for the same
 * reason, so this step restores that shape after tsdown has compiled the CSS
 * modules: the class-name mapping is already inline, only the stylesheet text
 * is still a separate file.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const NL = String.fromCharCode(10)
const cssPath = 'lib/style.css'
const clientPath = 'lib/client.js'

if (!existsSync(cssPath) || !existsSync(clientPath)) {
  console.warn('[inline-css] no stylesheet emitted; nothing to inline')
  process.exit(0)
}

const css = readFileSync(cssPath, 'utf8')
const chunkLines = readFileSync(clientPath, 'utf8').split(NL)
const head = chunkLines[0] === undefined ? '' : chunkLines[0]

if (!head.startsWith('import') || !head.includes('style.css')) {
  console.warn('[inline-css] the client chunk carries no stylesheet import; leaving it alone')
  process.exit(0)
}

chunkLines.shift()

const injection = [
  '',
  'const __inlineStylesheet = ' + JSON.stringify(css),
  "if (typeof document !== 'undefined') {",
  "  const style = document.createElement('style')",
  "  style.setAttribute('data-dsh-liangheng', '')",
  '  style.textContent = __inlineStylesheet',
  '  document.head.appendChild(style)',
  '}',
  '',
]

writeFileSync(clientPath, chunkLines.join(NL) + injection.join(NL))
rmSync(cssPath)
// A source map that no longer describes the text is worse than none.
rmSync(clientPath + '.map', { force: true })
console.log('[inline-css] inlined ' + css.length + ' bytes of CSS into ' + clientPath)
