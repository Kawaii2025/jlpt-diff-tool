import 'dotenv/config'
import { insertExam } from './index.js'

const sample = `問題Ⅰ
1 番
女：お疲れ様です。
男：ありがとうございます。

2 番
女：明日、会議は何時からでしたっけ。
男：10時からですよ。

問題Ⅱ
1 番
男：そろそろ昼ご飯にしませんか。
女：いいですね。`

await insertExam({
  title: 'JLPT N1 听力样卷（示例）',
  level: 'N1',
  exam_year: 2024,
  exam_season: '7月',
  content: sample,
  note: '通过 npm run seed 自动插入的样例数据',
})

console.log('seed done')
