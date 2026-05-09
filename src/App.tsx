import { useState, useCallback, useRef, Suspense, lazy } from 'react'
import StateInfoCard from '@/components/card/StateInfoCard'
import StateDrawer from '@/components/card/StateDrawer'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MapLegend from '@/components/map/MapLegend'
import { getStateViewModel } from '@/lib/dataLoader'
import type { StateViewModel } from '@/lib/types'

const WorldMap = lazy(() => import('@/components/map/WorldMap'))

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export default function App() {
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null)
  const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null)
  const [cardVisible, setCardVisible] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cardViewModel, setCardViewModel] = useState<StateViewModel | null>(null)
  const [drawerViewModel, setDrawerViewModel] = useState<StateViewModel | null>(null)
  const [drawerLoading, setDrawerLoading] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const handleStateHover = useCallback(async (
    stateId: string | null,
    point?: { x: number; y: number },
  ) => {
    if (!isTouch && stateId && point) {
      clearHideTimer()
      setHoveredStateId(stateId)
      setCardPos(point)
      setCardVisible(true)
      const vm = await getStateViewModel(stateId)
      setCardViewModel(vm)
    } else if (!stateId) {
      setHoveredStateId(null)
      hideTimerRef.current = setTimeout(() => {
        setCardVisible(false)
        setCardViewModel(null)
        setCardPos(null)
      }, 200)
    }
  }, [clearHideTimer])

  const handleCardMouseEnter = useCallback(() => {
    clearHideTimer()
  }, [clearHideTimer])

  const handleCardMouseLeave = useCallback(() => {
    setCardVisible(false)
    setCardViewModel(null)
    setCardPos(null)
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
            <WorldMap
              hoveredStateId={hoveredStateId}
              onStateHover={handleStateHover}
              onStateClick={handleStateClick}
            />
          </Suspense>
          <MapLegend />
          {!isTouch && (
            <StateInfoCard
              viewModel={cardViewModel}
              pos={cardPos}
              visible={cardVisible}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
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
