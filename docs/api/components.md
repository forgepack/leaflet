# Components API Reference

## Overview

The components module provides React components for interactive map visualization and layer management using Leaflet.

## Map

Main map component that orchestrates all map-related functionality.

### Usage

```tsx
import React from 'react'
import { Map } from '@forgepack/leaflet'

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Map />
    </div>
  )
}
```

### Features

- Renders the map container
- Integrates the map hook for map management  
- Displays layer management cards
- Shows the control menu
- Handles route drawing with visual feedback

---

## Card

Card component for displaying and managing map layers with visual interface for layer management.

### Props

```typescript
interface CardProps {
  map: L.Map           // The Leaflet map instance
  layers: L.Layer[]    // Array of map layers to display in cards
  toggleFromMap: (feature: L.Layer) => void  // Function to toggle layer visibility
}
```

### Usage

```tsx
import React from 'react'
import { Card, useMap } from '@forgepack/leaflet'

function LayerManager() {
  const { map, layers, toggleFromMap } = useMap()
  
  return (
    <Card 
      map={map}
      layers={layers}
      toggleFromMap={toggleFromMap}
    />
  )
}
```

### Features

- Visual representation of active map layers
- Remove functionality for individual layers
- Automatic layer card generation
- Integrated with map layer management

---

## Menu

Menu component providing controls for map interaction and route drawing functionality.

### Props

```typescript
interface MenuProps {
  startDrawingRoute: () => void     // Function to start interactive route drawing
  finishDrawingRoute: () => void    // Function to complete route drawing
  cancelDrawingRoute: () => void    // Function to cancel route drawing
  isDrawingRoute: boolean           // Whether route drawing mode is active
}
```

### Usage

```tsx
import React from 'react'
import { Menu, useMap } from '@forgepack/leaflet'

function MapControls() {
  const { 
    startDrawingRoute, 
    finishDrawingRoute, 
    cancelDrawingRoute, 
    isDrawingRoute 
  } = useMap()
  
  return (
    <Menu 
      startDrawingRoute={startDrawingRoute}
      finishDrawingRoute={finishDrawingRoute}
      cancelDrawingRoute={cancelDrawingRoute}
      isDrawingRoute={isDrawingRoute}
    />
  )
}
```

### Features

- Interactive route drawing controls
- Start/finish/cancel route drawing modes
- Visual feedback for drawing state
- Integration with map interaction

---

## HandleInputFile

Utility function for processing coordinate files and creating map layers from uploaded files.

### Props

```typescript
interface InputProps {
  event: ChangeEvent<HTMLInputElement>                          // File input change event
  map: L.Map                                                    // Leaflet map instance
  toggleFromMap: (feature: L.FeatureGroup) => void            // Function to add/remove layers
  addMarkers?: (points: L.LatLng[]) => L.FeatureGroup         // Optional marker creation function
  addPolygon?: (points: L.LatLng[]) => L.FeatureGroup         // Optional polygon creation function
  addPolyline?: (points: L.LatLng[]) => L.FeatureGroup        // Optional polyline creation function
  addOverlay?: (sw: L.LatLngExpression, ne: L.LatLngExpression, file: File) => L.FeatureGroup  // Optional overlay function
}
```

### Usage

```tsx
import React from 'react'
import { HandleInputFile, useMap } from '@forgepack/leaflet'

function FileUploader() {
  const { 
    map, 
    addMarkers, 
    addPolyline, 
    addPolygon, 
    addOverlay, 
    toggleFromMap 
  } = useMap()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

### Supported File Types

1. **Image overlays**: Files named with pattern "swLat_swLng_neLat_neLng.ext" are treated as georeferenced images
2. **Coordinate files**: Text files containing lat/lng coordinates (space-separated, one per line)

### Features

- Automatic file type detection
- Georeferenced image overlay support
- Coordinate file parsing for markers, polygons, and polylines
- Integration with map layer management