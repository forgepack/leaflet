import * as L from "leaflet";
import logo from "../image/outlinebuoy.png";

interface CardProps {
	map: L.Map;
	layers: L.Layer[];
	toggleFromMap: (feature: L.Layer) => void;
}

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

interface CardItemProps {
	feature: L.Layer;
	map: L.Map;
	toggleFromMap: (feature: L.Layer) => void;
}

const CardItem = ({ feature, map, toggleFromMap }: CardItemProps) => {
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