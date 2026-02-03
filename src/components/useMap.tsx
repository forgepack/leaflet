/**
 * @fileoverview Custom React hook for comprehensive Leaflet map management.
 * Handles map initialization, layer management, interactive drawing, and file processing.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import * as L from "leaflet";

/**
 * @interface UseMapReturn
 * @description Return type for the useMap hook containing all map functionality
 */
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

/**
 * @constant MAP_CONFIG
 * @description Default configuration for map initialization
 * @private
 */
const MAP_CONFIG = {
    center: L.latLng(-22.8, -43),
    zoom: 11,
    tileLayer: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        options: {
            attribution: "Tiles &copy; Esri &mdash; Sources: Esri, Maxar, Earthstar, etc.",
            className: "map-tiles",
            minZoom: 2,
        }
    }
}

/**
 * @function createRouteMarker
 * @description Creates a marker for route points during interactive drawing
 * @param {L.LatLng} point - The coordinate point for the marker
 * @returns {L.Marker} Configured marker instance
 * @private
 */
const createRouteMarker = (point: L.LatLng): L.Marker => {
    return L.marker([point.lat, point.lng], {
        icon: L.divIcon({
            // className: "route-point-marker",
            // html: '<div style="background: #3388ff; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>',
            // iconSize: [10, 10],
        })
    })
}

/**
 * @function createTempPolyline
 * @description Creates a temporary dashed polyline for route preview during drawing
 * @param {L.LatLng[]} points - Array of coordinate points
 * @returns {L.Polyline} Styled temporary polyline
 * @private
 */
const createTempPolyline = (points: L.LatLng[]): L.Polyline => {
    return L.polyline(points.map(p => [p.lat, p.lng]), {
        color: '#3388ff',
        weight: 3,
        dashArray: '5, 10',
    })
}

/**
 * @function addDistanceTooltips
 * @description Adds distance labels between consecutive points on a route
 * @param {L.FeatureGroup} group - Feature group to add distance labels to
 * @param {L.LatLng[]} points - Array of route points
 * @private
 */
const addDistanceTooltips = (group: L.FeatureGroup, points: L.LatLng[]) => {
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const distanceNM = p1.distanceTo(p2) / 1852;
        const mid = L.latLng((p1.lat + p2.lat) / 2, (p1.lng + p2.lng) / 2);

        const label = L.marker(mid, {
            icon: L.divIcon({
                className: "distance-label",
                html: `<span>${distanceNM.toFixed(2)} NM</span>`,
                iconSize: [0, 0],
            }),
        });

        group.addLayer(label);
    }
}

/**
 * @hook useMap
 * @description Comprehensive React hook for Leaflet map management and interaction.
 * 
 * Features provided:
 * - **Map Initialization**: Creates and configures Leaflet map with satellite imagery
 * - **Layer Management**: Create, add, remove, and toggle various layer types
 * - **Interactive Drawing**: Point-and-click route creation with real-time preview
 * - **File Processing**: Handle coordinate files and image overlays
 * - **Distance Calculation**: Automatic distance labeling for routes
 * 
 * @returns {UseMapReturn} Object containing map instance and all management functions
 * 
 * @example
 * ```tsx
 * function MapComponent() {
 *   const {
 *     map,
 *     layers,
 *     addMarkers,
 *     toggleFromMap,
 *     startDrawingRoute,
 *     isDrawingRoute
 *   } = useMap();
 * 
 *   return (
 *     <div>
 *       <div id="map"></div>
 *       {map && (
 *         <button onClick={() => {
 *           const coords = [L.latLng(-22.8, -43), L.latLng(-22.9, -43.1)];
 *           const markerLayer = addMarkers(coords);
 *           toggleFromMap(markerLayer);
 *         }}>
 *           Add Markers
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useMap = (): UseMapReturn => {
    // State management
    const [map, setMap] = useState<L.Map>();
    const [layers, setLayers] = useState<L.FeatureGroup[]>([]);
    const [isDrawingRoute, setIsDrawingRoute] = useState(false);
    const [routePoints, setRoutePoints] = useState<L.LatLng[]>([]);
    
    // Refs for cleanup and event handling
    const tempRouteLayerRef = useRef<L.FeatureGroup | null>(null);
    const clickHandlerRef = useRef<((e: L.LeafletMouseEvent) => void) | null>(null);

    useEffect(() => {
        if (map) return;
        const initializeMap = (): L.Map => {
            const mapInstance = L.map("map").setView(MAP_CONFIG.center, MAP_CONFIG.zoom)
            L.tileLayer(MAP_CONFIG.tileLayer.url, MAP_CONFIG.tileLayer.options).addTo(mapInstance)
            return mapInstance
        }
        const mapInstance = initializeMap();
        setMap(mapInstance)
        return () => {
            mapInstance.remove()
        }
    }, [])

    /**
     * @function createLayer
     * @description Creates a new feature group from an array of Leaflet layers and adds it to the layer state
     * @param {L.Layer[]} elements - Array of Leaflet layers to group
     * @returns {L.FeatureGroup} The created feature group
     */
    const createLayer = useCallback((elements: L.Layer[]): L.FeatureGroup => {
        const group = L.featureGroup(elements)
        setLayers(prev => [...prev, group])
        return group
    }, [])

    /**
     * @function addMarkers
     * @description Creates marker layers from coordinate points
     * @param {L.LatLng[]} points - Array of coordinate points
     * @returns {L.FeatureGroup} Feature group containing all markers
     */
    const addMarkers = useCallback((points: L.LatLng[]): L.FeatureGroup => {
        const markers = points.map(point => L.marker([point.lat, point.lng]))
        return createLayer(markers)
    }, [createLayer])

    /**
     * @function addPolygon
     * @description Creates a polygon layer from coordinate points
     * @param {L.LatLng[]} points - Array of coordinate points defining the polygon boundary
     * @returns {L.FeatureGroup} Feature group containing the polygon
     */
    const addPolygon = useCallback((points: L.LatLng[]): L.FeatureGroup => {
        const polygon = [L.polygon(points.map(point => [point.lat, point.lng]))]
        return createLayer(polygon)
    }, [createLayer])

    /**
     * @function addPolyline
     * @description Creates a polyline layer with automatic distance annotations between points
     * @param {L.LatLng[]} points - Array of coordinate points defining the line
     * @returns {L.FeatureGroup} Feature group containing the polyline and distance labels
     */
    const addPolyline = useCallback((points: L.LatLng[]): L.FeatureGroup => {
        const polyline = L.polyline(points.map(p => [p.lat, p.lng]))
        const group = createLayer([polyline])
        addDistanceTooltips(group, points)
        return group
    }, [createLayer])

    /**
     * @function addOverlay
     * @description Creates an image overlay layer from a file with specified geographic bounds
     * @param {L.LatLngExpression} sw - Southwest corner coordinates
     * @param {L.LatLngExpression} ne - Northeast corner coordinates  
     * @param {File} file - Image file to overlay
     * @returns {L.FeatureGroup} Feature group containing the image overlay
     */
    const addOverlay = useCallback(( sw: L.LatLngExpression, ne: L.LatLngExpression, file: File ): L.FeatureGroup => {
        const url = URL.createObjectURL(file);
        const overlay = L.imageOverlay(url, L.latLngBounds(sw, ne), {
            opacity: 0.6,
            errorOverlayUrl: "https://cdn-icons-png.flaticon.com/512/110/110686.png",
            alt: "Overlay image",
        })
        return createLayer([overlay])
    }, [createLayer])

    const cleanupRouteDrawing = useCallback((mapInstance: L.Map) => {
        if (clickHandlerRef.current) {
            mapInstance.off('click', clickHandlerRef.current)
            clickHandlerRef.current = null
        }
        mapInstance.getContainer().style.cursor = ''
        if (tempRouteLayerRef.current) {
            try {
                mapInstance.removeLayer(tempRouteLayerRef.current)
            } catch (e) {
                console.error("Erro ao remover layer:", e)
            }
            tempRouteLayerRef.current = null
        }
    }, []);

    const cancelDrawingRoute = useCallback(() => {
        if (!map) return;
        cleanupRouteDrawing(map)
        setIsDrawingRoute(false)
        setRoutePoints([])
    }, [map, cleanupRouteDrawing])

    /**
     * @function toggleFromMap
     * @description Toggles layer visibility on the map and manages layer state
     * @param {L.Layer} layer - The layer to toggle
     */
    const toggleFromMap = useCallback((layer: L.Layer) => {
        if (!map) return
        if (map.hasLayer(layer)) {
            map.removeLayer(layer)
            setLayers(prev => prev.filter(l => l !== layer))
            if (isDrawingRoute) {
                cancelDrawingRoute()
            }
        } else {
            map.addLayer(layer)
            if ((layer as any).getBounds) {
                map.fitBounds((layer as any).getBounds())
            }
        }
    }, [map, isDrawingRoute, cancelDrawingRoute])

    /**
     * @function updateTempRoute
     * @description Updates the temporary route preview during interactive drawing
     * @param {L.LatLng[]} points - Current array of route points
     * @private
     */
    const updateTempRoute = useCallback((points: L.LatLng[]) => {
        if (!map) return
        if (tempRouteLayerRef.current) {
            map.removeLayer(tempRouteLayerRef.current)
        }
        if (points.length === 0) {
            tempRouteLayerRef.current = null
            return
        }
        const tempGroup = L.featureGroup()
        points.forEach(point => {
            tempGroup.addLayer(createRouteMarker(point))
        });
        if (points.length >= 2) {
            tempGroup.addLayer(createTempPolyline(points))
        }
        tempGroup.addTo(map)
        tempRouteLayerRef.current = tempGroup
    }, [map])

    /**
     * @function startDrawingRoute
     * @description Initiates interactive route drawing mode
     * 
     * Sets up:
     * - Crosshair cursor
     * - Map click event listener
     * - Drawing state management
     */
    const startDrawingRoute = useCallback(() => {
        if (!map) return
        setIsDrawingRoute(true)
        setRoutePoints([])
        map.getContainer().style.cursor = 'crosshair'
        const onMapClick = (e: L.LeafletMouseEvent) => {
            setRoutePoints(prev => {
                const newPoints = [...prev, e.latlng]
                updateTempRoute(newPoints)
                return newPoints
            })
        }
        clickHandlerRef.current = onMapClick
        map.on('click', onMapClick)
    }, [map, updateTempRoute])

    /**
     * @function finishDrawingRoute
     * @description Completes route drawing and creates the final polyline layer
     * 
     * - Validates minimum point requirement (2 points)
     * - Cleans up temporary drawing state
     * - Creates permanent route layer with distance annotations
     * - Automatically adds to map and fits bounds
     * 
     * @returns {L.FeatureGroup | null} The created route layer or null if insufficient points
     */
    const finishDrawingRoute = useCallback((): L.FeatureGroup | null => {
        if (!map || routePoints.length < 2) {
            return null
        }
        cleanupRouteDrawing(map)
        // Cria polyline definitiva
        const routeLayer = addPolyline(routePoints)
        // Adiciona automaticamente ao mapa e ajusta visualização
        map.addLayer(routeLayer)
        if (routeLayer.getBounds) {
            map.fitBounds(routeLayer.getBounds())
        }
        // Reset estado
        setIsDrawingRoute(false)
        setRoutePoints([])
        return routeLayer
    }, [map, routePoints, cleanupRouteDrawing, addPolyline])

    return {
        map,
        layers,
        createLayer,
        addMarkers,
        addPolygon,
        addPolyline,
        addOverlay,
        toggleFromMap,
        startDrawingRoute,
        finishDrawingRoute,
        cancelDrawingRoute,
        isDrawingRoute,
        routePoints,
    }
}