import 'dotenv/config'
import { Pool } from '@neondatabase/serverless'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    console.log('→ 删掉旧的普通 slug 列（如存在）')
    await client.query(`ALTER TABLE exam DROP COLUMN IF EXISTS slug CASCADE`)

    console.log('→ 新增 GENERATED 列 slug（数据库自动生成 n1-2025-07）')
    await client.query(`
      ALTER TABLE exam
      ADD COLUMN slug TEXT GENERATED ALWAYS AS (
        LOWER(level) || '-' || exam_year::TEXT
        || '-' || LPAD(REGEXP_REPLACE(COALESCE(exam_season, ''), '[^0-9]', '', 'g'), 2, '0')
      ) STORED
    `)

    console.log('→ 给 slug 加唯一索引')
    try {
      await client.query(`CREATE UNIQUE INDEX idx_exam_slug ON exam (slug)`)
    } catch (e) {
      if (String(e.message).includes('already exists')) {
        console.log('  （索引已存在，跳过）')
      } else {
        throw e
      }
    }

    await client.query('COMMIT')
    console.log('✓ migration 完成')

    const { rows } = await pool.query(
      'SELECT id, slug, title, level, exam_year, exam_season FROM exam ORDER BY id'
    )
    console.log('\n当前库里所有试卷：')
    rows.forEach((r) => console.log(' ', r.id, r.slug, '-', r.title))
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('migration 失败（已回滚）：', e.message)
  } finally {
    client.release()
    await pool.end()
  }
}

main()
