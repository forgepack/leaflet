# Types API Reference

## Overview

TypeScript type definitions for the @forgepack/leaflet package components and utilities.

## Component Props Types

### CardProps

Interface for the Card component properties.

```typescript
interface CardProps {
  /** The Leaflet map instance */
  map: L.Map;
  /** Array of map layers to display in cards */
  layers: L.Layer[];
  /** Function to toggle layer visibility on the map */
  toggleFromMap: (feature: L.Layer) => void;
}
```

### CardItemProps

Interface for individual card item component properties.

```typescript
interface CardItemProps {
  /** The map layer/feature represented by this card */
  feature: L.Layer;
  /** The Leaflet map instance */
  map: L.Map;
  /** Function to toggle layer visibility on the map */
  toggleFromMap: (feature: L.Layer) => void;
}
```

### MenuProps

Interface for the Menu component properties.

```typescript
interface MenuProps {
  /** Function to start interactive route drawing mode */
  startDrawingRoute: () => void;
  /** Function to complete route drawing and create the final layer */
  finishDrawingRoute: () => void;
  /** Function to cancel route drawing mode */
  cancelDrawingRoute: () => void;
  /** Whether route drawing mode is currently active */
  isDrawingRoute: boolean;
}
```

## Utility Types

### InputProps

Interface for HandleInputFile function parameters.

```typescript
interface InputProps {
  /** File input change event */
  event: ChangeEvent<HTMLInputElement>;
  /** Leaflet map instance */
  map: L.Map;
  /** Function to add/remove layers from the map */
  toggleFromMap: (feature: L.FeatureGroup) => void;
  /** Optional function to create marker layers from coordinates */
  addMarkers?: (points: L.LatLng[]) => L.FeatureGroup;
  /** Optional function to create polygon layers from coordinates */
  addPolygon?: (points: L.LatLng[]) => L.FeatureGroup;
  /** Optional function to create polyline layers from coordinates */
  addPolyline?: (points: L.LatLng[]) => L.FeatureGroup;
  /** Optional function to create image overlay from file and bounds */
  addOverlay?: (sw: L.LatLngExpression, ne: L.LatLngExpression, file: File) => L.FeatureGroup;
}
```

## Hook Types

### UseMapReturn

Return type interface for the useMap hook containing all map functionality.

```typescript
interface UseMapReturn {
  /** The initialized Leaflet map instance, undefined during initialization */
  map: L.Map | undefined;
  /** Array of feature groups representing map layers */
  layers: L.FeatureGroup[];
  /** Function to create a new feature group from an array of layers */
  createLayer: (elements: L.Layer[]) => L.FeatureGroup;
  /** Function to create marker layers from coordinate points */
  addMarkers: (points: L.LatLng[]) => L.FeatureGroup;
  /** Function to create polygon layers from coordinate points */
  addPolygon: (points: L.LatLng[]) => L.FeatureGroup;
  /** Function to create polyline layers with distance annotations */
  addPolyline: (points: L.LatLng[]) => L.FeatureGroup;
  /** Function to create image overlay layers */
  addOverlay: (sw: L.LatLngExpression, ne: L.LatLngExpression, file: File) => L.FeatureGroup;
  /** Function to toggle layer visibility on the map */
  toggleFromMap: (layer: L.Layer) => void;
  /** Function to start interactive route drawing mode */
  startDrawingRoute: () => void;
  /** Function to complete route drawing and create the final layer */
  finishDrawingRoute: () => L.FeatureGroup | null;
  /** Function to cancel route drawing mode */
  cancelDrawingRoute: () => void;
  /** Whether route drawing mode is currently active */
  isDrawingRoute: boolean;
  /** Array of points in the current route being drawn */
  routePoints: L.LatLng[];
}
```

## Image Type Declarations

Module declarations for image file imports to enable importing image files as strings in TypeScript projects.

### PNG Images

```typescript
declare module "*.png" {
  /** The file path or data URL of the PNG image */
  const value: string;
  export default value;
}
```

### JPG Images

```typescript
declare module "*.jpg" {
  /** The file path or data URL of the JPG image */
  const value: string;
  export default value;
}
```

### JPEG Images

```typescript
declare module "*.jpeg" {
  /** The file path or data URL of the JPEG image */
  const value: string;
  export default value;
}
```

### SVG Images

```typescript
declare module "*.svg" {
  /** The file path or data URL of the SVG image */
  const value: string;
  export default value;
}
```

### GIF Images

```typescript
declare module "*.gif" {
  /** The file path or data URL of the GIF image */
  const value: string;
  export default value;
}
```

### WEBP Images

```typescript
declare module "*.webp" {
  /** The file path or data URL of the WEBP image */
  const value: string;
  export default value;
}
```

## Configuration Types

### MapConfig

Configuration object for map initialization.

```typescript
interface MapConfig {
  /** Map center coordinates */
  center: L.LatLng;
  /** Initial zoom level */
  zoom: number;
  /** Tile layer configuration */
  tileLayer: {
    /** Tile server URL pattern */
    url: string;
    /** Attribution text for the tile layer */
    attribution: string;
  };
}
```

### LayerOptions

Extended options for layer creation and styling.

```typescript
interface LayerOptions extends L.PathOptions {
  /** Custom popup content */
  popupContent?: string;
  /** Whether to show distance labels on polylines */
  showDistance?: boolean;
  /** Distance unit for calculations */
  distanceUnit?: 'nautical' | 'metric' | 'imperial';
  /** Custom marker icon */
  icon?: L.Icon;
}
```

## Event Types

### MapClickEvent

Event data for map click interactions during route drawing.

```typescript
interface MapClickEvent {
  /** Clicked coordinates */
  latlng: L.LatLng;
  /** Original Leaflet event */
  originalEvent: MouseEvent;
  /** Map container point */
  containerPoint: L.Point;
  /** Layer point */
  layerPoint: L.Point;
}
```

### FileProcessingEvent

Event data for file processing operations.

```typescript
interface FileProcessingEvent {
  /** Processed file */
  file: File;
  /** Parsed coordinates from file */
  coordinates?: L.LatLng[];
  /** Created layer from file */
  layer?: L.FeatureGroup;
  /** Processing success status */
  success: boolean;
  /** Error message if processing failed */
  error?: string;
}
```

## Utility Function Types

### DistanceCalculator

Function type for calculating distances between points.

```typescript
type DistanceCalculator = (
  from: L.LatLng, 
  to: L.LatLng, 
  unit?: 'nautical' | 'metric' | 'imperial'
) => number;
```

### CoordinateParser

Function type for parsing coordinate strings.

```typescript
type CoordinateParser = (
  coordinateString: string
) => L.LatLng | null;
```

### FileNameParser

Function type for parsing georeferenced image filenames.

```typescript
type FileNameParser = (
  filename: string
) => {
  southwest: L.LatLng;
  northeast: L.LatLng;
} | null;
```

## Extended Leaflet Types

### Enhanced FeatureGroup

Extended FeatureGroup with additional metadata.

```typescript
interface EnhancedFeatureGroup extends L.FeatureGroup {
  /** Metadata about the layer */
  metadata?: {
    /** Layer type identifier */
    type: 'markers' | 'polyline' | 'polygon' | 'overlay';
    /** Creation timestamp */
    created: Date;
    /** Source information */
    source?: 'file' | 'drawing' | 'manual';
    /** Original filename if created from file */
    filename?: string;
  };
}
```

## Usage Examples

### Component with Full Type Safety

```tsx
import React from 'react';
import { Card, useMap } from '@forgepack/leaflet';
import type { CardProps, UseMapReturn } from '@forgepack/leaflet';

const LayerManager: React.FC = () => {
  const { map, layers, toggleFromMap }: UseMapReturn = useMap();

  const cardProps: CardProps = {
    map,
    layers,
    toggleFromMap
  };

  return <Card {...cardProps} />;
};
```

### File Processing with Types

```tsx
import React from 'react';
import { HandleInputFile } from '@forgepack/leaflet';
import type { InputProps } from '@forgepack/leaflet';

const FileUploader: React.FC = () => {
  const { map, addMarkers, toggleFromMap } = useMap();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputProps: InputProps = {
      event,
      map,
      toggleFromMap,
      addMarkers
    };

    HandleInputFile(inputProps);
  };

  return (
    <input 
      type="file" 
      onChange={handleFileChange}
      accept=".txt,.jpg,.jpeg,.png,.gif"
    />
  );
};
```