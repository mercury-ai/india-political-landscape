import { useFloating, flip, shift, offset } from '@floating-ui/react'
import type { StateViewModel } from '@/lib/types'
import { allianceToColor, ALLIANCE_LABELS } from '@/lib/colors'
import VoteSharePie from './VoteSharePie'

interface Props {
  viewModel: StateViewModel | null
  anchorEl: SVGPathElement | null
  visible: boolean
}

export default function StateInfoCard({ viewModel, anchorEl, visible }: Props) {
  const { refs, floatingStyles } = useFloating({
    elements: { reference: anchorEl as Element | null },
    placement: 'right',
    middleware: [offset(12), flip(), shift({ padding: 8 })],
  })

  if (!viewModel || !visible) return null

  const { state, government, rulingParty, election } = viewModel
  const allianceColor = allianceToColor(government.allianceTag)
  const since = government.inPowerSince.slice(0, 4)

  return (
    <div
      ref={refs.setFloating}
      style={{ ...floatingStyles, zIndex: 50, animation: 'fadeIn 0.15s ease-out' }}
      className="w-64 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden"
      role="tooltip"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: allianceColor + '22', borderBottom: `2px solid ${allianceColor}` }}
      >
        <span className="font-semibold text-white text-sm">{state.name}</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: allianceColor, color: '#fff' }}
        >
          {ALLIANCE_LABELS[government.allianceTag]}
        </span>
      </div>

      <div className="px-4 py-3 space-y-1.5">
        <div className="text-xs text-neutral-400">Ruling Party</div>
        <div className="text-sm text-white font-medium">{rulingParty.name}</div>

        {government.chiefMinister.name && (
          <>
            <div className="text-xs text-neutral-400 mt-2">Chief Minister</div>
            <div className="text-sm">
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
              <span className="text-neutral-500 text-xs ml-2">since {since}</span>
            </div>
          </>
        )}

        {election && (
          <div className="mt-3">
            <div className="text-xs text-neutral-400 mb-2">
              {election.year} Election Vote Share
            </div>
            <VoteSharePie election={election} />
          </div>
        )}

        {!election && !government.latestElectionId && (
          <div className="text-xs text-neutral-500 mt-2 italic">No election data available</div>
        )}
      </div>
    </div>
  )
}
