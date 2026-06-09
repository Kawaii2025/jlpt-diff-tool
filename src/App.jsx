import React, { useEffect, useMemo, useState } from 'react'
import InputPanel from './components/InputPanel.jsx'
import DiffTable from './components/DiffTable.jsx'
import parseSource from './utils/parseSource.js'
import { fetchExam, fetchExamList } from './api.js'
import './components/ExamPicker.css'

function App() {
  const [source, setSource] = useState('')
  const [rows, setRows] = useState([])
  const [isSwap, setIsSwap] = useState(false)

  const [exams, setExams] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [loadingExam, setLoadingExam] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [currentExam, setCurrentExam] = useState(null)

  const [filterLevel, setFilterLevel] = useState('')
  const [filterYear, setFilterYear] = useState('')

  useEffect(() => {
    setLoadingList(true)
    fetchExamList()
      .then((data) => setExams(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingList(false))
  }, [])

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      if (filterLevel && e.level !== filterLevel) return false
      if (filterYear && String(e.exam_year) !== filterYear) return false
      return true
    })
  }, [exams, filterLevel, filterYear])

  const availableLevels = useMemo(
    () => Array.from(new Set(exams.map((e) => e.level).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [exams],
  )
  const availableYears = useMemo(
    () =>
      Array.from(new Set(exams.map((e) => e.exam_year).filter(Boolean)))
        .sort((a, b) => b - a),
    [exams],
  )

  const handleSelectExam = async (id) => {
    if (!id) {
      setSelectedId('')
      setCurrentExam(null)
      return
    }
    setLoadingExam(true)
    setError('')
    try {
      const exam = await fetchExam(id)
      setCurrentExam(exam)
      setSource(exam.content || '')
      setRows(parseSource(exam.content || ''))
      setSelectedId(id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoadingExam(false)
    }
  }

  const handleBuild = () => {
    setRows(parseSource(source))
  }

  const handleSwap = () => {
    setIsSwap((prev) => !prev)
  }

  return (
    <div className="container">
      <div className="exam-picker">
        <div className="picker-title">选择试卷</div>
        <div className="picker-row">
          <label>
            级别：
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="">全部</option>
              {availableLevels.map((lv) => (
                <option key={lv} value={lv}>{lv}</option>
              ))}
            </select>
          </label>
          <label>
            年份：
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="">全部</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            试卷：
            <select
              value={selectedId}
              onChange={(e) => handleSelectExam(e.target.value)}
              disabled={loadingList}
            >
              <option value="">-- {loadingList ? '加载中…' : '请选择试卷'} --</option>
              {filteredExams.map((e) => (
                <option key={e.id} value={e.id}>
                  [{e.level}] {e.title} {e.exam_year ? `(${e.exam_year}${e.exam_season ? '年' + e.exam_season : ''})` : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
        {currentExam && (
          <div className="exam-meta">
            已加载：<b>{currentExam.title}</b> · {currentExam.level}
            {currentExam.exam_year ? ` · ${currentExam.exam_year}年` : ''}
            {currentExam.exam_season || ''}
            {loadingExam && '（加载中…）'}
          </div>
        )}
        {error && <div className="exam-error">{error}</div>}
      </div>

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
