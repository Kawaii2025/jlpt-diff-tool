import React, { useState } from 'react'
import InputPanel from './components/InputPanel.jsx'
import DiffTable from './components/DiffTable.jsx'
import parseSource from './utils/parseSource.js'

function App() {
  const [source, setSource] = useState('')
  const [rows, setRows] = useState([])
  const [isSwap, setIsSwap] = useState(false)

  const handleBuild = () => {
    setRows(parseSource(source))
  }

  const handleSwap = () => {
    setIsSwap((prev) => !prev)
  }

  return (
    <div className="container">
      <InputPanel
        source={source}
        onSourceChange={setSource}
        onBuild={handleBuild}
        onSwap={handleSwap}
      />
      <DiffTable rows={rows} isSwap={isSwap} />
    </div>
  )
}

export default App
