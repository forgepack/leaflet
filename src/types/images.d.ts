/**
 * @fileoverview TypeScript module declarations for image file imports.
 * Enables importing image files as strings in TypeScript projects.
 * 
 * These declarations allow you to import image files directly in your TypeScript code:
 * 
 * @example
 * ```typescript
 * import logoImage from './assets/logo.png';
 * import backgroundJpg from './images/background.jpg';
 * import iconSvg from './icons/user.svg';
 * 
 * // logoImage, backgroundJpg, and iconSvg will be strings containing the file paths
 * ```
 */

/**
 * @module "*.png"
 * @description Module declaration for PNG image files
 */
declare module "*.png" {
	/** The file path or data URL of the PNG image */
	const value: string;
	export default value;
}

/**
 * @module "*.jpg"
 * @description Module declaration for JPG image files
 */
declare module "*.jpg" {
	/** The file path or data URL of the JPG image */
	const value: string;
	export default value;
}

/**
 * @module "*.jpeg"
 * @description Module declaration for JPEG image files
 */
declare module "*.jpeg" {
	/** The file path or data URL of the JPEG image */
	const value: string;
	export default value;
}

/**
 * @module "*.svg"
 * @description Module declaration for SVG image files
 */
declare module "*.svg" {
	/** The file path or data URL of the SVG image */
	const value: string;
	export default value;
}

declare module "*.gif" {
	const value: string;
	export default value;
}

declare module "*.webp" {
	const value: string;
	export default value;
}