# India Political Landscape

An interactive map of India showing which alliance controls each state government, the Chief Minister, and latest Vidhan Sabha election vote shares.

## Features

- Choropleth map coloured by alliance (NDA / INDIA Alliance / Other & Regional)
- Hover a state (desktop) to see a floating info card with CM details and vote share pie chart
- Tap a state (mobile) to open a bottom drawer with the same information
- Small UT chip list for territories too small to tap on the map

## Data update guide

All data lives under `src/data/`. Edit these files to update the map:

- **`src/data/governments.json`** — current ruling party, alliance, CM name/Wikipedia URL, `inPowerSince`, `latestElectionId`
- **`src/data/elections/*.json`** — vote share per party for each election
- **`src/data/parties.json`** — add new parties here before referencing them in election files

After editing, bump the `lastUpdated` field in `governments.json` for any changed states.

## Map source & attribution

Map geometry is derived from **Political map of India** on Wikimedia Commons:  
https://commons.wikimedia.org/wiki/File:Political_map_of_India_EN.svg  
Licensed under CC BY-SA 3.0.

The SVG is downloaded to `scripts/india-states-source.svg` and path data is extracted via:

```
npm run extract-paths
```

This regenerates `src/map/statePaths.ts`. Do not edit that file manually.

## Disputed boundaries policy

This map follows the Government of India's official position:

- Aksai Chin is shown as part of **Ladakh** (India's claimed territory)
- All of **Arunachal Pradesh** is shown as an Indian state
- **Jammu & Kashmir** and **Ladakh** are shown as separate Union Territories (post-2019 reorganisation)

The boundary depictions follow the source SVG (Wikimedia Commons, CC BY-SA 3.0), which is broadly aligned with the Survey of India's published maps.

## Development

```bash
npm install
npm run dev        # start Vite dev server
npm run build      # production build
npm run preview    # preview the production build
```

Requires Node.js 18+.

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).

Enable Pages in your repository settings: **Settings → Pages → Source: GitHub Actions**.
