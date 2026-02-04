# Installation and Setup

## 📦 Installation

```bash
# npm
npm install @forgepack/leaflet leaflet

# yarn
yarn add @forgepack/leaflet leaflet

# pnpm
pnpm add @forgepack/leaflet leaflet
```

## 📋 Dependencies

The package requires these peer dependencies:

```bash
# Required peer dependencies
npm install react react-dom leaflet

# TypeScript users also need
npm install --save-dev @types/leaflet
```

## ⚙️ Initial Setup

### 1. Basic Map Component

Start with the simplest implementation:

```tsx
// src/App.tsx
import React from 'react'
import { Map } from '@forgepack/leaflet'

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Map />
    </div>
  )
}

export default App
```

### 2. Using the Map Hook

For more control over the map functionality:

```tsx
// src/MapComponent.tsx
import React, { useEffect } from 'react'
import { useMap } from '@forgepack/leaflet'
import * as L from 'leaflet'

function MapComponent() {
  const { 
    map, 
    layers, 
    addMarkers, 
    addPolyline, 
    toggleFromMap,
    startDrawingRoute,
    finishDrawingRoute 
  } = useMap()

  useEffect(() => {
    if (map) {
      // Add some initial markers
      const points = [
        L.latLng(-22.8156, -43.1078),
        L.latLng(-22.9068, -43.1729)
      ]
      const markerLayer = addMarkers(points)
      toggleFromMap(markerLayer)
    }
  }, [map])

  return (
    <div style={{ height: '500px', position: 'relative' }}>
      {/* Map will be rendered here by the hook */}
    </div>
  )
}

export default MapComponent
```

### 3. File Input for Coordinate Data

Handle coordinate files and image overlays:

```tsx
// src/FileHandler.tsx
import React from 'react'
import { HandleInputFile } from '@forgepack/leaflet'
import { useMap } from '@forgepack/leaflet'

function FileHandler() {
  const { 
    map, 
    addMarkers, 
    addPolyline, 
    addPolygon, 
    addOverlay, 
    toggleFromMap 
  } = useMap()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (map) {
      HandleInputFile({
        event,
        map,
        toggleFromMap,
        addMarkers,
        addPolyline,
        addPolygon,
        addOverlay
      })
    }
  }

  return (
    <input 
      type="file" 
      onChange={handleFileChange}
      accept=".txt,.jpg,.jpeg,.png,.gif"
      multiple
    />
  )
}
```

### 4. Complete Example with All Components

```tsx
// src/CompleteMap.tsx
import React from 'react'
import { Map, Card, Menu } from '@forgepack/leaflet'
import { useMap } from '@forgepack/leaflet'

function CompleteMap() {
  const { 
    map, 
    layers, 
    toggleFromMap,
    startDrawingRoute,
    finishDrawingRoute,
    cancelDrawingRoute,
    isDrawingRoute 
  } = useMap()

  return (
    <div className="map-container">
      <Map />
      <Card 
        map={map} 
        layers={layers} 
        toggleFromMap={toggleFromMap} 
      />
      <Menu 
        startDrawingRoute={startDrawingRoute}
        finishDrawingRoute={finishDrawingRoute}
        cancelDrawingRoute={cancelDrawingRoute}
        isDrawingRoute={isDrawingRoute}
      />
    </div>
  )
}
```
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, createApiClient } from '@forgepack/request'
import App from './App.tsx'

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  onUnauthorized: () => window.location.href = "/login"
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider api={api}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```
