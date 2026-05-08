import { useCallback, useRef } from 'react'
import { STATE_PATHS } from '@/map/statePaths'
import { governments } from '@/lib/dataLoader'
import StatePath from './StatePath'
import MapLegend from './MapLegend'
import SmallUTChips from './SmallUTChips'
import type { Government } from '@/lib/types'

interface Props {
  onStateHover: (stateId: string | null, el?: SVGPathElement) => void
  onStateClick: (stateId: string) => void
  hoveredStateId: string | null
}

const govMap = new Map<string, Government>(governments.map(g => [g.stateId, g]))

export default function IndiaMap({ onStateHover, onStateClick, hoveredStateId }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  const handleEnter = useCallback((stateId: string, el: SVGPathElement) => {
    onStateHover(stateId, el)
  }, [onStateHover])

  const handleLeave = useCallback(() => {
    onStateHover(null)
  }, [onStateHover])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox="0 0 1594 1868"
        width="100%"
        height="100%"
        style={{ maxHeight: '100%' }}
        aria-label="Map of India showing political alliance control by state"
      >
        {Object.entries(STATE_PATHS).map(([stateId, pathD]) => {
          const gov = govMap.get(stateId)
          if (!gov) return null
          return (
            <StatePath
              key={stateId}
              stateId={stateId}
              government={gov}
              pathD={pathD}
              isHovered={hoveredStateId === stateId}
              onEnter={handleEnter}
              onLeave={handleLeave}
              onClick={onStateClick}
            />
          )
        })}
      </svg>
      <MapLegend />
      <SmallUTChips onSelect={onStateClick} hoveredStateId={hoveredStateId} />
    </div>
  )
}
