import { useEffect, useRef } from 'react'
import type { StateViewModel } from '@/lib/types'
import { allianceToColor, ALLIANCE_LABELS } from '@/lib/colors'
import VoteSharePie from './VoteSharePie'

interface Props {
  viewModel: StateViewModel | null
  open: boolean
  onClose: () => void
  loading?: boolean
}

export default function StateDrawer({ viewModel, open, onClose, loading }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-neutral-900 border-t border-neutral-700 shadow-2xl"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={viewModel?.state.name ?? 'State details'}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-600" />
        </div>

        {viewModel && (
          <>
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{
                backgroundColor: allianceToColor(viewModel.government.allianceTag) + '22',
                borderBottom: `2px solid ${allianceToColor(viewModel.government.allianceTag)}`,
              }}
            >
              <span className="font-semibold text-white">{viewModel.state.name}</span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: allianceToColor(viewModel.government.allianceTag),
                  color: '#fff',
                }}
              >
                {ALLIANCE_LABELS[viewModel.government.allianceTag]}
              </span>
            </div>

            <div ref={contentRef} className="overflow-y-auto px-5 py-4 space-y-3 flex-1" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}>
              <div>
                <div className="text-xs text-neutral-400">Ruling Party</div>
                <div className="text-sm text-white font-medium mt-0.5">
                  {viewModel.rulingParty.name}
                </div>
              </div>

              {viewModel.government.chiefMinister.name && (
                <div>
                  <div className="text-xs text-neutral-400">Chief Minister</div>
                  <div className="text-sm mt-0.5">
                    {viewModel.government.chiefMinister.wikipediaUrl ? (
                      <a
                        href={viewModel.government.chiefMinister.wikipediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline underline-offset-2"
                      >
                        {viewModel.government.chiefMinister.name}
                      </a>
                    ) : (
                      <span className="text-white">{viewModel.government.chiefMinister.name}</span>
                    )}
                    <span className="text-neutral-500 text-xs ml-2">
                      since {viewModel.government.inPowerSince.slice(0, 4)}
                    </span>
                  </div>
                </div>
              )}

              {(viewModel.election || viewModel.government.latestElectionId) && (
                <div>
                  <div className="text-xs text-neutral-400 mb-2">
                    {viewModel.election
                      ? `${viewModel.election.year} Election Vote Share`
                      : 'Election Vote Share'}
                  </div>
                  <VoteSharePie election={viewModel.election} loading={loading} />
                </div>
              )}

              {!viewModel.election && !viewModel.government.latestElectionId && (
                <div className="text-xs text-neutral-500 italic">No election data available</div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
