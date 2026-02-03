# Image Overlays

Learn how to add georeferenced images like nautical charts, satellite imagery, and custom overlays to your map.

## Basic Image Overlay

Add a georeferenced image by specifying its geographic bounds:

```tsx
import React from 'react'
import { useMap } from '@forgepack/leaflet'

export const BasicOverlay = () => {
  const { map, addOverlay, toggleFromMap } = useMap()

  const addSampleOverlay = () => {
    // Create a sample image file (in real app, this would come from user upload)
    const imageUrl = '/path/to/nautical-chart.jpg'
    
    // Convert image URL to File object for the overlay function
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'nautical-chart.jpg', { type: 'image/jpeg' })
        
        // Define geographic bounds for the image
        const southWest = L.latLng(-23.0, -43.5)  // Bottom-left corner
        const northEast = L.latLng(-22.5, -43.0)  // Top-right corner
        
        const overlayLayer = addOverlay(southWest, northEast, file)
        toggleFromMap(overlayLayer)
        
        // Fit map to show the overlay
        if (map) {
          map.fitBounds(L.latLngBounds(southWest, northEast))
        }
      })
  }

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />
      
      {map && (
        <button
          onClick={addSampleOverlay}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1000,
            padding: '10px 20px',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Sample Overlay
        </button>
      )}
    </div>
  )
}
```

## File Upload Overlays

Let users upload their own georeferenced images:

```tsx
import React from 'react'
import { useMap, HandleInputFile } from '@forgepack/leaflet'

export const FileOverlays = () => {
  const { map, addOverlay, toggleFromMap } = useMap()

  const handleOverlayUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (map) {
      await HandleInputFile({
        event,
        map,
        toggleFromMap,
        addOverlay
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
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '300px'
        }}>
          <h3>Upload Georeferenced Image</h3>
          <p>Select an image with geographic bounds in the filename:</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleOverlayUpload}
            style={{ marginTop: '10px', width: '100%' }}
          />
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <strong>Filename format:</strong><br />
            swLat_swLng_neLat_neLng.extension<br /><br />
            <strong>Example:</strong><br />
            -23.0_-43.5_-22.5_-43.0.jpg<br />
            (SW: -23.0, -43.5 | NE: -22.5, -43.0)
          </div>
        </div>
      )}
    </div>
  )
}
```

## Multiple Overlays with Management

Create a system to manage multiple overlays:

```tsx
import React, { useState } from 'react'
import { useMap } from '@forgepack/leaflet'
import * as L from 'leaflet'

interface OverlayInfo {
  id: string
  name: string
  layer: L.FeatureGroup
  bounds: L.LatLngBounds
  opacity: number
}

export const OverlayManager = () => {
  const { map, addOverlay, toggleFromMap } = useMap()
  const [overlays, setOverlays] = useState<OverlayInfo[]>([])

  const addNauticalChart = () => {
    if (!map) return
    
    // Simulate adding a nautical chart
    const bounds = L.latLngBounds(
      L.latLng(-23.2, -43.8),  // SW
      L.latLng(-22.8, -43.4)   // NE
    )
    
    // Create a mock file
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 300
    const ctx = canvas.getContext('2d')!
    
    // Draw a simple chart representation
    ctx.fillStyle = '#87CEEB'  // Sky blue background
    ctx.fillRect(0, 0, 400, 300)
    ctx.fillStyle = '#4682B4'  // Steel blue for water
    ctx.fillRect(0, 200, 400, 100)
    ctx.fillStyle = '#228B22'  // Forest green for land
    ctx.fillRect(0, 0, 400, 200)
    ctx.fillStyle = '#000'
    ctx.font = '20px Arial'
    ctx.fillText('Nautical Chart', 120, 150)
    
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'nautical-chart.png', { type: 'image/png' })
        const overlayLayer = addOverlay(bounds.getSouthWest(), bounds.getNorthEast(), file)
        
        const overlayInfo: OverlayInfo = {\n          id: Date.now().toString(),\n          name: 'Nautical Chart - Rio de Janeiro',\n          layer: overlayLayer,\n          bounds,\n          opacity: 0.8\n        }\n        \n        setOverlays(prev => [...prev, overlayInfo])\n        toggleFromMap(overlayLayer)\n      }\n    })\n  }\n\n  const addSatelliteImage = () => {\n    if (!map) return\n    \n    const bounds = L.latLngBounds(\n      L.latLng(-22.7, -43.2),  // SW\n      L.latLng(-22.5, -42.8)   // NE\n    )\n    \n    // Create a mock satellite image\n    const canvas = document.createElement('canvas')\n    canvas.width = 400\n    canvas.height = 300\n    const ctx = canvas.getContext('2d')!\n    \n    // Create gradient for satellite look\n    const gradient = ctx.createLinearGradient(0, 0, 400, 300)\n    gradient.addColorStop(0, '#2E8B57')\n    gradient.addColorStop(0.5, '#4682B4')\n    gradient.addColorStop(1, '#191970')\n    \n    ctx.fillStyle = gradient\n    ctx.fillRect(0, 0, 400, 300)\n    ctx.fillStyle = '#FFF'\n    ctx.font = '16px Arial'\n    ctx.fillText('Satellite Image', 140, 150)\n    \n    canvas.toBlob(blob => {\n      if (blob) {\n        const file = new File([blob], 'satellite.png', { type: 'image/png' })\n        const overlayLayer = addOverlay(bounds.getSouthWest(), bounds.getNorthEast(), file)\n        \n        const overlayInfo: OverlayInfo = {\n          id: Date.now().toString(),\n          name: 'Satellite Image - Coast',\n          layer: overlayLayer,\n          bounds,\n          opacity: 0.7\n        }\n        \n        setOverlays(prev => [...prev, overlayInfo])\n        toggleFromMap(overlayLayer)\n      }\n    })\n  }\n\n  const removeOverlay = (overlayInfo: OverlayInfo) => {\n    toggleFromMap(overlayInfo.layer)\n    setOverlays(prev => prev.filter(o => o.id !== overlayInfo.id))\n  }\n\n  const adjustOpacity = (overlayInfo: OverlayInfo, newOpacity: number) => {\n    // Find the image overlay in the layer\n    overlayInfo.layer.eachLayer((layer: any) => {\n      if (layer.setOpacity) {\n        layer.setOpacity(newOpacity)\n      }\n    })\n    \n    setOverlays(prev => \n      prev.map(o => \n        o.id === overlayInfo.id \n          ? { ...o, opacity: newOpacity }\n          : o\n      )\n    )\n  }\n\n  const fitToOverlay = (overlayInfo: OverlayInfo) => {\n    if (map) {\n      map.fitBounds(overlayInfo.bounds.pad(0.1))\n    }\n  }\n\n  return (\n    <div style={{ height: '100vh', position: 'relative' }}>\n      <div id=\"map\" style={{ height: '100%', width: '100%' }} />\n      \n      {map && (\n        <>\n          {/* Add Overlays Controls */}\n          <div style={{\n            position: 'absolute',\n            top: 20,\n            right: 20,\n            zIndex: 1000,\n            background: 'white',\n            padding: '15px',\n            borderRadius: '8px',\n            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'\n          }}>\n            <h3>Add Overlays</h3>\n            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>\n              <button onClick={addNauticalChart}>\n                Add Nautical Chart\n              </button>\n              <button onClick={addSatelliteImage}>\n                Add Satellite Image\n              </button>\n            </div>\n          </div>\n\n          {/* Overlay Management Panel */}\n          {overlays.length > 0 && (\n            <div style={{\n              position: 'absolute',\n              bottom: 20,\n              right: 20,\n              zIndex: 1000,\n              background: 'white',\n              padding: '15px',\n              borderRadius: '8px',\n              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',\n              maxWidth: '300px',\n              maxHeight: '400px',\n              overflowY: 'auto'\n            }}>\n              <h3>Active Overlays</h3>\n              {overlays.map(overlay => (\n                <div key={overlay.id} style={{\n                  border: '1px solid #ddd',\n                  borderRadius: '4px',\n                  padding: '10px',\n                  marginTop: '10px'\n                }}>\n                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>\n                    {overlay.name}\n                  </h4>\n                  \n                  <div style={{ marginBottom: '10px' }}>\n                    <label style={{ fontSize: '12px' }}>Opacity: {Math.round(overlay.opacity * 100)}%</label>\n                    <input\n                      type=\"range\"\n                      min=\"0\"\n                      max=\"1\"\n                      step=\"0.1\"\n                      value={overlay.opacity}\n                      onChange={(e) => adjustOpacity(overlay, parseFloat(e.target.value))}\n                      style={{ width: '100%', marginTop: '5px' }}\n                    />\n                  </div>\n                  \n                  <div style={{ display: 'flex', gap: '5px' }}>\n                    <button\n                      onClick={() => fitToOverlay(overlay)}\n                      style={{\n                        padding: '5px 10px',\n                        fontSize: '11px',\n                        background: '#3498db',\n                        color: 'white',\n                        border: 'none',\n                        borderRadius: '3px',\n                        cursor: 'pointer'\n                      }}\n                    >\n                      Zoom To\n                    </button>\n                    <button\n                      onClick={() => removeOverlay(overlay)}\n                      style={{\n                        padding: '5px 10px',\n                        fontSize: '11px',\n                        background: '#e74c3c',\n                        color: 'white',\n                        border: 'none',\n                        borderRadius: '3px',\n                        cursor: 'pointer'\n                      }}\n                    >\n                      Remove\n                    </button>\n                  </div>\n                </div>\n              ))}\n            </div>\n          )}\n        </>\n      )}\n    </div>\n  )\n}