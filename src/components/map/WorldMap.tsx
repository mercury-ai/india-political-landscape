import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { Feature, GeoJsonObject } from 'geojson'
import { governments } from '@/lib/dataLoader'
import { allianceToColor } from '@/lib/colors'
import type { Government } from '@/lib/types'

interface Props {
  onStateHover: (stateId: string | null, point?: { x: number; y: number }) => void
  onStateClick: (stateId: string) => void
  hoveredStateId: string | null
}

const govMap = new Map<string, Government>(governments.map(g => [g.stateId, g]))

const CARTO_URL = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

// Pre-render polygons far outside the viewport so panning never shows
// uncolored "loading" gaps. padding: N means N viewports of buffer on each side.
// India fits comfortably within a padded area at any reasonable zoom level.
const POLYGON_RENDERER = L.svg({ padding: 5 })

const DEFAULT_STYLE = (stateId: string): L.PathOptions => ({
  fillColor: stateColor(stateId),
  fillOpacity: 0.7,
  color: '#374151',
  weight: 0.8,
})

const HOVER_STYLE: L.PathOptions = {
  fillOpacity: 0.9,
  color: '#ffffff',
  weight: 2,
}

function stateColor(stateId: string): string {
  const gov = govMap.get(stateId)
  return gov ? allianceToColor(gov.allianceTag) : '#4b5563'
}

function styleFeature(feature?: Feature): L.PathOptions {
  const id = feature?.properties?.state_id as string | undefined
  return id ? DEFAULT_STYLE(id) : { fillColor: '#4b5563', fillOpacity: 0.7, color: '#374151', weight: 0.8 }
}

interface ActiveHover {
  layer: L.Path
  stateId: string
}

function MapMouseLeaveHandler({ onLeave }: { onLeave: () => void }) {
  useMapEvents({
    mouseout: e => {
      // Only trigger if mouse leaves the map container entirely
      // (Leaflet fires this when leaving the map div)
      const target = e.originalEvent?.relatedTarget as Element | null
      const mapEl = e.target.getContainer()
      if (!target || !mapEl.contains(target)) {
        onLeave()
      }
    },
  })
  return null
}

export default function WorldMap({ onStateHover, onStateClick, hoveredStateId: _ }: Props) {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null)
  const activeRef = useRef<ActiveHover | null>(null)
  const pendingLeaveRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelPendingLeave = () => {
    if (pendingLeaveRef.current !== null) {
      clearTimeout(pendingLeaveRef.current)
      pendingLeaveRef.current = null
    }
  }

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}india-states.geojson`)
      .then(r => r.json())
      .then(setGeoData)
  }, [])

  const clearActive = () => {
    if (activeRef.current) {
      activeRef.current.layer.setStyle(DEFAULT_STYLE(activeRef.current.stateId))
      activeRef.current = null
    }
  }

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    const stateId = feature.properties?.state_id as string | undefined
    if (!stateId) return
    const path = layer as L.Path

    layer.on('mouseover', (e: L.LeafletMouseEvent) => {
      cancelPendingLeave()
      // If a different state is currently active, reset it first
      if (activeRef.current && activeRef.current.layer !== path) {
        activeRef.current.layer.setStyle(DEFAULT_STYLE(activeRef.current.stateId))
      }
      activeRef.current = { layer: path, stateId }
      path.setStyle(HOVER_STYLE)
      path.bringToFront()
      onStateHover(stateId, { x: e.containerPoint.x, y: e.containerPoint.y })
    })

    layer.on('mouseout', () => {
      // Only act if this layer is still the active one
      if (activeRef.current?.layer === path) {
        path.setStyle(DEFAULT_STYLE(stateId))
        activeRef.current = null
        // Debounce the null signal so moving between small island polygons
        // (Andaman & Nicobar, Lakshadweep) doesn't flash the card away
        pendingLeaveRef.current = setTimeout(() => {
          pendingLeaveRef.current = null
          onStateHover(null)
        }, 150)
      }
    })

    layer.on('click', () => {
      onStateClick(stateId)
    })
  }

  const handleMapLeave = () => {
    cancelPendingLeave()
    clearActive()
    onStateHover(null)
  }

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <MapContainer
        center={[22, 78]}
        zoom={5}
        style={{ width: '100%', height: '100%', background: '#0f0f0f' }}
        zoomControl
        renderer={POLYGON_RENDERER}
      >
        <TileLayer
          url={CARTO_URL}
          attribution={CARTO_ATTRIBUTION}
          subdomains="abcd"
          maxZoom={19}
        />
        <MapMouseLeaveHandler onLeave={handleMapLeave} />
        {geoData && (
          <GeoJSON
            key="india-states"
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  )
}
