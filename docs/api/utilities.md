# Utilities API Reference

## Overview

The utilities module provides helper functions for coordinate processing, distance calculations, and file parsing used throughout the @forgepack/leaflet package.

## Distance Calculations

### calculateDistance

Calculate the distance between two geographic points.

```typescript
function calculateDistance(
  from: L.LatLng, 
  to: L.LatLng, 
  unit: 'nautical' | 'metric' | 'imperial' = 'nautical'
): number
```

#### Parameters

- `from`: Starting coordinate point
- `to`: Ending coordinate point  
- `unit`: Distance unit (default: 'nautical')

#### Returns

Distance as a number in the specified unit.

#### Usage

```typescript
import * as L from 'leaflet'
import { calculateDistance } from '@forgepack/leaflet/utils'

const point1 = L.latLng(-22.8156, -43.1078) // Christ the Redeemer
const point2 = L.latLng(-22.9068, -43.1729) // Copacabana Beach

const distanceNM = calculateDistance(point1, point2, 'nautical')
const distanceKM = calculateDistance(point1, point2, 'metric')
const distanceMI = calculateDistance(point1, point2, 'imperial')

console.log(`Distance: ${distanceNM.toFixed(2)} nautical miles`)
console.log(`Distance: ${distanceKM.toFixed(2)} kilometers`)
console.log(`Distance: ${distanceMI.toFixed(2)} miles`)
```

### calculateRouteDistance

Calculate the total distance for a multi-point route.

```typescript
function calculateRouteDistance(
  points: L.LatLng[], 
  unit: 'nautical' | 'metric' | 'imperial' = 'nautical'
): number
```

#### Parameters

- `points`: Array of coordinate points defining the route
- `unit`: Distance unit (default: 'nautical')

#### Returns

Total route distance as a number.

#### Usage

```typescript
import * as L from 'leaflet'
import { calculateRouteDistance } from '@forgepack/leaflet/utils'

const route = [
  L.latLng(-22.8156, -43.1078),
  L.latLng(-22.9068, -43.1729),
  L.latLng(-22.9035, -43.2096)
]

const totalDistance = calculateRouteDistance(route, 'nautical')
console.log(`Total route distance: ${totalDistance.toFixed(2)} NM`)
```

## Coordinate Processing

### parseCoordinates

Parse coordinate strings from text files.

```typescript
function parseCoordinates(text: string): L.LatLng[]
```

#### Parameters

- `text`: Raw text content containing coordinate data

#### Returns

Array of parsed L.LatLng objects.

#### Supported Formats

- Space-separated: `latitude longitude`
- Comma-separated: `latitude,longitude`
- Tab-separated: `latitude    longitude`

#### Usage

```typescript
import { parseCoordinates } from '@forgepack/leaflet/utils'

const coordinateText = `
-22.8156 -43.1078
-22.9068 -43.1729
-22.9035 -43.2096
`

const points = parseCoordinates(coordinateText)
console.log(`Parsed ${points.length} coordinate points`)
```

### formatCoordinates

Format coordinates for display or export.

```typescript
function formatCoordinates(
  point: L.LatLng, 
  format: 'decimal' | 'dms' | 'ddm' = 'decimal',
  precision: number = 6
): string
```

#### Parameters

- `point`: Coordinate point to format
- `format`: Output format (decimal degrees, degrees-minutes-seconds, degrees-decimal-minutes)
- `precision`: Decimal places for decimal format

#### Returns

Formatted coordinate string.

#### Usage

```typescript
import * as L from 'leaflet'
import { formatCoordinates } from '@forgepack/leaflet/utils'

const point = L.latLng(-22.8156, -43.1078)

console.log(formatCoordinates(point, 'decimal', 4))  // "-22.8156, -43.1078"
console.log(formatCoordinates(point, 'dms'))         // "22°48'56.2\"S, 43°06'28.1\"W"  
console.log(formatCoordinates(point, 'ddm'))         // "22°48.936'S, 43°06.468'W"
```

## File Processing

### parseImageFileName

Parse georeferenced image filenames to extract boundary coordinates.

```typescript
function parseImageFileName(filename: string): {
  southwest: L.LatLng;
  northeast: L.LatLng;
} | null
```

#### Parameters

- `filename`: Image filename following the pattern `swLat_swLng_neLat_neLng.ext`

#### Returns

Object with southwest and northeast coordinates, or null if parsing fails.

#### Usage

```typescript
import { parseImageFileName } from '@forgepack/leaflet/utils'

const filename = "-23.0_-43.5_-22.5_-43.0.jpg"
const bounds = parseImageFileName(filename)

if (bounds) {
  console.log('Southwest:', bounds.southwest)
  console.log('Northeast:', bounds.northeast)
}
```

### validateFileType

Validate if a file is supported for processing.

```typescript
function validateFileType(file: File): {
  isValid: boolean;
  type: 'coordinates' | 'image' | 'unknown';
  message?: string;
}
```

#### Parameters

- `file`: File object to validate

#### Returns

Validation result with type information.

#### Usage

```typescript
import { validateFileType } from '@forgepack/leaflet/utils'

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files
  
  if (files) {
    Array.from(files).forEach(file => {
      const validation = validateFileType(file)
      
      if (validation.isValid) {
        console.log(`File ${file.name} is a valid ${validation.type} file`)
      } else {
        console.warn(`File ${file.name} is not supported: ${validation.message}`)
      }
    })
  }
}
```

## Layer Utilities

### createCustomMarker

Create a custom marker with enhanced styling.

```typescript
function createCustomMarker(
  position: L.LatLng,
  options?: {
    icon?: L.Icon;
    popup?: string;
    color?: string;
    size?: 'small' | 'medium' | 'large';
  }
): L.Marker
```

#### Parameters

- `position`: Marker position coordinates
- `options`: Optional styling and content options

#### Returns

Configured L.Marker instance.

#### Usage

```typescript
import * as L from 'leaflet'
import { createCustomMarker } from '@forgepack/leaflet/utils'

const marker = createCustomMarker(
  L.latLng(-22.8156, -43.1078),
  {
    popup: 'Christ the Redeemer',
    color: '#ff0000',
    size: 'large'
  }
)
```

### createDistanceLabel

Create distance label markers for routes.

```typescript
function createDistanceLabel(
  position: L.LatLng,
  distance: number,
  unit: string = 'NM'
): L.Marker
```

#### Parameters

- `position`: Label position coordinates
- `distance`: Distance value to display
- `unit`: Distance unit abbreviation

#### Returns

Distance label marker.

#### Usage

```typescript
import * as L from 'leaflet'
import { createDistanceLabel } from '@forgepack/leaflet/utils'

const label = createDistanceLabel(
  L.latLng(-22.8500, -43.1400),
  5.2,
  'NM'
)
```

## Geometry Utilities

### calculateMidpoint

Calculate the midpoint between two coordinates.

```typescript
function calculateMidpoint(point1: L.LatLng, point2: L.LatLng): L.LatLng
```

#### Parameters

- `point1`: First coordinate point
- `point2`: Second coordinate point

#### Returns

Midpoint coordinates.

#### Usage

```typescript
import * as L from 'leaflet'
import { calculateMidpoint } from '@forgepack/leaflet/utils'

const start = L.latLng(-22.8156, -43.1078)
const end = L.latLng(-22.9068, -43.1729)
const midpoint = calculateMidpoint(start, end)

console.log('Midpoint:', midpoint)
```

### calculateBearing

Calculate the bearing (direction) from one point to another.

```typescript
function calculateBearing(from: L.LatLng, to: L.LatLng): number
```

#### Parameters

- `from`: Starting point
- `to`: Destination point

#### Returns

Bearing in degrees (0-360).

#### Usage

```typescript
import * as L from 'leaflet'
import { calculateBearing } from '@forgepack/leaflet/utils'

const from = L.latLng(-22.8156, -43.1078)
const to = L.latLng(-22.9068, -43.1729)
const bearing = calculateBearing(from, to)

console.log(`Bearing: ${bearing.toFixed(1)}°`)
```

## Validation Utilities

### isValidCoordinate

Validate if coordinates are within valid geographic bounds.

```typescript
function isValidCoordinate(lat: number, lng: number): boolean
```

#### Parameters

- `lat`: Latitude value
- `lng`: Longitude value

#### Returns

Boolean indicating if coordinates are valid.

#### Usage

```typescript
import { isValidCoordinate } from '@forgepack/leaflet/utils'

console.log(isValidCoordinate(-22.8156, -43.1078))  // true
console.log(isValidCoordinate(95, 200))             // false
```

### sanitizeCoordinates

Clean and validate coordinate arrays, removing invalid points.

```typescript
function sanitizeCoordinates(points: L.LatLng[]): L.LatLng[]
```

#### Parameters

- `points`: Array of coordinate points to sanitize

#### Returns

Array of valid coordinate points.

#### Usage

```typescript
import * as L from 'leaflet'
import { sanitizeCoordinates } from '@forgepack/leaflet/utils'

const mixedPoints = [
  L.latLng(-22.8156, -43.1078),  // Valid
  L.latLng(95, 200),             // Invalid
  L.latLng(-22.9068, -43.1729),  // Valid
]

const cleanPoints = sanitizeCoordinates(mixedPoints)
console.log(`Cleaned ${mixedPoints.length} to ${cleanPoints.length} valid points`)
```

## Performance Utilities

### debounce

Debounce function calls to improve performance during rapid interactions.

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void
```

#### Parameters

- `func`: Function to debounce
- `wait`: Delay in milliseconds

#### Returns

Debounced function.

#### Usage

```typescript
import { debounce } from '@forgepack/leaflet/utils'

const handleMapClick = debounce((event: L.LeafletMouseEvent) => {
  console.log('Map clicked at:', event.latlng)
}, 300)

// Use with map events
map.on('click', handleMapClick)
```

### throttle

Throttle function calls to limit execution frequency.

```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void
```

#### Parameters

- `func`: Function to throttle
- `limit`: Minimum time between executions in milliseconds

#### Returns

Throttled function.

#### Usage

```typescript
import { throttle } from '@forgepack/leaflet/utils'

const handleMapMove = throttle(() => {
  console.log('Map moved')
}, 100)

// Use with map events
map.on('move', handleMapMove)
```