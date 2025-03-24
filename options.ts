/**
 * This module provides type definitions and enums that can be used to
 * customize the rendering behavior of the underlying WASM library. It
 * includes options for setting the default size, DPI, fonts, and more.
 *
 * @module options
 */
// @ts-types="./lib/resvg.d.ts"
import { ImageRendering, ShapeRendering, TextRendering } from "./lib/resvg.js";

export { ImageRendering, ShapeRendering, TextRendering };

type strings = string & {};

/** Represents the default `shape-rendering` attribute for SVG elements. */
export type ShapeRenderingLike =
  | ShapeRendering
  | Uncapitalize<string & keyof typeof ShapeRendering>
  | strings;

/** Represents the default `image-rendering` attribute for SVG elements. */
export type ImageRenderingLike =
  | ImageRendering
  | Uncapitalize<string & keyof typeof ImageRendering>
  | strings;

/** Represents the default `text-rendering` attribute for SVG elements. */
export type TextRenderingLike =
  | TextRendering
  | Uncapitalize<string & keyof typeof TextRendering>
  | strings;

/**
 * Represents the size of an SVG image.
 *
 * @category Types
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Represents a short type name for a font, used for preloading custom fonts
 * into the WASM library. The short type names and their corresponding long
 * type names are as follows:
 *
 * - `default` -> `serif`
 * - `serif` -> `serif`
 * - `sans` -> `sans-serif`
 * - `mono` -> `monospace`
 * - `cursive` -> `cursive`
 * - `fantasy` -> `fantasy`
 *
 * @see {@linkcode Options} for more information on using custom fonts.
 *
 * @category Types
 */
export type SmolType =
  | "default"
  | "serif"
  | "sans"
  | "mono"
  | "cursive"
  | "fantasy";

/**
 * Longhand type names for preloading custom fonts into the WASM library. These
 * correspond to the short type names in {@linkcode SmolType}, but use a full
 * length name that aligns more closely with the CSS font-family property.
 *
 * @see {@linkcode Options} for more information on using custom fonts.
 *
 * @category Types
 */
export type LongType =
  | "serif"
  | "sans-serif"
  | "sans_serif"
  | "monospace"
  | "cursive"
  | "fantasy";

export type Type = LongType | SmolType;

type WasmType = "serif" | "sans_serif" | "monospace" | "cursive" | "fantasy";

/**
 * Represents a font face for a specific font family, for preloading the
 * WASM binary with custom fonts.
 *
 * @category Types
 */
interface BaseFontFace<T extends Type = Type> {
  /**
   * An optional generic family name / kind to describe the font (e.g. `serif`,
   * `sans-serif`, `monospace`).
   */
  kind?: T | strings | undefined;
  /** The font family name. @example "Inter" */
  name: string;
  /** The raw font data, as a Uint8Array. */
  data: Uint8Array;
  /** Whether this font is the default font for its kind. */
  default?: boolean;
  /** The font weight. */
  weight?: number | string;
  /** The font style. */
  style?: string;
}

/**
 * Represents a font face with a {@linkcode Type} attached.
 *
 * @category Types
 */
export interface FontFace<T extends Type = Type> extends BaseFontFace<T> {
  /**
   * Type name to describe this font. Must be one of `sans`, `serif`, `mono`,
   * `cursive`, `fantasy`, `sans-serif`, `monospace`, or `default`.
   *
   * @default {"default"}
   */
  readonly kind: T | strings;
}

/**
 * Represents a collection of font faces for different font types, used for
 * preloading custom fonts into the WASM library.
 *
 * @category Types
 */
export type FontFamilies = { [K in SmolType | LongType]?: string };

/**
 * Options for rendering SVGs to PNGs with the `@nick/resvg` package. These are
 * converted to the correct type class expected by the internal bindings.
 *
 * ## Defaults
 *
 * The default options are as follows:
 *
 * ```ts
 * const defaultOptions = {
 *   dpi: 96,
 *   defaultSize: { width: 100, height: 100 },
 *   fontSize: 12,
 *   fontFamily: {
 *     default: "Gotham Narrow ScreenSmart",
 *     sans: "Gotham Narrow ScreenSmart",
 *     serif: "Sentinel ScreenSmart",
 *     mono: "OperatorMono Nerd Font",
 *     cursive: "Inkwell Script",
 *     fantasy: "Inkwell Blackletter",
 *   },
 *   fontFaces: [],
 *   styles: "",
 *   imageRendering: ImageRendering.OptimizeQuality,
 *   shapeRendering: ShapeRendering.GeometricPrecision,
 *   textRendering: TextRendering.OptimizeLegibility,
 * };
 * ```
 *
 * ## Custom Fonts
 *
 * Custom fonts can be preloaded with the `options.fonts` property, as an array
 * of {@linkcode FontFace} objects. This allows you to pass in custom fonts as
 * raw Uint8Array data, which is stored in a custom font database to make them
 * available for use in the SVG document.
 *
 * **Note**: If a font face has the 'default' flag set, it must also specify a
 * `kind` property for it to be correctly added as the type's default face.
 *
 * @example Preloading custom fonts
 * ```ts
 * import { render } from "@nick/resvg";
 *
 * const inter_book = Uint8Array.from([...]);
 * const inter_ital = Uint8Array.from([...]);
 * const jetbrain = Uint8Array.from([...]);
 *
 * const options = {
 *   fontFaces: [
 *     { name: "Inter", kind: "sans-serif", data: inter_book, default: true },
 *     { name: "Inter", kind: "sans-serif", data: inter_ital },
 *     { name: "JetBrains Mono", kind: "monospace", data: jetbrain, default: true },
 *   ],
 * };
 *
 * render("<svg>...</svg>", options);
 * ```
 *
 * @category Types
 */
export interface Options {
  /**
   * Whether to automatically fix missing or incorrect attributes in the SVG.
   * @default {true}
   */
  autofix?: boolean | undefined;
  /**
   * The default dimensions to use if explicit width/height are missing.
   * @default {{width:100,height:100}}
   */
  defaultSize?: Size | undefined;
  /**
   * The DPI to use for rendering.
   * @default {96}
   */
  dpi?: number | undefined;
  /**
   * A custom scale factor to apply to the SVG rendering. This is useful for
   * scaling the output image to a different size than the original SVG.
   * @default {1}
   */
  scale?: number | undefined;
  /**
   * Custom output size to use for the rendered image.
   * @default {undefined}
   */
  size?: Size | undefined;
  /**
   * The default font to use for rendering text.
   * @default {"Bitter"}
   */
  fontFamily?: string | undefined;
  /**
   * Override the fonts used for the generic font families (serif, sans-serif,
   * monospace, cursive, fantasy) with custom font family names. The names must
   * correspond exactly to the internal family names of font faces registered
   * with the font database.
   *
   * @example
   * ```ts
   * const options = {
   *   fontFamilies: {
   *     serif: "Sentinel ScreenSmart",
   *     sans: "Gotham Narrow ScreenSmart",
   *     mono: "OperatorMono Nerd Font",
   *     cursive: "Inkwell Script",
   *     fantasy: "Inkwell Blackletter",
   *   },
   * };
   * ```
   */
  fontFamilies?: FontFamilies | undefined;
  /**
   * The default font size to use for rendering text.
   * @default {12}
   */
  fontSize?: number | undefined;
  /**
   * Custom font faces to preload into the WASM library, exposing them for
   * use in text rendering. This can be an array of {@linkcode FontFace}
   * objects, which contain the font data as a Uint8Array, the font family
   * name, and an optional generic family name / kind to describe the font
   * (e.g. `serif`, `sans-serif`, `monospace`, `cursive`, `fantasy`).
   */
  fontFaces?: FontFace[] | undefined;
  /**
   * Custom stylesheets to apply to the SVG document before rendering.
   * @default {""}
   */
  styles?: string | string[] | undefined;
  /**
   * The default shape-rendering attribute to use for rendering shapes.
   * @default {"crispEdges"}
   */
  shapeRendering?: ShapeRenderingLike | undefined;
  /**
   * The default text-rendering attribute to use for rendering text.
   * @default {"optimizeLegibility"}
   */
  textRendering?: TextRenderingLike | undefined;
  /**
   * The default image-rendering attribute to use for rendering images.
   * @default {"optimizeQuality"}
   */
  imageRendering?: ImageRenderingLike | undefined;
  /**
   * The languages to use for text rendering.
   * @default {["en"]}
   */
  languages?: string[] | undefined;
}

export declare namespace Options {
  export { ImageRendering, ShapeRendering, TextRendering };
}

// deno-lint-ignore no-namespace
export namespace Options {
  Options.ImageRendering = ImageRendering;
  Options.ShapeRendering = ShapeRendering;
  Options.TextRendering = TextRendering;
}
