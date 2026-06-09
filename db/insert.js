import 'dotenv/config'
import { insertExam } from './index.js'

const exam = {
  title: 'JLPT N1 2024年7月 听力原文',
  level: 'N1',
  exam_year: 2024,
  exam_season: '7月',
  note: '',
  content: `

問題Ⅰ
1 番
女：お疲れ様です。
男：ありがとうございます。

2 番
女：明日、会議は何時からでしたっけ。
男：10時からですよ。

問題Ⅱ
1 番
男：そろそろ昼ご飯にしませんか。
女：いいですね。

`,
}

const result = await insertExam(exam)
console.log('inserted ✓', JSON.stringify(result, null, 2))
