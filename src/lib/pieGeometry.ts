import type { ElectionResult, Party, PieSlice } from './types'

const CX = 50
const CY = 50
const R = 48

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg)
  const end = polarToCartesian(cx, cy, r, endDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
}

export function buildSlices(
  results: ElectionResult[],
  partiesById: Map<string, Party>,
): PieSlice[] {
  const sorted = [...results].sort((a, b) => b.voteSharePct - a.voteSharePct)

  const top5 = sorted.slice(0, 5)
  const rest = sorted.slice(5)
  const othersFromResults = rest.reduce((sum, r) => sum + r.voteSharePct, 0)

  const sliceData: Array<{ partyId: string; pct: number }> = top5.map(r => ({
    partyId: r.partyId,
    pct: r.voteSharePct,
  }))

  const existingOthers = sliceData.find(r => r.partyId === 'OTH')
  if (existingOthers && othersFromResults > 0) {
    existingOthers.pct += othersFromResults
  } else if (othersFromResults > 0) {
    sliceData.push({ partyId: 'OTH', pct: othersFromResults })
  }

  let cursor = 0
  return sliceData.map(({ partyId, pct }) => {
    const party = partiesById.get(partyId)
    const color = party?.displayColor ?? '#9ca3af'
    const label = party?.abbreviation ?? partyId
    const sweep = (pct / 100) * 360
    const d = arcPath(CX, CY, R, cursor, cursor + sweep)
    cursor += sweep
    return { partyId, label, color, pct, d }
  })
}
