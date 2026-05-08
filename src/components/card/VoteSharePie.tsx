import { useMemo } from 'react'
import type { Election } from '@/lib/types'
import { parties } from '@/lib/dataLoader'
import { buildSlices } from '@/lib/pieGeometry'

interface Props {
  election: Election | null
  loading?: boolean
}

const partyMap = new Map(parties.map(p => [p.id, p]))

export default function VoteSharePie({ election, loading }: Props) {
  const slices = useMemo(
    () => (election ? buildSlices(election.results, partyMap) : []),
    [election],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-24 text-neutral-500 text-xs">
        Loading…
      </div>
    )
  }

  if (!election) {
    return (
      <div className="text-xs text-neutral-500 italic">No election data available</div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      <svg viewBox="0 0 100 100" width={80} height={80} className="flex-shrink-0">
        {slices.map(slice => (
          <path key={slice.partyId} d={slice.d} fill={slice.color} />
        ))}
      </svg>
      <div className="flex flex-col gap-1 text-xs">
        {slices.map(slice => (
          <div key={slice.partyId} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-neutral-300">{slice.label}</span>
            <span className="text-neutral-500 ml-auto pl-2">{slice.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
