import { useEffect, useRef, useState } from 'react'
import TopMenu from './components/TopMenu.jsx'
import Toolbar from './components/Toolbar.jsx'
import Canvas from './components/Canvas.jsx'
import HistoryPane from './components/HistoryPane.jsx'
import './App.css'

const MAX_EDITS = 5
const DEBOUNCE_MS = 300

export default function App() {
  const [history, setHistory] = useState({ original: null, edits: [] })
  const lastCaptureTime = useRef(0)

  useEffect(() => {
    const onOriginal = (e) => {
      const { dataURL } = e.detail || {}
      if (!dataURL) return
      setHistory({ original: dataURL, edits: [] })
    }
    const onEdit = (e) => {
      const { dataURL } = e.detail || {}
      if (!dataURL) return
      const now = Date.now()
      if (now - lastCaptureTime.current < DEBOUNCE_MS) return
      lastCaptureTime.current = now
      setHistory((h) => {
        const latest = h.edits[0] ?? h.original
        if (dataURL === latest) return h
        return { ...h, edits: [dataURL, ...h.edits].slice(0, MAX_EDITS) }
      })
    }
    window.addEventListener('shadershop:original-loaded', onOriginal)
    window.addEventListener('shadershop:edit-captured', onEdit)
    return () => {
      window.removeEventListener('shadershop:original-loaded', onOriginal)
      window.removeEventListener('shadershop:edit-captured', onEdit)
    }
  }, [])

  return (
    <div className="app">
      <TopMenu />
      <div className="app-body">
        <Toolbar />
        <Canvas />
        <HistoryPane history={history} />
      </div>
    </div>
  )
}
