/**
 * This module exposes a single {@linkcode render} function for synchronously
 * rendering SVG (scalable vector graphics) into rasterized PNG images.
 *
 * @module render
 */
// ensure the TextDecoder API is always available
import "@nick/utf8/shim";

// @ts-types="./lib/resvg.d.ts"
import * as resvg from "./lib/resvg.js";
import type { Options } from "./options.ts";

export * from "./options.ts";

const Error = globalThis.Error;
const TextDecoder = globalThis.TextDecoder;

/**
 * Represents the valid input types the {@linkcode render} function accepts.
 *
 * @category Types
 */
export type InputType = string | BufferSource;

/**
 * Render an SVG (scalable vector graphic) into a rasterized PNG image. The SVG
 * input may either be a string, `ArrayBuffer`, `DataView`, or typed array. The
 * rendered PNG image is returned as raw bytes in a `Uint8Array`.
 *
 * @param svg The SVG input to render, as a string or BufferSource object.
 * @param [options] Additional options to pass to the WebAssembly renderer.
 * @returns a `Uint8Array` containing the raw PNG image data.
 * @example
 * ```ts
 *
 * import { render } from "@nick/resvg";
 *
 * const res = await fetch("https://api.iconify.design/simple-icons:deno.svg");
 * const svg = await res.text();
 *
 * // the default module is auto-instantiated and ready to use
 * const png = render(svg);
 *
 * // write the PNG image to a file
 * Deno.writeFileSync("deno.png", png);
 * ```
 * @example
 * ```ts
 *
 * import { render, WasmOptions } from "@nick/resvg";
 *
 * const options = {
 *   // DPI for the renderer (default: 96)
 *   dpi: 144,
 *   // default size for the SVG viewport (default: 100x100)
 *   defaultSize: { width: 400, height: 150 },
 *   // default font size for text elements (default: 12)
 *   fontSize: 36,
 *   // custom fonts can be provided to the renderer for text elements
 *   fonts: [{
 *     type: "monospace",
 *     name: "IBM Plex Mono",
 *     data: await Deno.readFile("../fonts/mono/IBMPlexMono-Regular.ttf"),
 *     default: false, // true = use this for the generic 'monospace' family
 *   }],
 *   // leveraging options.styles to enable fallback fonts via CSS
 *   styles: `
 *     text {
 *       font-family: "IBM Plex Mono", monospace;
 *       text-decoration: underline;
 *       text-transform: uppercase;
 *       letter-spacing: 2px;
 *     }
 *   `,
 *   // used when text-rendering is missing or set to "auto"
 *   textRendering: "geometricPrecision",
 *   // ensures the minimum required attributes for rendering are present
 *   autofix: true,
 * };
 *
 * const svg = `<svg>
 *   <text
 *      x="50%"
 *      y="50%"
 *      dominant-baseline="middle"
 *      text-anchor="middle"
 *      font-family="monospace"
 *      fill="#000000"
 *   >
 *     <tspan>Built-in monospace font</tspan>
 *     <tspan font-family="IBM Plex Mono" font-size="48">IBM Plex Mono</tspan>
 *   </text>
 * </svg>`;
 *
 * // The options above will have the following effects on the SVG:
 * // - missing xmlns attribute is added thanks to the 'autofix' option
 * // - text-rendering="auto" becomes text-rendering="{options.textRendering}"
 * // - other missing attributes are inferred from the provided options
 * // - the default font size for text elements is set to 36
 * // - the SVG viewport will be 400x150 pixels, its DPI set to 144
 *
 * const png = render(svg, options);
 *
 * Deno.writeFileSync("text.png", png);
 * ```
 */
export function render(svg: InputType, options?: resvg.OptionsLike): Uint8Array {
  try {
    if (typeof svg !== "string") {
      const decoder = new TextDecoder("utf-8", { ignoreBOM: true });
      svg = decoder.decode(svg as ArrayBufferView);
    }

    const defaults = resvg.Options.defaultOptions();

    options ??= defaults;

    if (!(options instanceof resvg.Options)) {
      options = resvg.Options.fromJSON(
        { ...defaults.toJSON(), ...options } as resvg.OptionsLike,
      );
    }

    return resvg.render(svg, options);
  } catch (e) {
    const error = e as Error;
    Error.captureStackTrace?.(error /* render */);
    error.stack?.slice(); // force V8 to capture a stack trace
    throw error;
  }
}

export { render as default };
