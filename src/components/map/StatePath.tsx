import { memo } from 'react'
import type { Government } from '@/lib/types'
import { allianceToColor } from '@/lib/colors'

interface Props {
  stateId: string
  government: Government
  pathD: string
  isHovered: boolean
  onEnter: (stateId: string, el: SVGPathElement) => void
  onLeave: () => void
  onClick: (stateId: string) => void
}

const StatePath = memo(function StatePath({
  stateId,
  government,
  pathD,
  isHovered,
  onEnter,
  onLeave,
  onClick,
}: Props) {
  const fill = allianceToColor(government.allianceTag)

  return (
    <path
      d={pathD}
      fill={fill}
      fillOpacity={isHovered ? 0.85 : 0.7}
      stroke={isHovered ? '#ffffff' : '#1f2937'}
      strokeWidth={isHovered ? 1.5 : 0.5}
      style={{ transition: 'fill 0.15s, stroke 0.15s, stroke-width 0.15s, fill-opacity 0.15s', cursor: 'pointer' }}
      onPointerEnter={e => onEnter(stateId, e.currentTarget as SVGPathElement)}
      onPointerLeave={onLeave}
      onClick={() => onClick(stateId)}
      aria-label={stateId}
    />
  )
})

export default StatePath
