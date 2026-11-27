import { describe, expect, it } from 'vitest'
import { parseMermaidDiagram } from './mermaid-lite.ts'

describe('parseMermaidDiagram', () => {
  it('renders flowchart LR with subgraphs, shapes, quoted labels, and XML escaping', () => {
    const diagram = parseMermaidDiagram(`
      %% comment ignored
      flowchart LR
        subgraph Frontend["前端界面"]
          Btn(["刷新按钮 <script>"])
          Hook{"useQuery & Refetch"}
        end
        Btn -->|点击| API["POST /api/charge/piles/states"]
        API -. async .-> Hook
    `)
    expect(diagram).not.toBeNull()
    expect(diagram?.kind).toBe('flowchart')
    expect(diagram?.width).toBeGreaterThan(200)
    expect(diagram?.height).toBeGreaterThan(100)
    expect(diagram?.svgMarkup).toContain('<svg ')
    expect(diagram?.svgMarkup).toContain('前端界面')
    expect(diagram?.svgMarkup).toContain('POST /api/charge/piles/states')
    expect(diagram?.svgMarkup).toContain('&lt;script&gt;')
    expect(diagram?.svgMarkup).not.toContain('<script>')
  })

  it('renders sequenceDiagram with participants, messages, self-calls, Note, and alt/else', () => {
    const diagram = parseMermaidDiagram(`
      sequenceDiagram
        participant U as 前端按钮
        participant S as 后端 API
        U->>S: POST /api/states
        alt 缓存过期
          S-->>S: 遍历 Redis 拼装快照
        else 命中
          S-->>U: 返回快照 JSON
        end
        Note over U,S: 纯读不发 MQTT
    `)
    expect(diagram).not.toBeNull()
    expect(diagram?.kind).toBe('sequence')
    expect(diagram?.svgMarkup).toContain('前端按钮')
    expect(diagram?.svgMarkup).toContain('POST /api/states')
    expect(diagram?.svgMarkup).toContain('纯读不发 MQTT')
    expect(diagram?.svgMarkup).toContain('alt 缓存过期')
  })

  it('renders stateDiagram-v2 with [*] start/end states', () => {
    const diagram = parseMermaidDiagram(`
      stateDiagram-v2
        direction LR
        [*] --> Idle
        Idle --> Fetching : invalidateQueries
        Fetching --> [*] : settled
    `)
    expect(diagram).not.toBeNull()
    expect(diagram?.kind).toBe('state')
    expect(diagram?.svgMarkup).toContain('invalidateQueries')
    expect(diagram?.svgMarkup).toContain('lh-state-point')
  })

  it('returns null on empty input or unsupported diagram types', () => {
    expect(parseMermaidDiagram('')).toBeNull()
    expect(parseMermaidDiagram('gantt\n  title Schedule\n  section A')).toBeNull()
  })
})
