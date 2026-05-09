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
    <div className="flex items-start gap-2">
      <svg viewBox="0 0 100 100" width={56} height={56} className="flex-shrink-0">
        {slices.map(slice => (
          <path key={slice.partyId} d={slice.d} fill={slice.color} />
        ))}
      </svg>
      <div className="flex flex-col gap-0.5 text-[10px] min-w-0 flex-1">
        {slices.map(slice => (
          <div key={slice.partyId} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-sm flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-neutral-300 truncate">{slice.label}</span>
            <span className="text-neutral-500 ml-auto pl-1">{slice.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
