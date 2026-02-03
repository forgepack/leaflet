# Basic Map Setup

Learn how to create a basic interactive map with @forgepack/leaflet.

## Simple Map

The most basic implementation requires just the Map component:

```tsx
import React from 'react'
import { Map } from '@forgepack/leaflet'

export const BasicMap = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Map />
    </div>
  )
}
```

## Customized Container

You can customize the map container with your own styles:

```tsx
import React from 'react'
import { Map } from '@forgepack/leaflet'
import './BasicMap.css'

export const StyledMap = () => {
  return (
    <div className="map-wrapper">
      <header className="map-header">
        <h1>Maritime Navigation</h1>
        <div className="controls">
          <button>Settings</button>
          <button>Help</button>
        </div>
      </header>
      <main className="map-container">
        <Map />
      </main>
    </div>
  )
}
```

```css
/* BasicMap.css */
.map-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #2c3e50;
  color: white;
}

.map-container {
  flex: 1;
  position: relative;
}

.controls button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

## With Hook Access

Use the useMap hook for more control over the map:

```tsx
import React, { useEffect } from 'react'
import { useMap } from '@forgepack/leaflet'

export const CustomMap = () => {
  const { map, addMarkers, toggleFromMap } = useMap()

  useEffect(() => {
    if (map) {
      // Add some initial markers when map is ready
      const initialMarkers = [
        L.latLng(-22.8156, -43.1078), // Christ the Redeemer
        L.latLng(-22.9068, -43.1729), // Copacabana Beach
        L.latLng(-22.9035, -43.2096), // Sugarloaf Mountain
      ]
      
      const markerLayer = addMarkers(initialMarkers)
      toggleFromMap(markerLayer)
      
      // Fit map to show all markers
      const group = L.featureGroup(initialMarkers.map(point => L.marker(point)))
      map.fitBounds(group.getBounds().pad(0.1))
    }
  }, [map, addMarkers, toggleFromMap])

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div id="map" style={{ height: '100%', width: '100%' }} />
      
      {/* Custom overlay */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        background: 'white',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 1000
      }}>
        <h3>Rio de Janeiro POIs</h3>
        <p>Explore famous landmarks</p>
      </div>
    </div>
  )
}
```

## Responsive Design

Make your map responsive across different screen sizes:

```tsx
import React from 'react'
import { Map } from '@forgepack/leaflet'

export const ResponsiveMap = () => {
  return (
    <div className="responsive-map">
      <Map />
    </div>
  )
}
```

```css
.responsive-map {
  height: 100vh;
  width: 100%;
}

/* Mobile styles */
@media (max-width: 768px) {
  .responsive-map {
    height: calc(100vh - 60px); /* Account for mobile browser bars */
  }
  
  /* Hide menu on small screens initially */
  .menu {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .menu.open {
    transform: translateX(0);
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .cards {
    max-width: 250px;
  }
}

/* Desktop styles */
@media (min-width: 1025px) {
  .cards {
    max-width: 300px;
  }
}
```

## Map with Loading State

Show a loading indicator while the map initializes:

```tsx
import React, { useState, useEffect } from 'react'
import { useMap } from '@forgepack/leaflet'

export const MapWithLoading = () => {
  const { map } = useMap()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (map) {
      // Wait for map to be fully loaded
      map.whenReady(() => {
        setIsLoading(false)
      })
    }
  }, [map])

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p>Loading map...</p>
          </div>
        </div>
      )}
      
      <div id="map" style={{ height: '100%', width: '100%' }} />
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
```

## Next Steps

- [Marker Management](./markers.md) - Learn to work with markers and points of interest
- [Route Planning](./route-planning.md) - Create interactive routes and paths
- [Image Overlays](./image-overlays.md) - Add charts and georeferenced images