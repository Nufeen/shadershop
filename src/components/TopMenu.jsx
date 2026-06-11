import { useEffect, useRef, useState } from 'react'

const MENUS = [
  { label: 'File', items: ['Load', 'Export'] },
]

export default function TopMenu() {
  const [openIndex, setOpenIndex] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpenIndex(null)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <nav className="top-menu" ref={ref}>
      {MENUS.map((menu, i) => (
        <div
          key={menu.label}
          className={`menu ${openIndex === i ? 'open' : ''}`}
          onMouseEnter={() => openIndex !== null && setOpenIndex(i)}
        >
          <button
            className="menu-button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {menu.label}
          </button>
          {openIndex === i && (
            <ul className="menu-dropdown">
              {menu.items.map((item) => (
                <li key={item} className="menu-item" onClick={() => setOpenIndex(null)}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}
