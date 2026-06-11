import { useState } from 'react'

const TOOLS = [
  { id: 'blur', label: 'Blur', glyph: '◯' },
]

export default function Toolbar() {
  const [active, setActive] = useState('blur')
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
