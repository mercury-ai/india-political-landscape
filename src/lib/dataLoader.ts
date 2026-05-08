import statesData from '@/data/states.json'
import governmentsData from '@/data/governments.json'
import partiesData from '@/data/parties.json'
import type { State, Government, Party, Election, StateViewModel } from './types'

export const states = statesData as State[]
export const governments = governmentsData as Government[]
export const parties = partiesData as Party[]

const partyMap = new Map<string, Party>(parties.map(p => [p.id, p]))
const governmentMap = new Map<string, Government>(governments.map(g => [g.stateId, g]))
const stateMap = new Map<string, State>(states.map(s => [s.id, s]))

export function getParty(id: string): Party | undefined {
  return partyMap.get(id)
}

export function getGovernment(stateId: string): Government | undefined {
  return governmentMap.get(stateId)
}

export function getState(stateId: string): State | undefined {
  return stateMap.get(stateId)
}

export async function getStateViewModel(stateId: string): Promise<StateViewModel | null> {
  const state = stateMap.get(stateId)
  const government = governmentMap.get(stateId)
  if (!state || !government) return null

  const rulingParty = partyMap.get(government.rulingPartyId)
  if (!rulingParty) return null

  let election: Election | null = null
  if (government.latestElectionId) {
    try {
      const mod = await import(`@/data/elections/${government.latestElectionId}.json`)
      election = mod.default as Election
    } catch {
      election = null
    }
  }

  return { state, government, rulingParty, election }
}

export function getMaxLastUpdated(): string {
  return governments.reduce((max, g) => (g.lastUpdated > max ? g.lastUpdated : max), '')
}
