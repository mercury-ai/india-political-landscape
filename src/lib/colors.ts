import type { AllianceTag } from './types'
import { getParty } from './dataLoader'

export const ALLIANCE_COLORS: Record<AllianceTag, string> = {
  NDA: '#f97316',
  INDIA: '#2563eb',
  OTHER: '#6b7280',
}

export const ALLIANCE_LABELS: Record<AllianceTag, string> = {
  NDA: 'NDA',
  INDIA: 'INDI Alliance',
  OTHER: 'Other / Regional',
}

export function allianceToColor(tag: AllianceTag): string {
  return ALLIANCE_COLORS[tag]
}

export function partyToColor(partyId: string): string {
  const party = getParty(partyId)
  return party?.displayColor ?? '#9ca3af'
}
