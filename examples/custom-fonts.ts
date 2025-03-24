#!/usr/bin/env -S deno run -Aq

import {
  ImageRendering,
  type Options,
  ShapeRendering,
  TextRendering,
} from "../src/options.ts";
import { render } from "../mod.ts";
import { imageToAnsi, resolve } from "./_helpers.ts";

// types recognized here are:
// sans, serif, mono, cursive, fantasy, sans-serif, monospace, default
const fontFaces = [
  {
    kind: "sans",
    name: "Obsidian",
    data: await Deno.readFile(
      resolve("../fonts/Obsidian/Obsidian-Roman.otf.br"),
    ),
    default: true,
  },
  {
    kind: "sans",
    name: "Obsidian",
    data: await Deno.readFile(
      resolve("../fonts/Obsidian/Obsidian-Italic.otf.br"),
    ),
  },
  // {
  //   kind: "sans",
  //   name: "Decimal",
  //   data: await Deno.readFile(resolve("../fonts/Decimal/Decimal-Ultra.ttf.br")),
  // },
  // {
  //   kind: "fantasy",
  //   name: "Numbers",
  //   data: await Deno.readFile(resolve("../fonts/Numbers/Numbers.ttc.br")),
  // },
] as const satisfies Options["fontFaces"];

const options = {
  dpi: 144,
  defaultSize: { width: 1800, height: 600 },
  fontFamily: "Obsidian",
  fontSize: 72,
  fontFaces,
  styles: `
    text {
      font-family: "Obsidian", sans-serif;

      & tspan {
        display: block;
        text-align: center;
      }
    }
  `,
  shapeRendering: ShapeRendering.GeometricPrecision,
  textRendering: TextRendering.GeometricPrecision,
  imageRendering: ImageRendering.OptimizeQuality,
} satisfies Options;

const svg = `
<svg viewBox="0 0 900 300" width="1800" height="600">
  <rect width="100%" height="100%" rx="8" fill="none" />
  <text x="50%" y="75%" fill="#ddd" font-size="196" text-anchor="middle">
    <tspan letter-spacing="-0.03em"><tspan font-style="italic">@</tspan>nick</tspan>
  </text>
</svg>
`;

const png = render(svg, options);

const tmp = await Deno.makeTempFile({ suffix: ".png" });

await Deno.writeFile(tmp, png);

console.log(`✔️ Wrote ${png.length} B to ${tmp}`);

console.log(imageToAnsi(png));
