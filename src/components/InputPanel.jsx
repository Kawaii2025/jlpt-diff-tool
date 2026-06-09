import React from 'react'
import './InputPanel.css'

function InputPanel({ source, onSourceChange, onBuild, onSwap }) {
  return (
    <div className="input-wrap">
      <textarea
        className="source-textarea"
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        placeholder="全文档直接粘贴此处，格式：日文一行、中文一行，中间空行自动剔除"
      />
      <div className="btn-group">
        <button className="action-btn build" onClick={onBuild}>一键生成左右对照表格</button>
        <button className="action-btn swap" onClick={onSwap}>互换左右（中日切换）</button>
      </div>
    </div>
  )
}

export default InputPanel
