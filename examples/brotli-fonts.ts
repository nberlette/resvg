#!/usr/bin/env -S deno run --allow-all

/**
 * This example demonstrates a few different things at once:
 *
 * - loading custom font faces at runtime via options.fontFaces
 * - using brotli-compressed font files to save a lot of space
 *   👉🏼 the library automatically decodes these while loading
 * - using bundled (built-in) fonts in tandem with custom ones
 * - using custom css via options.styles to override SVG styles
 *
 * @module brotli-fonts
 */

import { render } from "../mod.ts";

performance.mark("start:demo");

const svg = `
<svg width="2000" height="1000" viewBox="0 0 1000 500" fill="none">
  <g id="testing" fill-rule="evenodd">
    <rect id="bg" fill="#fff" x="0" y="0" width="100%" height="100%" rx="10" ry="10" />
    <text id="test-text" font-size="64" font-weight="400" fill="#000" x="50%" y="20%" text-anchor="middle" text-color="white" font-color="white">
      <tspan>JetBrains Mono (bundled)</tspan>
    </text>
    <text id="monospace" font-family="monospace" font-size="54" font-weight="400" fill="indianred" filter="drop-shadow(0 1 1 #0003)" x="50%" y="40%" text-anchor="middle">
      <tspan>Operator Mono </tspan>
    </text>
    <text id="sans-serif" font-family="serif" font-size="64" font-weight="400" fill="#111827" x="50%" y="60%" text-anchor="middle">
      <tspan>Bitter (serif, bundled)</tspan>
    </text>
    <text id="sans-serif-2" font-family="sans-serif" font-size="72" font-weight="400" fill="#111827" x="50%" y="78%" text-anchor="middle">
      <tspan><tspan font-weight="300">Decimal</tspan> <tspan font-weight="900">Ultra</tspan> <tspan font-weight="200" font-size="48" y="65%">(custom)</tspan></tspan>
    </text>
    <text id="fantasy" font-family="Numbers" font-size="72" font-weight="400" x="20%" y="95%" text-anchor="middle" fill="#333333">
      420♣️ 8♣️
    </text>
    <text font-family="Numbers" font-size="88" font-weight="400" x="65%" y="95%" text-anchor="middle" fill="indianred">
      Q♦️ K♥️ A♥️
    </text>
  </g>
</svg>`;

performance.mark("start:render");
const png = render(svg, {
  styles: `
    #bg {
      fill: #f9fafb;
      rx: 25px;
      ry: 25px;
    }
    text span {
      fill: red;
      font-size: 1.5em;
    }
  `,
  fontFamily: "JetBrains Mono",
  fontFaces: [
    {
      kind: "mono",
      name: "OperatorMono Nerd Font",
      data: await Deno.readFile(
        "./fonts/OperatorMonoNerd/OperatorMonoNerd-Book.ttf.br",
      ),
    },
    {
      kind: "cursive",
      name: "Inkwell Script",
      // we'll use a non-compressed font here to demonstrate that they can be
      // mixed and matched with brotli-compressed font files without issue
      data: await Deno.readFile("./fonts/Inkwell/InkwellScript-Book.otf"),
      default: true, // this will be the default cursive font
    },
    {
      kind: "sans",
      name: "Decimal",
      data: await Deno.readFile("./fonts/Decimal/Decimal-Ultra.ttf.br"),
      default: true, // this will be the default sans-serif font
    },
    {
      kind: "sans",
      name: "Decimal",
      // more mixing n matching
      data: await Deno.readFile("./fonts/Decimal/Decimal-UltraItalic.ttf"),
    },
    {
      kind: "sans",
      name: "Decimal",
      data: await Deno.readFile("./fonts/Decimal/Decimal-Thin.ttf.br"),
    },
    // {
    //   kind: "sans",
    //   name: "Gotham Narrow ScreenSmart",
    //   data: await Deno.readFile("./fonts/Gotham/GothamNarrSSm-Book.otf.br"),
    // },
    {
      kind: "fantasy",
      name: "Numbers-Deuce",
      data: await Deno.readFile("./fonts/Numbers/Numbers-Deuce.otf"),
      default: true, // this will be the default fantasy font
    },
  ],
});
performance.mark("end:render");

console.warn(`\x1b[2m ... rendering png from svg ...\x1b[0m`);

const { duration } = performance.measure(
  "render",
  "start:render",
  "end:render",
);

// await Deno.stdout.write(png);

const prefix = ["resvg", new Date().toISOString().split("T")[0], ""].join("-");
const suffix = ".png";

console.warn(`\x1b[2m ... creating temp file ...\x1b[0m`);

const tmp = await Deno.makeTempFile({ suffix, prefix });

console.warn(
  `\x1b[1;92m  ✔️  wrote ${(png.length / 1024).toFixed(2)} KB to file\x1b[0m`,
  `\x1b[2;3m ... \x1b[33m in ${duration.toFixed(2)} ms\x1b[0m`,
);
console.warn(`\x1b[1;94m     →\x1b[0m \x1b[1;4;96m${tmp}\x1b[0m`);

const { duration: totalDuration } = performance.measure("demo", "start:demo");
console.warn(`\x1b[1;33m     ℹ done in ${totalDuration.toFixed(2)} ms\x1b[0m`);

await Deno.writeFile(tmp, png);
