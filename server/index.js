import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Pool } from '@neondatabase/serverless'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.get('/api/exams', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, slug, title, level, exam_year, exam_season, note,
             created_at, updated_at
        FROM exam
       ORDER BY exam_year DESC NULLS LAST,
                ARRAY_POSITION(ARRAY['N1','N2','N3','N4','N5'], level) ASC,
                created_at DESC
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'failed to list exams' })
  }
})

app.get('/api/exams/meta', async (req, res) => {
  try {
    const { rows: levels } = await pool.query(`
      SELECT DISTINCT level FROM exam ORDER BY ARRAY_POSITION(ARRAY['N1','N2','N3','N4','N5'], level) ASC
    `)
    const { rows: years } = await pool.query(`
      SELECT DISTINCT exam_year FROM exam WHERE exam_year IS NOT NULL ORDER BY exam_year DESC
    `)
    res.json({
      levels: levels.map((r) => r.level),
      years: years.map((r) => r.exam_year),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'failed to load meta' })
  }
})

app.get('/api/exams/:idOrSlug', async (req, res) => {
  try {
    const key = req.params.idOrSlug
    const isNumeric = /^\d+$/.test(key)
    const sql = isNumeric
      ? `SELECT id, slug, title, level, exam_year, exam_season, content,
                note, created_at, updated_at
           FROM exam WHERE id = $1`
      : `SELECT id, slug, title, level, exam_year, exam_season, content,
                note, created_at, updated_at
           FROM exam WHERE slug = $1`

    const { rows } = await pool.query(sql, [key])
    if (!rows.length) return res.status(404).json({ error: 'not found' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'failed to load exam' })
  }
})

app.post('/api/exams', async (req, res) => {
  try {
    const { title, level, exam_year, exam_season, content, note } = req.body || {}
    if (!title || !level || !content) {
      return res.status(400).json({ error: 'title / level / content required' })
    }
    const { rows } = await pool.query(
      `INSERT INTO exam (title, level, exam_year, exam_season, content, note)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, slug, title, level, exam_year, exam_season, created_at`,
      [title, level, exam_year ?? null, exam_season ?? null, content, note ?? null],
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'failed to insert exam' })
  }
})

const distDir = path.resolve(__dirname, '..', 'dist')
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  express.static(distDir)(req, res, next)
})
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distDir, 'index.html'))
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`api server listening on http://localhost:${PORT}`)
})
