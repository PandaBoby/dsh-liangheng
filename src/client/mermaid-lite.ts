/**
 * Zero-dependency lightweight Mermaid parser & SVG renderer for DSH chat fences.
 *
 * Supports the three highest-value engineering diagram types (`flowchart`/`graph`,
 * `sequenceDiagram`, `stateDiagram`/`stateDiagram-v2`) with theme-aware CSS
 * custom properties, CJK-aware text measurement, and strict XML escaping.
 * Returns `null` on unsupported or empty diagrams so the fence falls back to the
 * host's syntax-highlighted code block.
 */

export type DiagramKind = 'flowchart' | 'sequence' | 'state'

export interface RenderedDiagram {
  readonly kind: DiagramKind
  readonly width: number
  readonly height: number
  readonly svgMarkup: string
}

type Direction = 'TD' | 'TB' | 'LR' | 'RL' | 'BT'
type NodeShape = 'rect' | 'round' | 'stadium' | 'diamond' | 'circle' | 'cylinder' | 'hexagon' | 'point'
type EdgeStyle = 'solid' | 'dotted' | 'thick'

interface FlowNode {
  id: string
  label: string
  shape: NodeShape
  subgraphId?: string
  width: number
  height: number
  rank: number
  order: number
  x: number
  y: number
}

interface FlowEdge {
  from: string
  to: string
  label: string
  style: EdgeStyle
  arrow: boolean
}

interface SubgraphBox {
  id: string
  title: string
  nodeIds: string[]
}

const FONT_SIZE = 13
const LINE_HEIGHT = 18

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function unquote(text: string): string {
  const trimmed = text.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('`') && trimmed.endsWith('`'))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function splitLines(label: string): string[] {
  return label
    .replaceAll(/<br\s*\/?>/gi, '\n')
    .replaceAll('\\n', '\n')
    .split('\n')
    .map(l => l.trimEnd())
}

function textWidthPx(text: string, fontSize = FONT_SIZE): number {
  let units = 0
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0
    const wide =
      (cp >= 0x2e80 && cp <= 0x9fff) ||
      (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0xac00 && cp <= 0xd7af) ||
      (cp >= 0xff00 && cp <= 0xffef) ||
      cp > 0x1f000
    units += wide ? 1.04 : 0.6
  }
  return Math.ceil(units * fontSize)
}

function measureLabel(label: string, fontSize = FONT_SIZE): { width: number; height: number; lines: string[] } {
  const lines = splitLines(label)
  const maxW = Math.max(24, ...lines.map(l => textWidthPx(l, fontSize)))
  return {
    width: maxW,
    height: Math.max(LINE_HEIGHT, lines.length * LINE_HEIGHT),
    lines,
  }
}

function renderSvgText(
  x: number,
  centerY: number,
  label: string,
  cls: string,
  fontSize = FONT_SIZE,
): string {
  const lines = splitLines(label)
  if (lines.length === 1) {
    return `<text x="${x.toFixed(1)}" y="${(centerY + fontSize * 0.35).toFixed(1)}" text-anchor="middle" class="${cls}">${escapeXml(lines[0] ?? '')}</text>`
  }
  const topY = centerY - ((lines.length - 1) * LINE_HEIGHT) / 2 + fontSize * 0.35
  const tspans = lines
    .map((line, i) => `<tspan x="${x.toFixed(1)}" dy="${i === 0 ? 0 : LINE_HEIGHT}">${escapeXml(line)}</tspan>`)
    .join('')
  return `<text x="${x.toFixed(1)}" y="${topY.toFixed(1)}" text-anchor="middle" class="${cls}">${tspans}</text>`
}

function preprocessLines(source: string): string[] {
  let clean = source.replace(/\r\n?/g, '\n').trim()
  // Strip optional YAML frontmatter (`--- ... ---`)
  if (/^---\s*\n/.test(clean)) {
    const end = clean.indexOf('\n---', 3)
    if (end !== -1) clean = clean.slice(end + 4).trim()
  }
  const out: string[] = []
  for (const rawLine of clean.split('\n')) {
    // Strip `%%` comments outside quotes (simple conservative scan)
    let line = ''
    let quote: string | null = null
    for (let i = 0; i < rawLine.length; i++) {
      const ch = rawLine[i]
      if ((ch === '"' || ch === "'") && rawLine[i - 1] !== '\\') {
        quote = quote === ch ? null : (quote ?? ch)
      }
      if (quote === null && ch === '%' && rawLine[i + 1] === '%') break
      line += ch
    }
    const trimmed = line.trim()
    if (trimmed !== '') out.push(trimmed)
  }
  return out
}

// ── Flowchart & State Graph Layout ──────────────────────────────────────────

function parseNodeToken(token: string): { id: string; label?: string; shape?: NodeShape } {
  const trimmed = token.trim()
  const patterns: Array<[RegExp, NodeShape]> = [
    [/^([A-Za-z0-9_.-]+)\(\[([\s\S]+)\]\)$/, 'stadium'],
    [/^([A-Za-z0-9_.-]+)\[\(([\s\S]+)\)\]$/, 'cylinder'],
    [/^([A-Za-z0-9_.-]+)\(\(([\s\S]+)\)\)$/, 'circle'],
    [/^([A-Za-z0-9_.-]+)\{\{([\s\S]+)\}\}$/, 'hexagon'],
    [/^([A-Za-z0-9_.-]+)\[\[([\s\S]+)\]\]$/, 'rect'],
    [/^([A-Za-z0-9_.-]+)\[([\s\S]+)\]$/, 'rect'],
    [/^([A-Za-z0-9_.-]+)\(([\s\S]+)\)$/, 'round'],
    [/^([A-Za-z0-9_.-]+)\{([\s\S]+)\}$/, 'diamond'],
  ]
  for (const [re, shape] of patterns) {
    const m = re.exec(trimmed)
    if (m) return { id: m[1], label: unquote(m[2]), shape }
  }
  const bare = /^([A-Za-z0-9_.-]+)$/.exec(trimmed)
  if (bare) return { id: bare[1] }
  return { id: '' }
}

const FLOW_OP_RE = /(?:==>|===|-\.->|-\.-|-->|--->|---|--\s+[^-]+?\s+-->|--\s+[^-]+?\s+---|==\s+[^=]+?\s+==>|-\.\s+[^.]+?\s+\.->)/

function matchEdgeAt(str: string, from: number): { end: number; label: string; style: EdgeStyle; arrow: boolean } | null {
  const rest = str.slice(from)
  // Ordered longest/labeled forms first
  const patterns: Array<[RegExp, EdgeStyle, boolean, boolean]> = [
    [/^-\.\s*([\s\S]+?)\s*\.->\|([^|]*)\|/, 'dotted', true, true],
    [/^-\.\s*([\s\S]+?)\s*\.->/, 'dotted', true, true],
    [/^==\s*([\s\S]+?)\s*==>/, 'thick', true, true],
    [/^--\s*([^|>\n][\s\S]*?)\s*-->/, 'solid', true, true],
    [/^--\s*([^|>\n-]+?)\s*---/, 'solid', false, true],
    [/^-\.->\|([^|]*)\|/, 'dotted', true, true],
    [/^==>\|([^|]*)\|/, 'thick', true, true],
    [/^-->\|([^|]*)\|/, 'solid', true, true],
    [/^---\|([^|]*)\|/, 'solid', false, true],
    [/^-\.->/, 'dotted', true, false],
    [/^-\.-/, 'dotted', false, false],
    [/^==>/, 'thick', true, false],
    [/^===/, 'thick', false, false],
    [/^--+>/, 'solid', true, false],
    [/^---/, 'solid', false, false],
  ]
  for (const [re, style, arrow, hasCapture] of patterns) {
    const m = re.exec(rest)
    if (m) {
      return {
        end: from + m[0].length,
        label: hasCapture ? unquote(m[1] ?? '') : '',
        style,
        arrow,
      }
    }
  }
  return null
}

function splitTopLevelEdgeChain(statement: string): { nodes: string[]; edges: Array<{ label: string; style: EdgeStyle; arrow: boolean }> } | null {
  const nodes: string[] = []
  const edges: Array<{ label: string; style: EdgeStyle; arrow: boolean }> = []
  let depthParen = 0
  let depthBracket = 0
  let depthBrace = 0
  let quote: string | null = null
  let segStart = 0

  for (let i = 0; i < statement.length; i++) {
    const ch = statement[i]
    if ((ch === '"' || ch === "'") && statement[i - 1] !== '\\') {
      quote = quote === ch ? null : (quote ?? ch)
      continue
    }
    if (quote !== null) continue
    if (ch === '(') depthParen++
    else if (ch === ')') depthParen = Math.max(0, depthParen - 1)
    else if (ch === '[') depthBracket++
    else if (ch === ']') depthBracket = Math.max(0, depthBracket - 1)
    else if (ch === '{') depthBrace++
    else if (ch === '}') depthBrace = Math.max(0, depthBrace - 1)

    if (depthParen === 0 && depthBracket === 0 && depthBrace === 0) {
      const hit = matchEdgeAt(statement, i)
      if (hit) {
        const left = statement.slice(segStart, i).trim()
        if (left === '') return null
        nodes.push(left)
        edges.push({ label: hit.label, style: hit.style, arrow: hit.arrow })
        segStart = hit.end
        i = hit.end - 1
      }
    }
  }
  if (edges.length === 0) return null
  const tail = statement.slice(segStart).trim()
  if (tail === '') return null
  nodes.push(tail)
  return { nodes, edges }
}

function layoutAndRenderGraph(
  kind: 'flowchart' | 'state',
  direction: Direction,
  nodeMap: Map<string, FlowNode>,
  edges: FlowEdge[],
  subgraphs: SubgraphBox[],
): RenderedDiagram | null {
  if (nodeMap.size === 0) return null

  const normalizedDir: 'LR' | 'RL' | 'TD' | 'BT' = direction === 'TB' ? 'TD' : direction
  const horizontal = normalizedDir === 'LR' || normalizedDir === 'RL'

  for (const node of nodeMap.values()) {
    if (node.shape === 'point') {
      node.width = 20
      node.height = 20
      continue
    }
    const m = measureLabel(node.label)
    const padX = node.shape === 'diamond' ? 46 : node.shape === 'hexagon' ? 40 : 28
    const padY = node.shape === 'diamond' ? 28 : node.shape === 'cylinder' ? 26 : 18
    node.width = Math.max(56, m.width + padX)
    node.height = Math.max(36, m.height + padY)
    if (node.shape === 'circle') {
      const side = Math.max(node.width, node.height, 42)
      node.width = side
      node.height = side
    }
  }

  // Adjacency for rank assignment (break cycles using DFS state)
  const adj = new Map<string, string[]>()
  for (const id of nodeMap.keys()) adj.set(id, [])
  for (const e of edges) {
    if (e.from !== e.to && adj.has(e.from) && nodeMap.has(e.to)) {
      adj.get(e.from)!.push(e.to)
    }
  }

  const dagEdges: FlowEdge[] = []
  const state = new Map<string, 0 | 1 | 2>()
  const dfsCycle = (u: string) => {
    state.set(u, 1)
    for (const v of adj.get(u) ?? []) {
      const s = state.get(v) ?? 0
      if (s === 0) {
        dagEdges.push({ from: u, to: v, label: '', style: 'solid', arrow: true })
        dfsCycle(v)
      } else if (s === 2) {
        dagEdges.push({ from: u, to: v, label: '', style: 'solid', arrow: true })
      }
    }
    state.set(u, 2)
  }
  for (const id of nodeMap.keys()) {
    if ((state.get(id) ?? 0) === 0) dfsCycle(id)
  }

  // Longest-path layering on cycle-free edge list
  for (let pass = 0; pass < nodeMap.size; pass++) {
    let changed = false
    for (const e of dagEdges) {
      const u = nodeMap.get(e.from)!
      const v = nodeMap.get(e.to)!
      if (v.rank < u.rank + 1) {
        v.rank = u.rank + 1
        changed = true
      }
    }
    if (!changed) break
  }

  const maxRank = Math.max(0, ...[...nodeMap.values()].map(n => n.rank))
  const ranks: FlowNode[][] = Array.from({ length: maxRank + 1 }, () => [])
  for (const node of nodeMap.values()) {
    ranks[node.rank].push(node)
  }

  // 2-pass barycenter sweep to minimize crossings
  for (let r = 0; r <= maxRank; r++) ranks[r].forEach((n, i) => { n.order = i })
  const preds = new Map<string, string[]>()
  for (const id of nodeMap.keys()) preds.set(id, [])
  for (const e of edges) {
    if (e.from !== e.to) preds.get(e.to)?.push(e.from)
  }
  for (let sweep = 0; sweep < 2; sweep++) {
    for (let r = 1; r <= maxRank; r++) {
      ranks[r].sort((a, b) => {
        const avg = (n: FlowNode) => {
          const ps = (preds.get(n.id) ?? []).map(id => nodeMap.get(id)).filter((p): p is FlowNode => p !== undefined && p.rank < n.rank)
          return ps.length === 0 ? n.order : ps.reduce((s, p) => s + p.order, 0) / ps.length
        }
        return avg(a) - avg(b)
      })
      ranks[r].forEach((n, i) => { n.order = i })
    }
  }

  const PAD = 32
  const GAP_PRIMARY = edges.some(e => e.label !== '') ? 72 : 56
  const GAP_CROSS = 28
  const SUBGRAPH_TOP_EXTRA = 26

  // Primary axis coordinates per rank
  const rankSizes = ranks.map(layer => Math.max(36, ...layer.map(n => (horizontal ? n.width : n.height))))
  const rankCrossTotal = ranks.map(layer =>
    layer.reduce((s, n) => s + (horizontal ? n.height : n.width), 0) + Math.max(0, layer.length - 1) * GAP_CROSS,
  )
  const maxCrossSpan = Math.max(120, ...rankCrossTotal)

  const rankStart = new Array<number>(maxRank + 1).fill(0)
  let cursor = PAD + (subgraphs.length > 0 && !horizontal ? SUBGRAPH_TOP_EXTRA : 0)
  const orderedRanks = normalizedDir === 'RL' || normalizedDir === 'BT' ? [...ranks.keys()].reverse() : [...ranks.keys()]
  for (const r of orderedRanks) {
    rankStart[r] = cursor
    cursor += rankSizes[r] + GAP_PRIMARY
  }
  const totalPrimary = cursor - GAP_PRIMARY + PAD

  for (let r = 0; r <= maxRank; r++) {
    const layer = ranks[r]
    const span = rankCrossTotal[r]
    let cross = PAD + (horizontal && subgraphs.length > 0 ? SUBGRAPH_TOP_EXTRA : 0) + (maxCrossSpan - span) / 2
    for (const node of layer) {
      if (horizontal) {
        node.x = rankStart[r] + rankSizes[r] / 2
        node.y = cross + node.height / 2
        cross += node.height + GAP_CROSS
      } else {
        node.x = cross + node.width / 2
        node.y = rankStart[r] + rankSizes[r] / 2
        cross += node.width + GAP_CROSS
      }
    }
  }

  // Subgraph boxes
  const sgSvg: string[] = []
  let maxX = horizontal ? totalPrimary : maxCrossSpan + PAD * 2
  let maxY = horizontal ? maxCrossSpan + PAD * 2 + (subgraphs.length > 0 ? SUBGRAPH_TOP_EXTRA : 0) : totalPrimary

  for (const sg of subgraphs) {
    const members = sg.nodeIds.map(id => nodeMap.get(id)).filter((n): n is FlowNode => n !== undefined)
    if (members.length === 0) continue
    const x1 = Math.min(...members.map(m => m.x - m.width / 2)) - 14
    const y1 = Math.min(...members.map(m => m.y - m.height / 2)) - 28
    const x2 = Math.max(...members.map(m => m.x + m.width / 2)) + 14
    const y2 = Math.max(...members.map(m => m.y + m.height / 2)) + 14
    maxX = Math.max(maxX, x2 + PAD / 2)
    maxY = Math.max(maxY, y2 + PAD / 2)
    sgSvg.push(
      `<g class="lh-subgraph"><rect x="${x1.toFixed(1)}" y="${y1.toFixed(1)}" width="${(x2 - x1).toFixed(1)}" height="${(y2 - y1).toFixed(1)}" rx="8" />` +
      `<text x="${(x1 + 10).toFixed(1)}" y="${(y1 + 18).toFixed(1)}" class="lh-sg-title">${escapeXml(sg.title)}</text></g>`,
    )
  }

  // Render edges
  const edgeSvg: string[] = []
  for (const e of edges) {
    const u = nodeMap.get(e.from)
    const v = nodeMap.get(e.to)
    if (!u || !v) continue

    let pathD: string
    let lx: number
    let ly: number

    if (u === v) {
      const sx = u.x + u.width / 2
      const sy = u.y - 6
      const ex = u.x + u.width / 2
      const ey = u.y + 6
      pathD = `M ${sx} ${sy} C ${sx + 38} ${sy - 26}, ${ex + 38} ${ey + 26}, ${ex} ${ey}`
      lx = sx + 34
      ly = u.y
    } else if (horizontal) {
      const forward = u.x <= v.x
      const sx = u.x + (forward ? u.width / 2 : -u.width / 2)
      const sy = u.y
      const ex = v.x + (forward ? -v.width / 2 : v.width / 2)
      const ey = v.y
      const mx = (sx + ex) / 2
      if (Math.abs(u.rank - v.rank) === 0) {
        const bulge = sx + 40
        pathD = `M ${sx} ${sy} C ${bulge} ${sy}, ${bulge} ${ey}, ${ex} ${ey}`
        lx = bulge - 6
        ly = (sy + ey) / 2
      } else {
        pathD = `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ey}, ${ex} ${ey}`
        lx = mx
        ly = (sy + ey) / 2
      }
    } else {
      const forward = u.y <= v.y
      const sx = u.x
      const sy = u.y + (forward ? u.height / 2 : -u.height / 2)
      const ex = v.x
      const ey = v.y + (forward ? -v.height / 2 : v.height / 2)
      const my = (sy + ey) / 2
      if (Math.abs(u.rank - v.rank) === 0) {
        const bulge = Math.max(u.x, v.x) + u.width / 2 + 26
        pathD = `M ${sx} ${sy} C ${bulge} ${sy}, ${bulge} ${ey}, ${ex} ${ey}`
        lx = bulge
        ly = (sy + ey) / 2
      } else {
        pathD = `M ${sx} ${sy} C ${sx} ${my}, ${ex} ${my}, ${ex} ${ey}`
        lx = (sx + ex) / 2
        ly = my
      }
    }

    const dash = e.style === 'dotted' ? ' stroke-dasharray="5,4"' : ''
    const sw = e.style === 'thick' ? '2.4' : '1.5'
    const marker = e.arrow ? ' marker-end="url(#lh-arrow)"' : ''
    edgeSvg.push(`<path d="${pathD}" fill="none" stroke-width="${sw}"${dash}${marker} class="lh-edge" />`)

    if (e.label !== '') {
      const m = measureLabel(e.label, 11.5)
      const rw = m.width + 12
      const rh = m.height + 6
      edgeSvg.push(
        `<g class="lh-edge-label">` +
        `<rect x="${(lx - rw / 2).toFixed(1)}" y="${(ly - rh / 2).toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}" rx="4" />` +
        renderSvgText(lx, ly, e.label, 'lh-edge-text', 11.5) +
        `</g>`,
      )
    }
  }

  // Render nodes
  const nodeSvg: string[] = []
  for (const n of nodeMap.values()) {
    const left = n.x - n.width / 2
    const top = n.y - n.height / 2
    let shapeEl: string
    if (n.shape === 'point') {
      nodeSvg.push(`<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="8" class="lh-state-point" />`)
      continue
    } else if (n.shape === 'diamond') {
      const pts = `${n.x},${top} ${left + n.width},${n.y} ${n.x},${top + n.height} ${left},${n.y}`
      shapeEl = `<polygon points="${pts}" class="lh-node-shape lh-node-diamond" />`
    } else if (n.shape === 'hexagon') {
      const dx = 12
      const pts = `${left + dx},${top} ${left + n.width - dx},${top} ${left + n.width},${n.y} ${left + n.width - dx},${top + n.height} ${left + dx},${top + n.height} ${left},${n.y}`
      shapeEl = `<polygon points="${pts}" class="lh-node-shape" />`
    } else if (n.shape === 'circle') {
      shapeEl = `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${(n.width / 2).toFixed(1)}" class="lh-node-shape" />`
    } else if (n.shape === 'cylinder') {
      const ry = 6
      const d = `M ${left} ${top + ry} a ${n.width / 2} ${ry} 0 1 0 ${n.width} 0 a ${n.width / 2} ${ry} 0 1 0 ${-n.width} 0 v ${n.height - ry * 2} a ${n.width / 2} ${ry} 0 0 0 ${n.width} 0 v ${-(n.height - ry * 2)}`
      shapeEl = `<path d="${d}" class="lh-node-shape" />`
    } else {
      const rx = n.shape === 'stadium' ? Math.round(n.height / 2) : n.shape === 'round' ? 12 : 6
      shapeEl = `<rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${n.width.toFixed(1)}" height="${n.height.toFixed(1)}" rx="${rx}" class="lh-node-shape" />`
    }
    nodeSvg.push(`<g class="lh-node">${shapeEl}${renderSvgText(n.x, n.y, n.label, 'lh-node-text')}</g>`)
  }

  const w = Math.ceil(maxX)
  const h = Math.ceil(maxY)
  const svgMarkup = buildSvgShell(w, h, [...sgSvg, ...edgeSvg, ...nodeSvg].join(''))
  return { kind, width: w, height: h, svgMarkup }
}

function parseFlowchart(lines: string[]): RenderedDiagram | null {
  const header = /^(?:flowchart|graph)(?:\s+(TD|TB|LR|RL|BT))?\b/i.exec(lines[0] ?? '')
  if (!header) return null
  const direction = (header[1]?.toUpperCase() as Direction | undefined) ?? 'TD'

  const nodeMap = new Map<string, FlowNode>()
  const edges: FlowEdge[] = []
  const subgraphs: SubgraphBox[] = []
  const sgStack: SubgraphBox[] = []

  const ensureNode = (rawToken: string): string => {
    const parsed = parseNodeToken(rawToken)
    if (parsed.id === '') return ''
    const existing = nodeMap.get(parsed.id)
    if (existing) {
      if (parsed.label !== undefined) existing.label = parsed.label
      if (parsed.shape !== undefined) existing.shape = parsed.shape
      if (sgStack.length > 0 && !existing.subgraphId) {
        const sg = sgStack[sgStack.length - 1]
        existing.subgraphId = sg.id
        sg.nodeIds.push(existing.id)
      }
      return existing.id
    }
    const sg = sgStack.length > 0 ? sgStack[sgStack.length - 1] : undefined
    const node: FlowNode = {
      id: parsed.id,
      label: parsed.label ?? parsed.id,
      shape: parsed.shape ?? 'rect',
      subgraphId: sg?.id,
      width: 80,
      height: 36,
      rank: 0,
      order: 0,
      x: 0,
      y: 0,
    }
    nodeMap.set(parsed.id, node)
    sg?.nodeIds.push(parsed.id)
    return parsed.id
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].replace(/;\s*$/, '').trim()
    if (line === '') continue
    if (/^(?:classDef|class|style|linkStyle|click|direction)\b/i.test(line)) continue
    if (line === 'end') {
      sgStack.pop()
      continue
    }
    const sgMatch = /^subgraph\s+(.+)$/i.exec(line)
    if (sgMatch) {
      const rest = sgMatch[1].trim()
      const withBracket = /^([A-Za-z0-9_.-]+)\s*\[([\s\S]+)\]$/.exec(rest)
      const id = withBracket ? withBracket[1] : `sg_${subgraphs.length}`
      const title = withBracket ? unquote(withBracket[2]) : unquote(rest)
      const box: SubgraphBox = { id, title, nodeIds: [] }
      subgraphs.push(box)
      sgStack.push(box)
      continue
    }

    const chain = splitTopLevelEdgeChain(line)
    if (chain) {
      for (let k = 0; k < chain.edges.length; k++) {
        const leftIds = chain.nodes[k].split('&').map(ensureNode).filter(Boolean)
        const rightIds = chain.nodes[k + 1].split('&').map(ensureNode).filter(Boolean)
        const edgeMeta = chain.edges[k]
        for (const from of leftIds) {
          for (const to of rightIds) {
            edges.push({ from, to, ...edgeMeta })
          }
        }
      }
      continue
    }

    if (FLOW_OP_RE.test(line)) continue
    ensureNode(line)
  }

  return layoutAndRenderGraph('flowchart', direction, nodeMap, edges, subgraphs)
}

function parseStateDiagram(lines: string[]): RenderedDiagram | null {
  if (!/^stateDiagram(?:-v2)?\b/i.test(lines[0] ?? '')) return null
  let direction: Direction = 'TD'
  const nodeMap = new Map<string, FlowNode>()
  const edges: FlowEdge[] = []
  let startCount = 0

  const resolveStateId = (raw: string, isTarget: boolean): string => {
    const t = raw.trim()
    if (t === '[*]') {
      const id = isTarget && startCount > 0 ? '__end__' : '__start__'
      if (!isTarget) startCount += 1
      if (!nodeMap.has(id)) {
        nodeMap.set(id, { id, label: '', shape: 'point', width: 20, height: 20, rank: 0, order: 0, x: 0, y: 0 })
      }
      return id
    }
    if (!nodeMap.has(t)) {
      nodeMap.set(t, { id: t, label: t, shape: 'round', width: 80, height: 36, rank: 0, order: 0, x: 0, y: 0 })
    }
    return t
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === '' || line === '{' || line === '}' || line === 'note' || /^note\b/i.test(line)) continue
    const dirMatch = /^direction\s+(TD|TB|LR|RL|BT)\b/i.exec(line)
    if (dirMatch) {
      direction = dirMatch[1].toUpperCase() as Direction
      continue
    }
    const aliasMatch = /^state\s+"([^"]+)"\s+as\s+([A-Za-z0-9_.-]+)/i.exec(line)
    if (aliasMatch) {
      const id = resolveStateId(aliasMatch[2], false)
      nodeMap.get(id)!.label = aliasMatch[1]
      continue
    }
    const edgeMatch = /^(\[\*\]|[A-Za-z0-9_.-]+)\s*-->\s*(\[\*\]|[A-Za-z0-9_.-]+)(?:\s*:\s*(.+))?$/.exec(line)
    if (edgeMatch) {
      const from = resolveStateId(edgeMatch[1], false)
      const to = resolveStateId(edgeMatch[2], true)
      edges.push({ from, to, label: (edgeMatch[3] ?? '').trim(), style: 'solid', arrow: true })
      continue
    }
    const descMatch = /^([A-Za-z0-9_.-]+)\s*:\s*(.+)$/.exec(line)
    if (descMatch) {
      const id = resolveStateId(descMatch[1], false)
      nodeMap.get(id)!.label = descMatch[2].trim()
    }
  }

  return layoutAndRenderGraph('state', direction, nodeMap, edges, [])
}

// ── Sequence Diagram Renderer ───────────────────────────────────────────────

interface SeqParticipant {
  id: string
  label: string
  x: number
  width: number
}

type SeqEvent =
  | { kind: 'msg'; from: string; to: string; label: string; dashed: boolean }
  | { kind: 'note'; left: string; right: string; placement: 'left' | 'right' | 'over'; text: string }
  | { kind: 'groupStart'; keyword: string; label: string }
  | { kind: 'groupDivider'; label: string }
  | { kind: 'groupEnd' }

function parseSequenceDiagram(lines: string[]): RenderedDiagram | null {
  if (!/^sequenceDiagram\b/i.test(lines[0] ?? '')) return null

  const participants = new Map<string, SeqParticipant>()
  const order: string[] = []
  const events: SeqEvent[] = []

  const ensureParticipant = (rawId: string, alias?: string): string => {
    const id = rawId.trim()
    const existing = participants.get(id)
    if (existing) {
      if (alias !== undefined) existing.label = unquote(alias)
      return id
    }
    const label = alias !== undefined ? unquote(alias) : id
    const m = measureLabel(label)
    participants.set(id, { id, label, x: 0, width: Math.max(88, m.width + 24) })
    order.push(id)
    return id
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === '' || /^autonumber\b/i.test(line) || /^(?:activate|deactivate|destroy|box)\b/i.test(line)) continue

    const partMatch = /^(?:participant|actor)\s+([A-Za-z0-9_.-]+)(?:\s+as\s+(.+))?$/i.exec(line)
    if (partMatch) {
      ensureParticipant(partMatch[1], partMatch[2])
      continue
    }

    const groupMatch = /^(alt|opt|loop|par|critical|break)\s*(.*)$/i.exec(line)
    if (groupMatch) {
      events.push({ kind: 'groupStart', keyword: groupMatch[1].toLowerCase(), label: groupMatch[2].trim() })
      continue
    }
    const divMatch = /^(?:else|and|option)\s*(.*)$/i.exec(line)
    if (divMatch) {
      events.push({ kind: 'groupDivider', label: divMatch[1].trim() })
      continue
    }
    if (line === 'end') {
      events.push({ kind: 'groupEnd' })
      continue
    }

    const noteMatch = /^Note\s+(left of|right of|over)\s+([^:]+):\s*(.*)$/i.exec(line)
    if (noteMatch) {
      const placeRaw = noteMatch[1].toLowerCase()
      const placement = placeRaw.startsWith('left') ? 'left' : placeRaw.startsWith('right') ? 'right' : 'over'
      const targets = noteMatch[2].split(',').map(s => ensureParticipant(s))
      events.push({
        kind: 'note',
        left: targets[0],
        right: targets[targets.length - 1],
        placement,
        text: noteMatch[3].trim(),
      })
      continue
    }

    const msgMatch = /^([A-Za-z0-9_.-]+)\s*(-->>|->>|-->|->|--x|-x|--\)|-\))[+-]?\s*([A-Za-z0-9_.-]+)\s*:\s*(.*)$/.exec(line)
    if (msgMatch) {
      const from = ensureParticipant(msgMatch[1])
      const op = msgMatch[2]
      const to = ensureParticipant(msgMatch[3])
      events.push({ kind: 'msg', from, to, label: msgMatch[4].trim(), dashed: op.startsWith('--') })
    }
  }

  if (order.length === 0) return null

  const PAD = 28
  const BOX_H = 34
  const TOP_Y = 24

  // Compute column gaps taking adjacent message label widths into account
  const gaps = new Array<number>(Math.max(0, order.length - 1)).fill(48)
  for (const ev of events) {
    if (ev.kind !== 'msg' || ev.from === ev.to) continue
    const i1 = order.indexOf(ev.from)
    const i2 = order.indexOf(ev.to)
    if (Math.abs(i1 - i2) === 1) {
      const minIdx = Math.min(i1, i2)
      const lblW = measureLabel(ev.label, 12).width + 36
      const baseGap = (participants.get(order[minIdx])!.width + participants.get(order[minIdx + 1])!.width) / 2
      gaps[minIdx] = Math.max(gaps[minIdx], lblW - baseGap + 24)
    }
  }

  let curX = PAD
  for (let i = 0; i < order.length; i++) {
    const p = participants.get(order[i])!
    p.x = curX + p.width / 2
    curX += p.width + (gaps[i] ?? 0)
  }

  let y = TOP_Y + BOX_H + 26
  const svgBody: string[] = []
  const groupStack: Array<{ keyword: string; label: string; topY: number; minIdx: number; maxIdx: number }> = []
  let maxX = curX + PAD

  for (const ev of events) {
    if (ev.kind === 'groupStart') {
      groupStack.push({ keyword: ev.keyword, label: ev.label, topY: y - 10, minIdx: order.length - 1, maxIdx: 0 })
      y += 28
      continue
    }
    if (ev.kind === 'groupDivider') {
      const g = groupStack[groupStack.length - 1]
      if (g) {
        const lx = participants.get(order[0])!.x - participants.get(order[0])!.width / 2 - 8
        const rx = participants.get(order[order.length - 1])!.x + participants.get(order[order.length - 1])!.width / 2 + 8
        svgBody.push(`<line x1="${lx}" y1="${y}" x2="${rx}" y2="${y}" class="lh-seq-divider" />`)
        if (ev.label) {
          svgBody.push(`<text x="${lx + 8}" y="${y + 16}" class="lh-edge-text">[${escapeXml(ev.label)}]</text>`)
        }
        y += 28
      }
      continue
    }
    if (ev.kind === 'groupEnd') {
      const g = groupStack.pop()
      if (g) {
        const lx = participants.get(order[0])!.x - participants.get(order[0])!.width / 2 - 8
        const rx = participants.get(order[order.length - 1])!.x + participants.get(order[order.length - 1])!.width / 2 + 8
        const gh = y - g.topY + 6
        svgBody.unshift(
          `<g class="lh-subgraph"><rect x="${lx}" y="${g.topY}" width="${rx - lx}" height="${gh}" rx="6" />` +
          `<text x="${lx + 10}" y="${g.topY + 17}" class="lh-sg-title">${escapeXml(g.keyword + (g.label ? ` ${g.label}` : ''))}</text></g>`,
        )
        y += 18
      }
      continue
    }
    if (ev.kind === 'note') {
      const m = measureLabel(ev.text, 12)
      const nw = Math.max(84, m.width + 20)
      const nh = Math.max(28, m.height + 12)
      const pL = participants.get(ev.left)!
      const pR = participants.get(ev.right)!
      let nx: number
      if (ev.placement === 'left') nx = pL.x - nw - 12
      else if (ev.placement === 'right') nx = pR.x + 12
      else nx = (pL.x + pR.x) / 2 - nw / 2
      nx = Math.max(8, nx)
      maxX = Math.max(maxX, nx + nw + PAD)
      svgBody.push(
        `<g class="lh-seq-note"><rect x="${nx.toFixed(1)}" y="${y}" width="${nw.toFixed(1)}" height="${nh.toFixed(1)}" rx="5" />` +
        renderSvgText(nx + nw / 2, y + nh / 2, ev.text, 'lh-node-text', 12) +
        `</g>`,
      )
      y += nh + 18
      continue
    }
    if (ev.kind === 'msg') {
      const x1 = participants.get(ev.from)!.x
      const x2 = participants.get(ev.to)!.x
      const dash = ev.dashed ? ' stroke-dasharray="5,4"' : ''
      if (x1 === x2) {
        const loopW = 36
        const loopH = 26
        const lblM = measureLabel(ev.label, 12)
        maxX = Math.max(maxX, x1 + loopW + lblM.width + PAD)
        svgBody.push(
          `<path d="M ${x1} ${y + 10} H ${x1 + loopW} V ${y + 10 + loopH} H ${x1}" fill="none" stroke-width="1.5"${dash} marker-end="url(#lh-arrow)" class="lh-edge" />` +
          `<text x="${x1 + loopW + 8}" y="${y + 27}" class="lh-seq-msg-left">${escapeXml(ev.label)}</text>`,
        )
        y += 52
      } else {
        const midX = (x1 + x2) / 2
        svgBody.push(
          `<line x1="${x1}" y1="${y + 18}" x2="${x2}" y2="${y + 18}" stroke-width="1.5"${dash} marker-end="url(#lh-arrow)" class="lh-edge" />` +
          `<text x="${midX}" y="${y + 11}" text-anchor="middle" class="lh-node-text">${escapeXml(ev.label)}</text>`,
        )
        y += 42
      }
    }
  }

  const bottomY = y + 8
  const lifelines: string[] = []
  const boxes: string[] = []
  for (const id of order) {
    const p = participants.get(id)!
    lifelines.push(`<line x1="${p.x}" y1="${TOP_Y + BOX_H}" x2="${p.x}" y2="${bottomY}" class="lh-seq-life" />`)
    const bx = p.x - p.width / 2
    boxes.push(
      `<g class="lh-node"><rect x="${bx.toFixed(1)}" y="${TOP_Y}" width="${p.width.toFixed(1)}" height="${BOX_H}" rx="6" class="lh-node-shape" />${renderSvgText(p.x, TOP_Y + BOX_H / 2, p.label, 'lh-node-text')}</g>` +
      `<g class="lh-node"><rect x="${bx.toFixed(1)}" y="${bottomY}" width="${p.width.toFixed(1)}" height="${BOX_H}" rx="6" class="lh-node-shape" />${renderSvgText(p.x, bottomY + BOX_H / 2, p.label, 'lh-node-text')}</g>`,
    )
  }

  const w = Math.ceil(maxX)
  const h = Math.ceil(bottomY + BOX_H + 24)
  return {
    kind: 'sequence',
    width: w,
    height: h,
    svgMarkup: buildSvgShell(w, h, [...lifelines, ...svgBody, ...boxes].join('')),
  }
}

function buildSvgShell(width: number, height: number, inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="lh-mermaid-svg" role="img">` +
    `<defs><marker id="lh-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">` +
    `<path d="M 1 1.5 L 8.5 5 L 1 8.5 z" class="lh-arrow-head" /></marker></defs>` +
    inner +
    `</svg>`
}

/**
 * Parse and render a Mermaid block into responsive inline SVG markup.
 * Returns `null` when the block is empty or uses an unsupported diagram type.
 */
export function parseMermaidDiagram(source: string): RenderedDiagram | null {
  const lines = preprocessLines(source)
  if (lines.length === 0) return null
  const first = lines[0]
  if (/^(?:flowchart|graph)\b/i.test(first)) return parseFlowchart(lines)
  if (/^sequenceDiagram\b/i.test(first)) return parseSequenceDiagram(lines)
  if (/^stateDiagram(?:-v2)?\b/i.test(first)) return parseStateDiagram(lines)
  return null
}
