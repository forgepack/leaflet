# Marker Management

Learn how to create, manage, and interact with markers on your map.

## Basic Markers

Create simple markers from coordinate arrays:

```tsx
import React from 'react'
import { useMap } from '@forgepack/leaflet'

export const BasicMarkers = () => {
  const { map, addMarkers, toggleFromMap } = useMap()

  const addPortMarkers = () => {
    const ports = [
      L.latLng(-22.8956, -43.1844), // Port of Rio
      L.latLng(-23.9608, -46.3081), // Port of Santos  
      L.latLng(-20.3155, -40.2872), // Port of Vitória
    ]
    
    const markerLayer = addMarkers(ports)
    toggleFromMap(markerLayer)
  }

  const addLighthouseMarkers = () => {
    const lighthouses = [
      L.latLng(-22.8156, -43.1078), // Sugarloaf Lighthouse
      L.latLng(-22.9068, -43.1729), // Copacabana Lighthouse
      L.latLng(-22.9519, -43.1614), // Ipanema Lighthouse
    ]
    
    const lighthouseLayer = addMarkers(lighthouses)
    toggleFromMap(lighthouseLayer)
  }

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />
      
      {map && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button onClick={addPortMarkers}>
            Add Ports
          </button>
          <button onClick={addLighthouseMarkers}>
            Add Lighthouses
          </button>
        </div>
      )}
    </div>
  )
}
```

## Markers from File Upload

Create markers by uploading coordinate files:

```tsx
import React from 'react'
import { useMap, HandleInputFile } from '@forgepack/leaflet'

export const FileMarkers = () => {
  const { map, addMarkers, toggleFromMap } = useMap()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (map) {
      await HandleInputFile({
        event,
        map,
        toggleFromMap,
        addMarkers
      })
    }
  }

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />
      
      {map && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Upload Coordinates</h3>
          <p>Select a text file with lat/lng coordinates:</p>
          <input
            type="file"
            accept=".txt,.csv"
            onChange={handleFileUpload}
            style={{ marginTop: '10px' }}
          />
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Format: One coordinate per line<br />
            Example: -22.8 -43.0
          </div>
        </div>
      )}
    </div>
  )
}
```

## Interactive Marker Creation

Let users click on the map to create markers:

```tsx
import React, { useState, useCallback } from 'react'
import { useMap } from '@forgepack/leaflet'

export const InteractiveMarkers = () => {
  const { map, addMarkers, toggleFromMap } = useMap()
  const [isAddingMarkers, setIsAddingMarkers] = useState(false)
  const [clickedPoints, setClickedPoints] = useState<L.LatLng[]>([])

  const startAddingMarkers = useCallback(() => {
    if (!map) return
    
    setIsAddingMarkers(true)
    map.getContainer().style.cursor = 'crosshair'
    
    const onMapClick = (e: L.LeafletMouseEvent) => {
      setClickedPoints(prev => [...prev, e.latlng])
    }
    
    map.on('click', onMapClick)
    
    // Store the event handler for cleanup
    ;(map as any)._clickHandler = onMapClick
  }, [map])

  const finishAddingMarkers = useCallback(() => {
    if (!map || clickedPoints.length === 0) return
    
    setIsAddingMarkers(false)
    map.getContainer().style.cursor = ''
    
    // Remove click handler
    if ((map as any)._clickHandler) {
      map.off('click', (map as any)._clickHandler)
      delete (map as any)._clickHandler
    }
    
    // Create marker layer from clicked points
    const markerLayer = addMarkers(clickedPoints)
    toggleFromMap(markerLayer)
    
    // Clear clicked points
    setClickedPoints([])
  }, [map, clickedPoints, addMarkers, toggleFromMap])

  const cancelAddingMarkers = useCallback(() => {
    if (!map) return
    
    setIsAddingMarkers(false)
    map.getContainer().style.cursor = ''
    
    // Remove click handler
    if ((map as any)._clickHandler) {
      map.off('click', (map as any)._clickHandler)
      delete (map as any)._clickHandler
    }
    
    setClickedPoints([])
  }, [map])

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />
      
      {map && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Interactive Markers</h3>
          {!isAddingMarkers ? (
            <button onClick={startAddingMarkers}>
              Start Adding Markers
            </button>
          ) : (
            <div>
              <p>Click on the map to add markers</p>
              <p>Points added: {clickedPoints.length}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={finishAddingMarkers}
                  disabled={clickedPoints.length === 0}
                >
                  Finish ({clickedPoints.length})
                </button>
                <button onClick={cancelAddingMarkers}>
                  Cancel
                </button>
              </div>
            </div>
          )}\n        </div>\n      )}\n    </div>\n  )\n}