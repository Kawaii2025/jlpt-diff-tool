const API_BASE = '/api'

export async function fetchExamList() {
  const res = await fetch(`${API_BASE}/exams`)
  if (!res.ok) throw new Error(`list failed: ${res.status}`)
  return res.json()
}

export async function fetchExam(id) {
  const res = await fetch(`${API_BASE}/exams/${id}`)
  if (!res.ok) throw new Error(`load failed: ${res.status}`)
  return res.json()
}

export async function createExam(payload) {
  const res = await fetch(`${API_BASE}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`create failed: ${res.status}`)
  return res.json()
}
