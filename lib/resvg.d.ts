// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file

/**
 * Renders an SVG string into a PNG image as a byte array.
 *
 * Optionally accepts a `Options` object to customize the rendering,
 * such as setting the font family, font size, and custom fonts.
 *
 * @param {string} svg The SVG string to render.
 * @param {Options} [options] Custom rendering options (if any).
 * @returns {Uint8Array} A rasterized PNG image encoded as a byte array.
 * @throws {Error} If the SVG string is invalid or rendering fails.
 */
export function render(svg: string, options?: object | null): Uint8Array;
/**
 * r" Represents the `image-rendering` attribute on an SVG element.
 */
export enum ImageRendering {
  OptimizeQuality = 0,
  OptimizeSpeed = 1,
}
/**
 * r" Represents the `shape-rendering` attribute on an SVG element.
 */
export enum ShapeRendering {
  OptimizeSpeed = 0,
  CrispEdges = 1,
  GeometricPrecision = 2,
}
/**
 * r" Represents the `text-rendering` attribute on an SVG element.
 */
export enum TextRendering {
  OptimizeSpeed = 0,
  OptimizeLegibility = 1,
  GeometricPrecision = 2,
}

type Widen<T> = {
  [
    K in keyof T as (
      T[K] extends (...a: any) => any ? never : K
    )
  ]: T[K];
};

/**
 * Represents an "options-like" object, which shares the same properties as an
 * instance of the {@linkcode Options} class, but is not an instance of the
 * class itself. This is the type of object returnd by the `toJSON` method on
 * the `Options` class, among others.
 *
 * @category Types
 */
export type OptionsLike = Widen<Options>;
export type FontFaceLike = Widen<FontFace>;
export type FontFamiliesLike = Widen<FontFamilies>;
export type SizeLike = Widen<Size>;

export class FontFace {
  /**
   ** Return copy of self without private attributes.
   */
  toJSON(): Object;
  /**
   * Return stringified version of self.
   */
  toString(): string;
  free(): void;
  constructor(
    kind?: string | null,
    name?: string | null,
    data?: Uint8Array | null,
    is_default?: boolean | null,
  );
  static defaultFontFace(): FontFace;
  kind: string;
  name: string;
  data: Uint8Array;
  default: boolean;
  type: string;
}
/**
 * Represents the default font families for each of the five generic font
 * types that can be used in an SVG document, as well as the default font
 * family if no generic type is specified at all.
 */
export class FontFamilies {
  private constructor();
  /**
   ** Return copy of self without private attributes.
   */
  toJSON(): Object;
  /**
   * Return stringified version of self.
   */
  toString(): string;
  free(): void;
  /**
   * Converts a plain JavaScript object - or a JSON string that can be parsed
   * into such an object with a valid structure - into a `FontFamilies`
   * instance.
   *
   * This is a convenience method that is used internally to convert userland
   * POJOs into valid `FontFamilies` instances that can be used by the
   * renderer.
   *
   * @param {string | object} json - The JavaScript object or JSON string to
   * convert.
   * @returns {FontFamilies} - The converted `FontFamilies` instance.
   */
  static fromJSON(json: any): FontFamilies;
  /**
   * Converts the `FontFamilies` instance into a plain JavaScript object.
   */
  toObject(): object;
  /**
   * The font family to use when no `font-family` attribute is set in the SVG.
   */
  default: string;
  /**
   * The `sans-serif` font family.
   */
  sans_serif: string;
  /**
   * The `serif` font family.
   */
  serif: string;
  /**
   * The `monospace` font family.
   */
  monospace: string;
  /**
   * The `cursive` font family.
   */
  cursive: string;
  /**
   * The `fantasy` font family.
   */
  fantasy: string;
}

/**
 * Options for rendering SVGs.
 *
 * This is an intermediate conversion type that is used to convert userland
 * options into the correct `UsvgOptions` type.
 */
export class Options {
  /**
   ** Return copy of self without private attributes.
   */
  toJSON(): Object;
  /**
   * Return stringified version of self.
   */
  toString(): string;
  free(): void;
  constructor(
    maybe_dpi?: number | null,
    maybe_scale?: number | null,
    maybe_size?: Size | null,
    maybe_font_size?: number | null,
    maybe_font_faces?: FontFace[] | null,
    maybe_font_family?: string | null,
    maybe_font_families?: FontFamilies | null,
    maybe_style_sheet?: string | null,
    maybe_autofix?: boolean | null,
    maybe_default_size?: Size | null,
    maybe_shape_rendering?: ShapeRendering | null,
    maybe_text_rendering?: TextRendering | null,
    maybe_image_rendering?: ImageRendering | null,
    maybe_languages?: string[] | null,
  );
  /**
   * Creates a new `Options` object with default values.
   */
  static defaultOptions(): Options;
  /**
   * Creates a new `Options` object with default values, converts it into a
   * plain JavaScript object, and returns it. This is more or less the same
   * as calling `Options.default().toJSON()`, but the conversion takes place
   * entirely in Rust instead of in the JavaScript glue code.
   *
   * @returns {object} The default options object.
   */
  static defaultObject(): OptionsLike;
  /**
   * Creates a new `Options` object from a JSON string or object.
   *
   * @param {string | object} json The JSON string or object to parse.
   * @returns {Options} The parsed options object.
   */
  static fromJSON(json: string | Options | OptionsLike): Options;
  set_style_sheet(value: any): void;
  /**
   * By default, the renderer runs a series of syntax tests on its SVG inputs,
   * looking for several common problems that often cause the renderer to fail
   * or produce a bad image. If this option is set to `true` or omitted, these
   * issues will be automatically fixed where possible. If this behavior isn't
   * desired, setting this to `false` will disable the autofixing process.
   *
   * @remarks The `usvg` library that this package uses under the hood is
   * rather strict about the SVGs it accepts. Scenarios that will be
   * automatically fixed:
   *
   * - Missing `xmlns` attribute
   * - Missing `version` attribute
   * - Missing closing `</svg>` tag
   * - Missing XML document declaration (panics from this seem intermittent)
   *
   * Be aware that if this option is set to `false`, the renderer will be
   * passed the input SVG exactly as-is. Think of disabling this option as
   * being analogous to enabling a "strict" mode: if there are any syntax
   * issues or missing attributes, errors will be thrown by the renderer.
   *
   * @default {true}
   */
  autofix: boolean;
  /**
   * Automatic
   * Target DPI (dots per inch) for the SVG rendering. This value is used to
   * convert units in the SVG to pixels. As such, the value of this setting
   * directly impacts unit conversion behavior. For example, if the DPI is set
   * to 96, then a 1-inch line in the SVG will be rendered as a 96-pixel line
   * on the output image.
   *
   * @default {96}
   */
  dpi: number;
  /**
   * Set an explicit scale factor to use when rendering the SVG. This will
   * cause the SVG to be rendered at a different size than normal, and its
   * dimensions will be multiplied by the scale factor.
   *
   * For example, setting this to `2.0` will double the size of the rendered
   * image, while setting it to `0.5` will render the image at half of the
   * original size.The default value of `1.0` is a no-op.
   *
   * If you need to set the width and height of the output image explicitly,
   * use {@linkcode Options.size} instead. If both are set, the scale will
   * be applied to the dimensions set in the `size` property.
   *
   * @default {1.0}
   */
  scale: number;
  /**
   * Set the width and height of the output image. This is used to set the
   * dimensions of the rendered image. The dimensions are set in pixels. If
   * a scale factor is also set, the dimensions will be multiplied by that
   * scale factor.
   *
   * @default {undefined}
   */
  get size(): Size | undefined;
  /**
   * Set the width and height of the output image. This is used to set the
   * dimensions of the rendered image. The dimensions are set in pixels. If
   * a scale factor is also set, the dimensions will be multiplied by that
   * scale factor.
   *
   * @default {undefined}
   */
  set size(value: Size | null | undefined);
  /**
   * Default viewport size. These dimensions are used if there is no `viewBox`
   * attribute on the outermost (root) `<svg>` element and the `width` or
   * `height` attributes are relative.
   *
   * @default {{width:100,height:100}}
   */
  defaultSize: Size;
  /**
   * Default font size to use when no `font-size` attribute is set in the SVG.
   *
   * Default: 12
   */
  fontSize: number;
  /**
   * Default font family for when a `font-family` attribute is not in the SVG.
   *
   * Default: Times New Roman
   */
  fontFamily: string;
  /**
   * Font faces to register with the font database, making them available for
   * use in the SVG document.
   */
  fontFaces: FontFace[];
  /**
   * Specifies the default font family to be used for each of the five generic
   * font family names. This is used when an SVG element's `font-family` is
   * set to `serif`, `sans-serif`, `cursive`, `fantasy`, or `monospace`.
   *
   * Family names must be registered with the font database using the
   * `font_faces` property, and must **exactly** match the internal family
   * name of a font face. Otherwise, there's a chance that no text will be
   * rendered at all.
   */
  fontFamilies: FontFamilies;
  /**
   * Specifies the default shape rendering method to be used when an SVG
   * element's `shape-rendering` property is set to `auto`.
   *
   * @default {ShapeRendering.GeometricPrecision}
   */
  get shapeRendering(): ShapeRendering;
  set shapeRendering(
    value: ShapeRendering | `${ShapeRendering}` | null | undefined,
  );
  /**
   * Specifies the default text rendering method to be used when an SVG
   * element's `text-rendering` property is set to `auto`.
   *
   * @default {TextRendering.OptimizeLegibility}
   */
  get textRendering(): TextRendering;
  set textRendering(
    value: TextRendering | `${TextRendering}` | null | undefined,
  );
  /**
   * Specifies the default image rendering method to be used when an SVG
   * element's `image-rendering` property is set to `auto`.
   *
   * @default {ImageRendering.OptimizeQuality}
   */
  get imageRendering(): ImageRendering;
  set imageRendering(
    value: ImageRendering | `${ImageRendering}` | null | undefined,
  );
  /**
   * A CSS stylesheet that should be injected into the SVG. Can be used to
   * overwrite certain attributes.
   */
  readonly styles: string;
  /**
   * Language list used to resolve a `systemLanguage` conditional attribute.
   *
   * Format: `en`, `en-US`. Default: `[en]`
   */
  languages: string[];
}

export class Size {
  /**
   ** Return copy of self without private attributes.
   */
  toJSON(): Object;
  /**
   * Return stringified version of self.
   */
  toString(): string;
  free(): void;
  constructor(width: number, height: number);
  /**
   * Converts `Size` to a JavaScript object.
   */
  toObject(): object;
  /**
   * Converts a JSON-encoded string or object into a `Size` instance.
   */
  static fromJSON(json: any): Size;
  width: number;
  height: number;
}
