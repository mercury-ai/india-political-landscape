import { ALLIANCE_COLORS, ALLIANCE_LABELS } from '@/lib/colors'
import type { AllianceTag } from '@/lib/types'

const ALLIANCES: AllianceTag[] = ['NDA', 'INDIA', 'OTHER']

export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-neutral-900/80 backdrop-blur-sm rounded-lg px-3 py-2.5">
      {ALLIANCES.map(tag => (
        <div key={tag} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: ALLIANCE_COLORS[tag] }}
          />
          <span className="text-xs text-neutral-300">{ALLIANCE_LABELS[tag]}</span>
        </div>
      ))}
    </div>
  )
}
