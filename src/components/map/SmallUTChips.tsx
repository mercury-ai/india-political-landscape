import { governments } from '@/lib/dataLoader'
import { allianceToColor } from '@/lib/colors'

const SMALL_UTS = ['DN', 'LD', 'CH', 'PY', 'AN']

const govMap = new Map(governments.map(g => [g.stateId, g]))

const UT_NAMES: Record<string, string> = {
  DN: 'D&NH & D&D',
  LD: 'Lakshadweep',
  CH: 'Chandigarh',
  PY: 'Puducherry',
  AN: 'A&N Islands',
}

interface Props {
  onSelect: (stateId: string) => void
  hoveredStateId: string | null
}

export default function SmallUTChips({ onSelect, hoveredStateId }: Props) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1.5">
      <div className="text-xs text-neutral-500 text-right mb-0.5">Small UTs</div>
      {SMALL_UTS.map(id => {
        const gov = govMap.get(id)
        if (!gov) return null
        const color = allianceToColor(gov.allianceTag)
        const isActive = hoveredStateId === id
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors"
            style={{ outline: isActive ? `2px solid ${color}` : 'none' }}
            aria-label={UT_NAMES[id]}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            {UT_NAMES[id]}
          </button>
        )
      })}
    </div>
  )
}
