/**
 * @fileoverview Main Map component that integrates all map functionality.
 * Combines the map view, layer management cards, menu controls, and route drawing features.
 */

import { useMap } from "./useMap";
import { Menu } from "./menu";
import { Card } from "./card";

/**
 * @component Map
 * @description Main map component that orchestrates all map-related functionality.
 * 
 * This component:
 * - Renders the map container
 * - Integrates the map hook for map management
 * - Displays layer management cards
 * - Shows the control menu
 * - Handles route drawing with visual feedback
 * 
 * @returns {JSX.Element} Complete map interface with all controls
 * 
 * @example
 * ```tsx
 * import { Map } from './components/Map';
 * 
 * function App() {
 *   return (
 *     <div className="app">
 *       <Map />
 *     </div>
 *   );
 * }
 * ```
 */
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

/**
 * @interface RouteDrawingBannerProps
 * @description Props for the route drawing information banner
 */
interface RouteDrawingBannerProps {
	/** Whether route drawing mode is currently active */
	isDrawing: boolean;
	/** Number of points added to the current route */
	pointsCount: number;
}

/**
 * @component RouteDrawingBanner
 * @description Information banner displayed during route drawing mode.
 * 
 * Provides real-time feedback to users about:
 * - Current drawing state
 * - Number of points added
 * - Instructions for completing the route
 * 
 * @param {RouteDrawingBannerProps} props - Component properties
 * @param {boolean} props.isDrawing - Drawing mode state
 * @param {number} props.pointsCount - Current point count
 * 
 * @returns {JSX.Element | null} Banner element or null if not drawing
 * 
 * @private
 */
const RouteDrawingBanner = ({ isDrawing, pointsCount }: RouteDrawingBannerProps) => {
	if (!isDrawing) return null

	/**
	 * @function getBannerText
	 * @description Generates appropriate banner text based on drawing progress
	 * @returns {string} Contextual instruction text
	 * @private
	 */
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