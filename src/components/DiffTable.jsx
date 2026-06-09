import React from 'react'
import './DiffTable.css'

function DiffTable({ rows, isSwap }) {
  const titleLeft = !isSwap ? '中文译文' : '日文原文'
  const titleRight = !isSwap ? '日文原文' : '中文译文'

  return (
    <div className="table-card">
      <table className="diff-table">
        <thead>
          <tr>
            <th className="idx">序号</th>
            <th className="colA">{titleLeft}</th>
            <th className="colB">{titleRight}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const leftTxt = !isSwap ? row.cn : row.jp
            const rightTxt = !isSwap ? row.jp : row.cn
            return (
              <tr key={idx}>
                <td className="idx">{idx + 1}</td>
                <td className="colA">{leftTxt}</td>
                <td className="colB">{rightTxt}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default DiffTable
