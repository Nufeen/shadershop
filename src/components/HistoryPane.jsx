function restore(src) {
  window.dispatchEvent(
    new CustomEvent('shadershop:load', {
      detail: { url: src, asOriginal: false },
    }),
  )
}

export default function HistoryPane({ history }) {
  const { original, edits } = history
  return (
    <aside className="history-pane">
      <div className="history-header">History</div>
      <ul className="history-list">
        {edits.map((src, i) => (
          <li key={src} className="history-item" onClick={() => restore(src)}>
            <img className="history-thumb" src={src} alt="" />
            <span className="history-label">Edit {edits.length - i}</span>
          </li>
        ))}
        {original && (
          <li
            key="original"
            className="history-item"
            onClick={() => restore(original)}
          >
            <img className="history-thumb" src={original} alt="" />
            <span className="history-label">Original</span>
          </li>
        )}
      </ul>
    </aside>
  )
}
