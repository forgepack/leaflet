# Hooks API Reference

## Overview

The hooks module provides React hooks for map management and interaction functionality.

## useMap

Custom React hook for comprehensive Leaflet map management, handling map initialization, layer management, interactive drawing, and file processing.

### Return Interface

```typescript
interface UseMapReturn {
  map: L.Map | undefined                        // The initialized Leaflet map instance, undefined during initialization
  layers: L.FeatureGroup[]                      // Array of feature groups representing map layers
  createLayer: (elements: L.Layer[]) => L.FeatureGroup          // Function to create a new feature group from an array of layers
  addMarkers: (points: L.LatLng[]) => L.FeatureGroup           // Function to create marker layers from coordinate points
  addPolygon: (points: L.LatLng[]) => L.FeatureGroup           // Function to create polygon layers from coordinate points
  addPolyline: (points: L.LatLng[]) => L.FeatureGroup          // Function to create polyline layers with distance annotations
  addOverlay: (sw: L.LatLngExpression, ne: L.LatLngExpression, file: File) => L.FeatureGroup  // Function to create image overlay layers
  toggleFromMap: (layer: L.Layer) => void      // Function to toggle layer visibility on the map
  startDrawingRoute: () => void                 // Function to start interactive route drawing mode
  finishDrawingRoute: () => L.FeatureGroup | null  // Function to complete route drawing and create the final layer
  cancelDrawingRoute: () => void                // Function to cancel route drawing mode
  isDrawingRoute: boolean                       // Whether route drawing mode is currently active
  routePoints: L.LatLng[]                      // Array of points in the current route being drawn
}
```

### Basic Usage

```tsx
import React, { useEffect } from 'react'
import { useMap } from '@forgepack/leaflet'
import * as L from 'leaflet'

function MapComponent() {
  const { map, addMarkers, toggleFromMap } = useMap()

  useEffect(() => {
    if (map) {
      // Add some initial markers when map is ready
      const points = [
        L.latLng(-22.8156, -43.1078), // Christ the Redeemer
        L.latLng(-22.9068, -43.1729), // Copacabana Beach
      ]
      const markerLayer = addMarkers(points)
      toggleFromMap(markerLayer)
    }
  }, [map])

  return <div id="map" style={{ height: '400px' }} />
}
```

### Advanced Usage with Layer Management

```tsx
import React, { useState, useEffect } from 'react'
import { useMap } from '@forgepack/leaflet'
import * as L from 'leaflet'

function AdvancedMapComponent() {
  const {
    map,
    layers,
    addMarkers,
    addPolyline,
    addPolygon,
    toggleFromMap,
    startDrawingRoute,
    finishDrawingRoute,
    cancelDrawingRoute,
    isDrawingRoute
  } = useMap()

  const [selectedPoints, setSelectedPoints] = useState<L.LatLng[]>([])

  // Create markers from selected points
  const handleCreateMarkers = () => {
    if (selectedPoints.length > 0) {
      const markerLayer = addMarkers(selectedPoints)
      toggleFromMap(markerLayer)
      setSelectedPoints([])
    }
  }

  // Create polyline from selected points
  const handleCreatePolyline = () => {
    if (selectedPoints.length >= 2) {
      const polylineLayer = addPolyline(selectedPoints)
      toggleFromMap(polylineLayer)
      setSelectedPoints([])
    }
  }

  // Create polygon from selected points
  const handleCreatePolygon = () => {
    if (selectedPoints.length >= 3) {
      const polygonLayer = addPolygon(selectedPoints)
      toggleFromMap(polygonLayer)
      setSelectedPoints([])
    }
  }

  // Handle route drawing
  const handleStartRoute = () => {
    startDrawingRoute()
  }

  const handleFinishRoute = () => {
    const routeLayer = finishDrawingRoute()
    if (routeLayer) {
      toggleFromMap(routeLayer)
    }
  }

  return (
    <div>
      <div id="map" style={{ height: '400px' }} />
      
      <div className="controls">
        <button onClick={handleCreateMarkers} disabled={selectedPoints.length === 0}>
          Create Markers ({selectedPoints.length})
        </button>
        <button onClick={handleCreatePolyline} disabled={selectedPoints.length < 2}>
          Create Route ({selectedPoints.length} points)
        </button>
        <button onClick={handleCreatePolygon} disabled={selectedPoints.length < 3}>
          Create Area ({selectedPoints.length} points)
        </button>
        
        <div className="route-controls">
          {!isDrawingRoute ? (
            <button onClick={handleStartRoute}>
              Start Drawing Route
            </button>
          ) : (
            <>
              <button onClick={handleFinishRoute}>
                Finish Route
              </button>
              <button onClick={cancelDrawingRoute}>
                Cancel Route
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="layer-info">
        <p>Active Layers: {layers.length}</p>
      </div>
    </div>
  )
}
```

### File Processing Integration

```tsx
import React from 'react'
import { useMap, HandleInputFile } from '@forgepack/leaflet'

function FileProcessingComponent() {
  const {
    map,
    addMarkers,
    addPolyline,
    addPolygon,
    addOverlay,
    toggleFromMap
  } = useMap()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <div>
      <div id="map" style={{ height: '400px' }} />
      
      <div className="file-controls">
        <label htmlFor="coordinate-file">
          Upload Coordinate File:
        </label>
        <input
          id="coordinate-file"
          type="file"
          onChange={handleFileUpload}
          accept=".txt"
        />
        
        <label htmlFor="image-overlay">
          Upload Georeferenced Image:
        </label>
        <input
          id="image-overlay"
          type="file"
          onChange={handleFileUpload}
          accept=".jpg,.jpeg,.png,.gif"
        />
      </div>
    </div>
  )
}
```

## Features

### Map Initialization

The hook automatically initializes a Leaflet map with:
- Default center at coordinates (-22.8, -43) - Rio de Janeiro area
- Default zoom level of 11
- OpenStreetMap tile layer
- Attribution control

### Layer Management

- **createLayer**: Creates new feature groups from arrays of Leaflet layers
- **toggleFromMap**: Adds or removes layers from the map
- **layers**: Tracks all active layers in state

### Marker Creation

- **addMarkers**: Creates marker layers from coordinate points
- Automatic marker styling and popup generation
- Support for custom marker icons

### Polyline Creation  

- **addPolyline**: Creates polyline layers with distance annotations
- Automatic distance calculation in nautical miles
- Distance labels displayed along the route
- Support for multi-segment routes

### Polygon Creation

- **addPolygon**: Creates polygon/area layers from coordinate points  
- Automatic area calculation
- Customizable fill and stroke styles

### Image Overlays

- **addOverlay**: Creates image overlay layers from files and bounds
- Support for georeferenced images
- Automatic bounds detection from filename patterns
- File format support: JPG, PNG, GIF

### Interactive Route Drawing

- **startDrawingRoute**: Enters interactive drawing mode
- **finishDrawingRoute**: Completes route and creates layer
- **cancelDrawingRoute**: Cancels current drawing operation
- **isDrawingRoute**: State indicator for drawing mode
- **routePoints**: Current route points being drawn

### Map Configuration

The hook uses default configuration that can be customized:

```typescript
const MAP_CONFIG = {
  center: L.latLng(-22.8, -43),  // Rio de Janeiro
  zoom: 11,
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  }
}
```

## Performance Notes

- Map instance is memoized to prevent re-initialization
- Layer operations are optimized for batch processing
- File processing is handled asynchronously
- Memory cleanup on component unmount

## Error Handling

The hook includes built-in error handling for:
- Map initialization failures
- Invalid coordinate data
- File processing errors
- Layer creation failures