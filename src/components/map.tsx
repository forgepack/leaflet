import { useMap } from "./useMap";
import { Menu } from "./menu";
import { Card } from "./card";

export const Map = () => {
	const {
		map,
		layers,
		addMarkers,
		addPolyline,
		addPolygon,
		addOverlay,
		toggleFromMap,
		startDrawingRoute,
		finishDrawingRoute,
		cancelDrawingRoute,
		isDrawingRoute,
		routePoints,
	} = useMap()

	return (
		<div className="map-container">
			<div id="map"></div>
			{map && (
				<>
					<Card map={map} layers={layers} toggleFromMap={toggleFromMap} />
					<Menu
						map={map}
						toggleFromMap={toggleFromMap}
						addMarkers={addMarkers}
						addPolyline={addPolyline}
						addPolygon={addPolygon}
						addOverlay={addOverlay}
						startDrawingRoute={startDrawingRoute}
						finishDrawingRoute={finishDrawingRoute}
						cancelDrawingRoute={cancelDrawingRoute}
						isDrawingRoute={isDrawingRoute}
						routePoints={routePoints}
					/>
					
					<RouteDrawingBanner 
						isDrawing={isDrawingRoute}
						pointsCount={routePoints.length}
					/>
				</>
			)}
		</div>
	)
}

// Componente para banner de informações durante desenho
interface RouteDrawingBannerProps {
	isDrawing: boolean;
	pointsCount: number;
}

const RouteDrawingBanner = ({ isDrawing, pointsCount }: RouteDrawingBannerProps) => {
	if (!isDrawing) return null

	const getBannerText = (): string => {
		if (pointsCount >= 2) {
			return `${pointsCount} pontos • Clique no botão Route para finalizar`;
		} else if (pointsCount === 1) {
			return '1 ponto • Continue clicando no mapa';
		}
		return 'Clique no mapa para adicionar pontos';
	}

	return (
		<div className="route-drawing-banner">
			<span className="banner-icon">📍</span>
			<span className="banner-text">{getBannerText()}</span>
		</div>
	)
}