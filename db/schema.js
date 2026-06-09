import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL || '')
const schemaPath = path.resolve('db/schema.sql')
const schema = fs.readFileSync(schemaPath, 'utf8')

await sql.unsafe(schema)
console.log('schema applied ✓')
