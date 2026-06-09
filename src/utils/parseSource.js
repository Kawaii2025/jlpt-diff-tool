function parseSource(raw) {
  if (!raw) return []
  const lines = raw
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item !== '')

  const result = []
  for (let i = 0; i < lines.length; i += 2) {
    const jp = lines[i] || '缺日文'
    const cn = lines[i + 1] || '缺译文'
    result.push({ jp, cn })
  }
  return result
}

export default parseSource
