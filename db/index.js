import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL || '')

export async function listExams(limit = 50) {
  return sql`
    SELECT id, title, level, exam_year, exam_season, note, created_at, updated_at
      FROM exam
     ORDER BY exam_year DESC NULLS LAST, created_at DESC
     LIMIT ${limit}
  `
}

export async function getExam(id) {
  const rows = await sql`
    SELECT id, title, level, exam_year, exam_season, content, note,
           created_at, updated_at
      FROM exam
     WHERE id = ${id}
  `
  return rows[0] || null
}

export async function insertExam({ title, level, exam_year, exam_season, content, note }) {
  const rows = await sql`
    INSERT INTO exam (title, level, exam_year, exam_season, content, note)
    VALUES (${title}, ${level}, ${exam_year ?? null}, ${exam_season ?? null},
            ${content}, ${note ?? null})
    RETURNING id, title, level, exam_year, exam_season, created_at
  `
  return rows[0]
}

export async function updateExam(id, patch) {
  const { title, level, exam_year, exam_season, content, note } = patch
  const rows = await sql`
    UPDATE exam
       SET title      = COALESCE(${title ?? null}, title),
           level      = COALESCE(${level ?? null}, level),
           exam_year  = COALESCE(${exam_year ?? null}, exam_year),
           exam_season= COALESCE(${exam_season ?? null}, exam_season),
           content    = COALESCE(${content ?? null}, content),
           note       = COALESCE(${note ?? null}, note),
           updated_at = now()
     WHERE id = ${id}
    RETURNING id, title, level, exam_year, exam_season, updated_at
  `
  return rows[0] || null
}

export async function deleteExam(id) {
  await sql`DELETE FROM exam WHERE id = ${id}`
}

export async function searchExams(keyword, limit = 30) {
  const q = `%${keyword}%`
  return sql`
    SELECT id, title, level, exam_year, exam_season, note, created_at
      FROM exam
     WHERE title ILIKE ${q}
        OR content ILIKE ${q}
     ORDER BY exam_year DESC NULLS LAST, created_at DESC
     LIMIT ${limit}
  `
}

export default sql
