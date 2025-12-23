<div align="center">

# `@nick/resvg`

TypeScript + WebAssembly bindings for [`resvg`].

</div>

---

## API

### `render`

Renders a string or `BufferSource` object containing an [SVG] into a [PNG]
image, optionally with a custom set of options to control the rendering
behavior.

Returns a `Uint8Array` containing the rasterized PNG image data.

#### Signature

```ts ignore
render(svg: string | BufferSource, options?: Options): Uint8Array;
```

#### Parameters

- `svg` - The SVG data to render, either as a string or `BufferSource` object.
- `options` - An optional object with [`Options`](#options) for controlling the
  renderer.

#### Returns

The rasterized PNG image data as a `Uint8Array`.

---

### `Options`

The `Options` interface provides numerous options for customizing the rendering
process. All the options from the `resvg` crate are available, as well as some
additional options specific to this package.

| Option           | Type                 | Description                                                  | Default                     |
| ---------------- | -------------------- | ------------------------------------------------------------ | --------------------------- |
| `autofix`        | `boolean`            | Automatically fix common SVG issues.                         | `true`                      |
| `defaultSize`    | [`Size`]             | The default size of the SVG.                                 | See [`Size`] below.         |
| `dpi`            | `number`             | The DPI (dots per inch) of the output.                       | `96`                        |
| `fontSize`       | `number`             | The default font size to use if one isn't specified.         | `12`                        |
| `fontFamily`     | `string`             | The default font family to use.                              | `sans-serif`                |
| `fontFamilies`   | [`FontFamilies`]     | Maps generic font types to their specific font families.     | See [`FontFamilies`] below. |
| `fontFaces`      | [`Array<FontFace>`]  | An array of [`FontFace`] objects to preload in the renderer. | `[]`                        |
| `languages`      | `string[]`           | An array of language tags to use for font selection.         | `["en"]`                    |
| `styles`         | `string`, `string[]` | A string or array of CSS styles to apply to the SVG.         | `[]`                        |
| `shapeRendering` | [`ShapeRendering`]   | The default `shape-rendering` value (when set to `auto`).    | `"crispEdges"`              |
| `imageRendering` | [`ImageRendering`]   | The default `image-rendering` value (when set to `auto`).    | `"optimizeQuality"`         |
| `textRendering`  | [`TextRendering`]    | The default `text-rendering` value (when set to `auto`).     | `"optimizeLegibility"`      |

[`Size`]: #size "Size interface"
[`FontFamilies`]: #fontfamilies "FontFamilies interface"
[`Array<FontFace>`]: #fontface "FontFace interface"
[`FontFace`]: #fontface "FontFace interface"
[`ShapeRendering`]: #shaperendering "ShapeRendering enum"
[`TextRendering`]: #textrendering "TextRendering enum"
[`ImageRendering`]: #imagerendering "ImageRendering enum"

---

### Fonts

- `Bitter` is the default and the _serif_ font.
- `Inter` is the _sans-serif_ font.
- `JetBrains Mono` is the _monospace_ font.

---

### Examples

#### Basic Usage: Rendering SVG to PNG

```ts
import { render } from "jsr:@nick/resvg@0.1.0-rc.1";

const data = render(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="820px" height="312px" viewBox="0 0 820 312" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Testing</title>
    <g id="testing" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect fill="#FFFFFF" x="0" y="0" width="820" height="312"></rect>
        <text id="test-text" font-family="sans-serif" font-size="32" font-weight="bold" fill="#111827">
            <tspan x="51" y="90">Testing Testing Testing</tspan>
        </text>
        <text id="monospace" font-family="monospace" font-size="32" font-weight="normal" fill="#2D53A4">
            <tspan x="502" y="233">Monospace</tspan>
        </text>
    </g>
</svg>`);

await Deno.writeFile("example.png", data);
```

#### Advanced Usage: Custom Fonts

```ts
import { type Options, render } from "jsr:@nick/resvg@0.1.0-rc.1";

const operatorMono = await fetch(
  "https://raw.githubusercontent.com/nberlette/resvg/main/fonts/OperatorMonoNerd/OperatorMonoNerd-Book.ttf"
).then((r) => r.bytes());

const fontFaces = [
  {
    kind: "monospace",
    name: "Operator Mono",
    weight: 400,
    style: "normal",
    data: operatorMono,
  },
];

const options = {
  fontFaces,
  fontFamily: "OperatorMono Nerd Font",
  styles: [
    `.monospace {
      font-family: "OperatorMono Nerd Font", monospace;
      font-size: 32px;
      font-weight: 400;
      fill: #2D53A4;
    }`,
  ],
} satisfies Options;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="820px" height="312px" viewBox="0 0 820 312" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Testing</title>
    <g id="testing" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect fill="#FFFFFF" x="0" y="0" width="820" height="312"></rect>
        <text id="test-text" font-family="sans-serif" font-size="32" font-weight="bold" fill="#111827">
            <tspan x="51" y="90">Testing Testing Testing</tspan>
        </text>
        <text class="monospace">
            <tspan x="502" y="233">Monospace</tspan>
        </text>
    </g>
</svg>`;

const data = render(svg, options);

import { image } from "jsr:@cliffy/ansi@1.0.0-rc.8/ansi-escapes";

console.log(image(data, { preserveAspectRatio: 1 }));
```

---

<div align="center">

**[MIT] © [Nicholas Berlette]. All rights reserved.**

<small>

[github] · [issues] · [jsr] · [docs] · [license]

</small></div>

[`resvg`]: https://github.com/RazrFalcon/resvg "Give RazrFalcon/resvg a star on GitHub!"
[license]: https://nick.mit-license.org/2024 "MIT © Nicholas Berlette. All rights reserved."
[MIT]: https://nick.mit-license.org/2024 "MIT © Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Follow @nberlette on GitHub for more projects!"
[GitHub]: https://github.com/nberlette/resvg "Give nberlette/resvg a star on GitHub!"
[Issues]: https://github.com/nberlette/resvg/issues "View issues for nberlette/resvg on GitHub"
[JSR]: https://jsr.io/@nick/resvg "View @nick/resvg on JSR!"
[Docs]: https://jsr.io/@nick/resvg/doc "View @nick/resvg documentation on JSR"
[kitsonk]: https://github.com/kitsonk "Follow Kitson P. Kelly on GitHub!"
[Deno]: https://deno.land "Deno is a secure runtime for JavaScript and TypeScript"
[Bun]: https://bun.sh "Bun is a fast all-in-one JavaScript runtime"
[Node.js]: https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine"
[WebAssembly]: https://webassembly.org "WebAssembly is a binary instruction format for a stack-based virtual machine"
[SVGspec]: https://www.w3.org/TR/SVG11/ "Scalable Vector Graphics (SVG) 1.1 (Second Edition)"
[PNGspec]: https://www.w3.org/TR/PNG/ "Portable Network Graphics (PNG) Specification (Second Edition)"
[SVG2spec]: https://www.w3.org/TR/SVG2/ "Scalable Vector Graphics (SVG) 2"
[SVG]: https://developer.mozilla.org/en-US/docs/Web/SVG "Scalable Vector Graphics (SVG) is an XML-based vector image format for two-dimensional graphics with support for interactivity and animation"
[PNG]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#png "Portable Network Graphics (PNG) is a raster graphics file format that supports lossless data compression"
