import 'dotenv/config'
import { listExams } from './index.js'

const rows = await listExams(100)
console.log(JSON.stringify(rows, null, 2))
