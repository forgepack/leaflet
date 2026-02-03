import { useEffect, useState, useCallback, useRef } from "react";
import * as L from "leaflet";

interface UseMapReturn {
    map: L.Map | undefined;
    layers: L.FeatureGroup[];
    createLayer: (elements: L.Layer[]) => L.FeatureGroup;
    addMarkers: (points: L.LatLng[]) => L.FeatureGroup;
    addPolygon: (points: L.LatLng[]) => L.FeatureGroup;
    addPolyline: (points: L.LatLng[]) => L.FeatureGroup;
    addOverlay: (sw: L.LatLngExpression, ne: L.LatLngExpression, file: File) => L.FeatureGroup;
    toggleFromMap: (layer: L.Layer) => void;
    startDrawingRoute: () => void;
    finishDrawingRoute: () => L.FeatureGroup | null;
    cancelDrawingRoute: () => void;
    isDrawingRoute: boolean;
    routePoints: L.LatLng[];
}

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

const createRouteMarker = (point: L.LatLng): L.Marker => {
    return L.marker([point.lat, point.lng], {
        icon: L.divIcon({
            // className: "route-point-marker",
            // html: '<div style="background: #3388ff; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>',
            // iconSize: [10, 10],
        })
    })
}

const createTempPolyline = (points: L.LatLng[]): L.Polyline => {
    return L.polyline(points.map(p => [p.lat, p.lng]), {
        color: '#3388ff',
        weight: 3,
        dashArray: '5, 10',
    })
}

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

export const useMap = (): UseMapReturn => {
    const [map, setMap] = useState<L.Map>();
    const [layers, setLayers] = useState<L.FeatureGroup[]>([]);
    const [isDrawingRoute, setIsDrawingRoute] = useState(false);
    const [routePoints, setRoutePoints] = useState<L.LatLng[]>([]);
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

    const createLayer = useCallback((elements: L.Layer[]): L.FeatureGroup => {
        const group = L.featureGroup(elements)
        setLayers(prev => [...prev, group])
        return group
    }, [])

    const addMarkers = useCallback((points: L.LatLng[]): L.FeatureGroup => {
        const markers = points.map(point => L.marker([point.lat, point.lng]))
        return createLayer(markers)
    }, [createLayer])

    const addPolygon = useCallback((points: L.LatLng[]): L.FeatureGroup => {
        const polygon = [L.polygon(points.map(point => [point.lat, point.lng]))]
        return createLayer(polygon)
    }, [createLayer])

    const addPolyline = useCallback((points: L.LatLng[]): L.FeatureGroup => {
        const polyline = L.polyline(points.map(p => [p.lat, p.lng]))
        const group = createLayer([polyline])
        addDistanceTooltips(group, points)
        return group
    }, [createLayer])

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