import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const schemaPath = path.resolve('db/schema.sql')
const schema = fs.readFileSync(schemaPath, 'utf8')

await pool.query(schema)
await pool.end()
console.log('schema applied ✓')
