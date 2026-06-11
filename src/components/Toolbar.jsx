import { useState } from 'react'

const TOOLS = [
  { id: 'select', label: 'Select', glyph: '◱' },
  { id: 'pan', label: 'Pan', glyph: '✥' },
  { id: 'draw', label: 'Draw', glyph: '✎' },
  { id: 'shape', label: 'Shape', glyph: '◯' },
  { id: 'text', label: 'Text', glyph: 'T' },
  { id: 'eyedrop', label: 'Pick', glyph: '⌽' },
]

export default function Toolbar() {
  const [active, setActive] = useState('select')
  return (
    <aside className="toolbar">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          className={`tool ${active === tool.id ? 'active' : ''}`}
          title={tool.label}
          onClick={() => setActive(tool.id)}
        >
          <span className="tool-glyph">{tool.glyph}</span>
        </button>
      ))}
    </aside>
  )
}
