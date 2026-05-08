# Political Data — Schema & Update Guide

All political and election data for the India Political Landscape visualization lives in this directory. Data is static JSON — update manually when governments change.

---

## File Overview

| File | Purpose |
|------|---------|
| `states.json` | Master list of all 36 states and UTs |
| `governments.json` | Current ruling government per state/UT |
| `parties.json` | Party metadata (name, abbreviation, pie-chart color) |
| `elections/<ID>.json` | Latest Vidhan Sabha election results per state |

---

## states.json

Array of state/UT entries.

```ts
{
  id: string;        // ISO 3166-2:IN two-letter code (e.g. "MH", "LA")
  name: string;      // Full English name
  isUT: boolean;     // true if Union Territory
}
```

**Do not edit.** State boundaries and codes change only with parliamentary legislation.

---

## governments.json

Array of government entries — one per state/UT.

```ts
{
  stateId: string;           // matches states.json[].id
  rulingPartyId: string;     // matches parties.json[].id
  allianceTag: "NDA" | "INDIA" | "OTHER";
  inPowerSince: string;      // ISO 8601 date of current CM's swearing-in
  chiefMinister: {
    name: string;            // Full name
    wikipediaUrl: string;    // Full Wikipedia URL
  };
  latestElectionId: string | null; // e.g. "KA-2023"; null if no data
  lastUpdated: string;       // ISO date this entry was last verified
}
```

### allianceTag rules

- `"NDA"` — BJP-led National Democratic Alliance (saffron on map)
- `"INDIA"` — INDIA bloc / opposition alliance (blue on map)
- `"OTHER"` — Regional/independent/unaligned (neutral gray on map)

This field is **editorial**: set it based on the state's actual political alignment, not just the party's national default. A party may switch alliances mid-term — only update `allianceTag` here, not in `parties.json`.

**UTs without a legislature** (Ladakh, Chandigarh, A&N, Lakshadweep, D&NH and D&D) are set to `"NDA"` to reflect central government rule. Set `latestElectionId: null`.

---

## parties.json

Array of party metadata entries.

```ts
{
  id: string;           // Short unique key (e.g. "BJP", "CPIM")
  name: string;         // Full party name
  abbreviation: string; // ≤5 chars, used in pie chart legend
  displayColor: string; // Hex color for pie chart slices — must be unique
}
```

**Note:** `displayColor` is for the pie chart only and intentionally differs from alliance colors. Add a new entry whenever a new party appears in election results. All colors must be visually distinct.

---

## elections/<stateId>-<year>.json

One file per latest Vidhan Sabha election for each state that has one.

```ts
{
  id: string;      // e.g. "KA-2023" — must match filename
  stateId: string; // matches states.json[].id
  year: number;    // election year
  results: Array<{
    partyId: string;      // matches parties.json[].id
    voteSharePct: number; // 0–100
  }>;
}
```

**Validation rules:**
- `id` must equal the filename without `.json`
- All `partyId` values must exist in `parties.json`
- Sum of all `voteSharePct` must be between 99.5 and 100.5
- Use `partyId: "OTH"` only if you cannot break down the "others" vote further

---

## How to Update a Government Entry

1. Find the state in `governments.json`
2. Update `rulingPartyId`, `allianceTag`, `inPowerSince`, `chiefMinister`, and `latestElectionId` as needed
3. Set `lastUpdated` to today's ISO date (e.g. `"2025-05-09"`)
4. If this was a new election, add the election file under `elections/`
5. Verify the Wikipedia URL for the new CM still resolves

## Disputed Boundaries

Map geometry follows GoI-compliant boundaries from the Wikimedia Commons SVG. This means:
- Aksai Chin is shown within Ladakh
- Arunachal Pradesh is shown as a full Indian state
- J&K and Ladakh are shown as separate UTs (post-Oct 2019 bifurcation)

This diverges from international norms. It is intentional and documented here for transparency.
