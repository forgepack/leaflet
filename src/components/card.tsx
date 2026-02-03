/**
 * @fileoverview Card component for displaying and managing map layers.
 * Provides a visual interface for layer management with remove functionality.
 */

import * as L from "leaflet";
import logo from "../image/outlinebuoy.png";

/**
 * @interface CardProps
 * @description Props for the Card component
 */
interface CardProps {
	/** The Leaflet map instance */
	map: L.Map;
	/** Array of map layers to display in cards */
	layers: L.Layer[];
	/** Function to toggle layer visibility on the map */
	toggleFromMap: (feature: L.Layer) => void;
}

/**
 * @component Card
 * @description Main card container component that renders a list of layer cards.
 * Each card represents a map layer and provides controls for layer management.
 * 
 * @param {CardProps} props - Component properties
 * @param {L.Map} props.map - The Leaflet map instance
 * @param {L.Layer[]} props.layers - Array of layers to display
 * @param {Function} props.toggleFromMap - Callback to toggle layer visibility
 * 
 * @returns {JSX.Element} Rendered card container with layer items
 * 
 * @example
 * ```tsx
 * <Card 
 *   map={mapInstance}
 *   layers={activeLayers}
 *   toggleFromMap={handleToggleLayer}
 * />
 * ```
 */
export const Card = ({ map, layers, toggleFromMap }: CardProps) => {
	return (
		<div className="cards">
			{layers.map((feature: L.Layer, index: number) => (
				<CardItem
					key={index}
					feature={feature}
					map={map}
					toggleFromMap={toggleFromMap}
				/>
			))}
		</div>
	)
}

/**
 * @interface CardItemProps
 * @description Props for individual card item component
 */
interface CardItemProps {
	/** The map layer/feature represented by this card */
	feature: L.Layer;
	/** The Leaflet map instance */
	map: L.Map;
	/** Function to toggle layer visibility on the map */
	toggleFromMap: (feature: L.Layer) => void;
}

/**
 * @component CardItem
 * @description Individual card item component representing a single map layer.
 * Provides a visual representation with remove functionality.
 * 
 * @param {CardItemProps} props - Component properties
 * @param {L.Layer} props.feature - The layer to represent
 * @param {L.Map} props.map - The map instance
 * @param {Function} props.toggleFromMap - Layer toggle callback
 * 
 * @returns {JSX.Element} Rendered card item
 */
const CardItem = ({ feature, map, toggleFromMap }: CardItemProps) => {
	/**
	 * @function handleRemove
	 * @description Handles the removal of a layer from the map
	 * @private
	 */
	const handleRemove = () => {
		if (map) {
			toggleFromMap(feature);
		}
	}

	return (
		<div className="card-wrapper">
			<div className="card">
				<button 
					className="card-remove-button"
					onClick={handleRemove}
					aria-label="Remove layer"
					type="button"
				>
					✖
				</button>
				
				<img className="card-image" src={logo} alt="Layer icon"/>
				
				<div className="card-content">
					{/* Layer {Math.random().toString(36).substr(2, 9)} */}
				</div>
				
				<div className="card-title">
					{/* Título pode ser adicionado aqui */}
				</div>
			</div>
		</div>
	)
}