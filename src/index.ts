/**
 * @fileoverview Entry point for the Leaflet map components library.
 * This module exports all the main components and utilities for working with interactive maps.
 * 
 * Automatically imports necessary CSS files for proper styling of components.
 * 
 * @author Your Name
 * @version 1.0.0
 */

// Importa o CSS do Leaflet automaticamente
import "leaflet/dist/leaflet.css";
import "./styles/card.css"
import "./styles/index.css"
import "./styles/map.css"
import "./styles/menu.css"
import "./styles/useMap.css"

/**
 * @description Exports main map components and utilities
 */
export { Card } from "./components/card"
export { HandleInputFile } from "./components/handleInputFile"
export { Map } from "./components/map"
export { Menu } from "./components/menu"
export { useMap } from "./components/useMap";
// export type { UseMapReturn } from "./useMap";