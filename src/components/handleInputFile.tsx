import type { ChangeEvent } from "react"
import * as L from "leaflet";

type InputProps = {
    event: ChangeEvent<HTMLInputElement>
    map: L.Map;
    toggleFromMap: (feature: L.FeatureGroup) => void;
    addMarkers?: (points: L.LatLng[]) => L.FeatureGroup;
    addPolygon?: (points: L.LatLng[]) => L.FeatureGroup;
    addPolyline?: (points: L.LatLng[]) => L.FeatureGroup;
    addOverlay?: (sw: L.LatLngExpression, ne: L.LatLngExpression, file: File) => L.FeatureGroup;
}

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