import { useRef } from 'react'
import type { StateViewModel } from '@/lib/types'
import { allianceToColor, ALLIANCE_LABELS } from '@/lib/colors'
import VoteSharePie from './VoteSharePie'

const CARD_WIDTH = 192
const CARD_OFFSET = 12

interface Props {
  viewModel: StateViewModel | null
  pos: { x: number; y: number } | null
  visible: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export default function StateInfoCard({ viewModel, pos, visible, onMouseEnter, onMouseLeave }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  if (!viewModel || !pos || !visible) return null

  const { state, government, rulingParty, election } = viewModel
  const allianceColor = allianceToColor(government.allianceTag)
  const since = government.inPowerSince.slice(0, 4)

  // Flip left if card would overflow right edge; shift up if near bottom
  const cardHeight = cardRef.current?.offsetHeight ?? 280
  const left =
    pos.x + CARD_OFFSET + CARD_WIDTH > window.innerWidth
      ? pos.x - CARD_OFFSET - CARD_WIDTH
      : pos.x + CARD_OFFSET
  const top =
    pos.y + cardHeight > window.innerHeight
      ? window.innerHeight - cardHeight - 8
      : pos.y

  return (
    <div
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        left,
        top,
        zIndex: 1000,
        width: CARD_WIDTH,
        animation: 'fadeIn 0.12s ease-out',
      }}
      className="rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden"
      role="tooltip"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="px-3 py-1.5 flex items-center justify-between gap-2"
        style={{ backgroundColor: allianceColor + '22', borderBottom: `2px solid ${allianceColor}` }}
      >
        <span className="font-semibold text-white text-xs truncate">{state.name}</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
          style={{ backgroundColor: allianceColor, color: '#fff' }}
        >
          {ALLIANCE_LABELS[government.allianceTag]}
        </span>
      </div>

      <div className="px-3 py-2 space-y-1">
        <div className="text-[10px] text-neutral-400 uppercase tracking-wide">Ruling Party</div>
        <div className="text-xs text-white font-medium">{rulingParty.name}</div>

        {government.chiefMinister.name && (
          <>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wide mt-1.5">Chief Minister</div>
            <div className="text-xs">
              {government.chiefMinister.wikipediaUrl ? (
                <a
                  href={government.chiefMinister.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  {government.chiefMinister.name}
                </a>
              ) : (
                <span className="text-white">{government.chiefMinister.name}</span>
              )}
              <span className="text-neutral-500 text-[10px] ml-1">since {since}</span>
            </div>
          </>
        )}

        {election && (
          <div className="mt-2">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wide mb-1">
              {election.year} Vote Share
            </div>
            <VoteSharePie election={election} />
          </div>
        )}

        {!election && !government.latestElectionId && (
          <div className="text-[10px] text-neutral-500 mt-1.5 italic">No election data available</div>
        )}
      </div>
    </div>
  )
}
