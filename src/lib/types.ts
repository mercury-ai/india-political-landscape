export type AllianceTag = 'NDA' | 'INDIA' | 'OTHER'

export interface State {
  id: string
  name: string
  isUT: boolean
}

export interface Party {
  id: string
  name: string
  abbreviation: string
  displayColor: string
}

export interface ChiefMinister {
  name: string | null
  wikipediaUrl: string | null
}

export interface Government {
  stateId: string
  rulingPartyId: string
  allianceTag: AllianceTag
  inPowerSince: string
  chiefMinister: ChiefMinister
  latestElectionId: string | null
  lastUpdated: string
}

export interface ElectionResult {
  partyId: string
  voteSharePct: number
}

export interface Election {
  id: string
  stateId: string
  year: number
  results: ElectionResult[]
}

export interface PieSlice {
  partyId: string
  label: string
  color: string
  pct: number
  d: string
}

export interface StateViewModel {
  state: State
  government: Government
  rulingParty: Party
  election: Election | null
}
