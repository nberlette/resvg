#!/usr/bin/env -S deno run -A

import { render } from "../mod.ts";
import { resolve } from "./_helpers.ts";

const samples = await Array.fromAsync(Deno.readDir(resolve("./samples")));

for (const dpi of [96, 144, 192] as const) {
  for (const autofix of [true, false]) {
    for (const sample of samples) {
      if (!sample.isFile) continue;
      const { name } = sample;
      Deno.bench({
        group: `render ${name}`,
        name: `autofix=${autofix}, dpi=${dpi}`,
        n: 100,
        baseline: autofix === false && dpi === 96,
        async fn(b) {
          const svg = await Deno.readTextFile(resolve(`./samples/${name}`));
          b.start();
          render(svg, {
            dpi,
            defaultSize: { width: 1024, height: 512 },
            shapeRendering: "geometricPrecision",
            textRendering: "optimizeSpeed",
            imageRendering: "optimizeQuality",
            styles: "",
            autofix,
          });
          b.end();
        },
      });
    }
  }
}
