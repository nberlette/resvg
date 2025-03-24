#!/usr/bin/env -S deno run -A

import "@nick/utf8/shim";
import { render } from "../mod.ts";
import { imageToAnsi, resolve } from "./_helpers.ts";

const samples = await Array.fromAsync(Deno.readDir(resolve("./samples")));

console.error(`🚀 Rendering ${samples.length} SVG samples to terminal...`);
const divider = `\n\n      \x1b[1;94m${"·•".repeat(38)}·\x1b[0m\n`;

for (const sample of samples) {
  const { name } = sample;
  if (!sample.isFile) continue;
  const svg = await Deno.readTextFile(resolve(`./samples/${name}`));
  const png = render(svg, {
    dpi: 96,
    defaultSize: { width: 1024, height: 512 },
    shapeRendering: "geometricPrecision",
    textRendering: "optimizeSpeed",
    imageRendering: "optimizeQuality",
    styles: "",
    autofix: true,
  });

  console.error(divider);
  console.error(
    `✔️ rendered ${sample.name} (svg @ ${svg.length}B -> png @ ${png.length}B):`,
  );
  Deno.stderr.writeSync(new TextEncoder().encode(imageToAnsi(png)));
}

console.error(divider);
