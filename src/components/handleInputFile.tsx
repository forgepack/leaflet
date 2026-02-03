/**
 * @fileoverview Handle file input utility for processing coordinate files and creating map layers.
 * Supports text files with coordinate data and image overlays with specific naming conventions.
 */

import type { ChangeEvent } from "react"
import * as L from "leaflet";

/**
 * @interface InputProps
 * @description Properties for the HandleInputFile function
 */
type InputProps = {
    /** File input change event */
    event: ChangeEvent<HTMLInputElement>
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

/**
 * @function HandleInputFile
 * @description Processes uploaded files to create map layers.
 * 
 * Supports two types of file processing:
 * 1. **Image overlays**: Files named with pattern "swLat_swLng_neLat_neLng.ext" 
 *    are treated as georeferenced images and added as overlays.
 * 2. **Coordinate files**: Text files containing lat/lng coordinates (space-separated, one per line)
 *    are parsed and converted to markers, polygons, or polylines.
 * 
 * @param {InputProps} props - Function parameters
 * @param {ChangeEvent<HTMLInputElement>} props.event - File input change event
 * @param {Function} props.toggleFromMap - Function to add layer to map
 * @param {Function} [props.addMarkers] - Optional marker creation function
 * @param {Function} [props.addPolygon] - Optional polygon creation function  
 * @param {Function} [props.addPolyline] - Optional polyline creation function
 * @param {Function} [props.addOverlay] - Optional overlay creation function
 * 
 * @returns {Promise<L.LatLng[]>} Array of parsed coordinates from the file
 * 
 * @example
 * ```tsx
 * // Handle coordinate file
 * const coords = await HandleInputFile({
 *   event: fileInputEvent,
 *   map: mapInstance,
 *   toggleFromMap: addLayerToMap,
 *   addMarkers: createMarkerLayer
 * });
 * 
 * // Handle image overlay with bounds in filename
 * // File: "-22.5_-43.5_-22.0_-43.0.jpg"
 * await HandleInputFile({
 *   event: fileInputEvent, 
 *   map: mapInstance,
 *   toggleFromMap: addLayerToMap,
 *   addOverlay: createImageOverlay
 * });
 * ```
 */
export const HandleInputFile = async ({ event, toggleFromMap, addMarkers, addPolygon, addPolyline, addOverlay }: InputProps): Promise<L.LatLng[]> => {
    const file = event.target.files?.[0]
    if (!file) return []
    const [swLat, swLng, neLat, neLng] = file.name.replace(/\.[^/.]+$/, "").split("_").map(parseFloat);
    if (addOverlay && !isNaN(swLat) && !isNaN(swLng) && !isNaN(neLat) && !isNaN(neLng)) {
        const sw = L.latLng(swLat, swLng);
        const ne = L.latLng(neLat, neLng);
        addOverlay && toggleFromMap(addOverlay(sw, ne, file));
    }
    try {
        const text: string = await file.text()
        const coords: L.LatLng[] = text
            .split(/\r?\n/) // separa linhas
            .map(line => line.trim()) // remove espaços em branco no início e fim da string
            .filter(line => line.length > 0) // ignora linhas vazias
            .map(line => {
                const [lat, lng] = line.split(/\s+/).map(parseFloat) // separa lat e lng por espaço
                return !isNaN(lat) && !isNaN(lng) ? L.latLng(lat, lng) : null
            })
            .filter((coord): coord is L.LatLng => coord !== null)
        addMarkers && toggleFromMap(addMarkers(coords))
        addPolygon && toggleFromMap(addPolygon(coords))
        addPolyline && toggleFromMap(addPolyline(coords))
        return coords
    } catch (error) {
        return []
    }
}