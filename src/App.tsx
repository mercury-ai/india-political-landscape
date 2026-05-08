import { useState, useCallback, useRef, Suspense, lazy } from 'react'
import StateInfoCard from '@/components/card/StateInfoCard'
import StateDrawer from '@/components/card/StateDrawer'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getStateViewModel } from '@/lib/dataLoader'
import type { StateViewModel } from '@/lib/types'

const IndiaMap = lazy(() => import('@/components/map/IndiaMap'))

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export default function App() {
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cardViewModel, setCardViewModel] = useState<StateViewModel | null>(null)
  const [drawerViewModel, setDrawerViewModel] = useState<StateViewModel | null>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)
  const cardAnchor = useRef<SVGPathElement | null>(null)

  const handleStateHover = useCallback(async (stateId: string | null, el?: SVGPathElement) => {
    setHoveredStateId(stateId)
    if (!isTouch && stateId) {
      if (el) cardAnchor.current = el
      const vm = await getStateViewModel(stateId)
      setCardViewModel(vm)
    } else if (!stateId) {
      setCardViewModel(null)
    }
  }, [])

  const handleStateClick = useCallback(async (stateId: string) => {
    if (!isTouch) return
    setDrawerOpen(true)
    setDrawerLoading(true)
    const vm = await getStateViewModel(stateId)
    setDrawerViewModel(vm)
    setDrawerLoading(false)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <Header />
      <main className="flex-1 flex flex-col pt-[54px]" style={{ minHeight: 0 }}>
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          <Suspense fallback={<div className="flex items-center justify-center h-full text-neutral-600 text-sm">Loading map…</div>}>
            <IndiaMap
              hoveredStateId={hoveredStateId}
              onStateHover={handleStateHover}
              onStateClick={handleStateClick}
            />
          </Suspense>
          {!isTouch && cardViewModel && hoveredStateId && (
            <StateInfoCard
              viewModel={cardViewModel}
              anchorEl={cardAnchor.current}
              visible
            />
          )}
        </div>
        <Footer />
      </main>
      {isTouch && (
        <StateDrawer
          viewModel={drawerViewModel}
          open={drawerOpen}
          onClose={handleDrawerClose}
          loading={drawerLoading}
        />
      )}
    </div>
  )
}
