import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { insertExam } from './index.js'

const filePath = process.argv[2]
if (!filePath) {
  console.error('用法: node db/import-from-file.js data/exams/N1-2025-07.txt')
  process.exit(1)
}

const absPath = path.resolve(filePath)
const fileName = path.basename(absPath, '.txt')

const match = fileName.match(/^([A-Z]\d)-(\d{4})-(\d{2})$/)
if (!match) {
  console.error('文件名格式应为: N1-2024-07.txt (级别-年份-月份)')
  process.exit(1)
}

const [, level, yearStr, monthStr] = match
const examYear = Number(yearStr)
const season = `${Number(monthStr)}月`
const content = fs.readFileSync(absPath, 'utf8')

const result = await insertExam({
  title: `JLPT ${level} ${examYear}年${season} 听力原文`,
  level,
  exam_year: examYear,
  exam_season: season,
  content,
  note: '',
})

console.log('导入成功 ✓')
console.log(JSON.stringify(result, null, 2))
