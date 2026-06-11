import TopMenu from './components/TopMenu.jsx'
import Toolbar from './components/Toolbar.jsx'
import Canvas from './components/Canvas.jsx'
import HistoryPane from './components/HistoryPane.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <TopMenu />
      <div className="app-body">
        <Toolbar />
        <Canvas />
        <HistoryPane />
      </div>
    </div>
  )
}
