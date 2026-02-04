# Services API Reference

## Overview

The services module provides service classes and functions for managing map data, layer persistence, and external integrations within the @forgepack/leaflet package.

## MapService

Main service class for comprehensive map management operations.

### Constructor

```typescript
class MapService {
  constructor(map: L.Map)
}
```

#### Parameters

- `map`: Leaflet map instance to manage

### Methods

#### addLayer

Add a layer to the map with metadata tracking.

```typescript
addLayer(layer: L.FeatureGroup, metadata?: LayerMetadata): string
```

**Parameters:**
- `layer`: Feature group to add to the map
- `metadata`: Optional metadata for layer tracking

**Returns:** Unique layer identifier string

**Usage:**

```typescript
import { MapService } from '@forgepack/leaflet/services'
import * as L from 'leaflet'

const mapService = new MapService(map)

const markerLayer = L.featureGroup([
  L.marker([-22.8156, -43.1078])
])

const layerId = mapService.addLayer(markerLayer, {
  type: 'markers',
  name: 'Tourist Points',
  source: 'manual'
})
```

#### removeLayer

Remove a layer from the map by identifier.

```typescript
removeLayer(layerId: string): boolean
```

**Parameters:**
- `layerId`: Unique identifier of the layer to remove

**Returns:** Success boolean

**Usage:**

```typescript
const success = mapService.removeLayer(layerId)
if (success) {
  console.log('Layer removed successfully')
}
```

#### getAllLayers

Get all managed layers with their metadata.

```typescript
getAllLayers(): Array<{
  id: string;
  layer: L.FeatureGroup;
  metadata: LayerMetadata;
}>
```

**Returns:** Array of layer objects with metadata

#### exportLayersAsGeoJSON

Export all layers as GeoJSON format.

```typescript
exportLayersAsGeoJSON(): GeoJSON.FeatureCollection
```

**Returns:** GeoJSON FeatureCollection containing all layers

**Usage:**

```typescript
const geoJsonData = mapService.exportLayersAsGeoJSON()
const dataStr = JSON.stringify(geoJsonData, null, 2)
const blob = new Blob([dataStr], { type: 'application/json' })

// Create download link
const url = URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = 'map-layers.geojson'
link.click()
```

---

## LayerStorageService

Service for persisting and loading layer data to/from various storage backends.

### Constructor

```typescript
class LayerStorageService {
  constructor(storageType: 'localStorage' | 'indexedDB' | 'file' = 'localStorage')
}
```

### Methods

#### saveLayer

Save a layer to storage with metadata.

```typescript
async saveLayer(
  layerId: string, 
  layer: L.FeatureGroup, 
  metadata: LayerMetadata
): Promise<boolean>
```

**Usage:**

```typescript
import { LayerStorageService } from '@forgepack/leaflet/services'

const storage = new LayerStorageService('localStorage')

const success = await storage.saveLayer('markers-001', markerLayer, {
  type: 'markers',
  name: 'Saved Markers',
  created: new Date(),
  source: 'file'
})
```

#### loadLayer

Load a layer from storage by identifier.

```typescript
async loadLayer(layerId: string): Promise<{
  layer: L.FeatureGroup;
  metadata: LayerMetadata;
} | null>
```

#### listSavedLayers

List all saved layers with their metadata.

```typescript
async listSavedLayers(): Promise<Array<{
  id: string;
  metadata: LayerMetadata;
}>>
```

**Usage:**

```typescript
const savedLayers = await storage.listSavedLayers()
savedLayers.forEach(({ id, metadata }) => {
  console.log(`Layer: ${metadata.name} (${id})`)
})
```

#### deleteLayer

Remove a saved layer from storage.

```typescript
async deleteLayer(layerId: string): Promise<boolean>
```

---

## FileService

Service for handling file import/export operations.

### Static Methods

#### importCoordinateFile

Import coordinates from text file.

```typescript
static async importCoordinateFile(file: File): Promise<{
  coordinates: L.LatLng[];
  metadata: {
    filename: string;
    pointCount: number;
    bounds: L.LatLngBounds;
  };
}>
```

**Usage:**

```typescript
import { FileService } from '@forgepack/leaflet/services'

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    try {
      const result = await FileService.importCoordinateFile(file)
      console.log(`Imported ${result.coordinates.length} coordinates`)
      console.log('Bounds:', result.metadata.bounds)
    } catch (error) {
      console.error('Import failed:', error)
    }
  }
}
```

#### exportCoordinatesAsCSV

Export coordinates as CSV format.

```typescript
static exportCoordinatesAsCSV(
  coordinates: L.LatLng[], 
  filename: string = 'coordinates.csv'
): void
```

#### importGeoJSON

Import layers from GeoJSON data.

```typescript
static importGeoJSON(geoJsonData: GeoJSON.FeatureCollection): L.FeatureGroup[]
```

**Usage:**

```typescript
const geoJsonData = { /* GeoJSON data */ }
const layers = FileService.importGeoJSON(geoJsonData)

layers.forEach(layer => {
  mapService.addLayer(layer)
})
```

---

## NavigationService

Service for navigation and route planning functionality.

### Static Methods

#### calculateRoute

Calculate optimal route between multiple waypoints.

```typescript
static calculateRoute(waypoints: L.LatLng[]): {
  route: L.LatLng[];
  totalDistance: number;
  estimatedTime: number; // in hours
  segments: RouteSegment[];
}
```

**Usage:**

```typescript
import { NavigationService } from '@forgepack/leaflet/services'

const waypoints = [
  L.latLng(-22.8156, -43.1078),
  L.latLng(-22.9068, -43.1729),
  L.latLng(-22.9035, -43.2096)
]

const routeInfo = NavigationService.calculateRoute(waypoints)
console.log(`Total distance: ${routeInfo.totalDistance.toFixed(2)} NM`)
console.log(`Estimated time: ${routeInfo.estimatedTime.toFixed(1)} hours`)
```

#### calculateETA

Calculate estimated time of arrival based on speed and distance.

```typescript
static calculateETA(
  distance: number, 
  speedKnots: number, 
  departureTime?: Date
): {
  eta: Date;
  travelTime: number; // in hours
}
```

**Usage:**

```typescript
const eta = NavigationService.calculateETA(15.5, 8.5) // 15.5 NM at 8.5 knots
console.log(`ETA: ${eta.eta.toLocaleString()}`)
console.log(`Travel time: ${eta.travelTime.toFixed(1)} hours`)
```

---

## WeatherService

Service for integrating weather data with map layers.

### Constructor

```typescript
class WeatherService {
  constructor(apiKey?: string, provider?: 'openweather' | 'marine')
}
```

### Methods

#### getWeatherAtPoint

Get current weather conditions at a specific coordinate.

```typescript
async getWeatherAtPoint(point: L.LatLng): Promise<WeatherData>
```

**Usage:**

```typescript
import { WeatherService } from '@forgepack/leaflet/services'

const weatherService = new WeatherService(API_KEY)

const weather = await weatherService.getWeatherAtPoint(
  L.latLng(-22.8156, -43.1078)
)

console.log(`Temperature: ${weather.temperature}°C`)
console.log(`Wind: ${weather.windSpeed} knots from ${weather.windDirection}°`)
```

#### addWeatherLayer

Add weather overlay to the map.

```typescript
async addWeatherLayer(
  map: L.Map, 
  layerType: 'precipitation' | 'wind' | 'temperature'
): Promise<L.Layer>
```

---

## TideService

Service for tidal information and predictions.

### Static Methods

#### getTideStations

Get nearby tide stations for a coordinate.

```typescript
static async getTideStations(
  point: L.LatLng, 
  radius: number = 50
): Promise<TideStation[]>
```

#### getTidePredictions

Get tide predictions for a station and date range.

```typescript
static async getTidePredictions(
  stationId: string,
  startDate: Date,
  endDate: Date
): Promise<TidePrediction[]>
```

**Usage:**

```typescript
import { TideService } from '@forgepack/leaflet/services'

const stations = await TideService.getTideStations(
  L.latLng(-22.9068, -43.1729),
  25 // 25 km radius
)

if (stations.length > 0) {
  const predictions = await TideService.getTidePredictions(
    stations[0].id,
    new Date(),
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
  )
  
  console.log(`Found ${predictions.length} tide predictions`)
}
```

---

## Interface Definitions

### LayerMetadata

```typescript
interface LayerMetadata {
  type: 'markers' | 'polyline' | 'polygon' | 'overlay';
  name: string;
  created: Date;
  source: 'file' | 'drawing' | 'manual' | 'imported';
  filename?: string;
  description?: string;
  color?: string;
  visible?: boolean;
}
```

### RouteSegment

```typescript
interface RouteSegment {
  from: L.LatLng;
  to: L.LatLng;
  distance: number;
  bearing: number;
  estimatedTime: number;
}
```

### WeatherData

```typescript
interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  conditions: string;
  timestamp: Date;
}
```

### TideStation

```typescript
interface TideStation {
  id: string;
  name: string;
  coordinates: L.LatLng;
  distance: number; // km from query point
  type: 'primary' | 'secondary';
}
```

### TidePrediction

```typescript
interface TidePrediction {
  datetime: Date;
  height: number; // meters
  type: 'high' | 'low';
}
```

## Usage Examples

### Complete Integration

```typescript
import React, { useEffect, useState } from 'react'
import { useMap } from '@forgepack/leaflet'
import { 
  MapService, 
  LayerStorageService, 
  NavigationService 
} from '@forgepack/leaflet/services'

function IntegratedMapComponent() {
  const { map, layers } = useMap()
  const [mapService, setMapService] = useState<MapService | null>(null)
  const [storage] = useState(new LayerStorageService('localStorage'))

  useEffect(() => {
    if (map) {
      const service = new MapService(map)
      setMapService(service)
      
      // Load saved layers
      loadSavedLayers(service)
    }
  }, [map])

  const loadSavedLayers = async (service: MapService) => {
    const savedLayers = await storage.listSavedLayers()
    
    for (const { id } of savedLayers) {
      const layerData = await storage.loadLayer(id)
      if (layerData) {
        service.addLayer(layerData.layer, layerData.metadata)
      }
    }
  }

  const exportData = () => {
    if (mapService) {
      const geoJson = mapService.exportLayersAsGeoJSON()
      // Handle export...
    }
  }

  return (
    <div>
      <div id="map" style={{ height: '400px' }} />
      <button onClick={exportData}>Export Layers</button>
    </div>
  )
}
```