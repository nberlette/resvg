#!/usr/bin/env -S deno run --allow-all

import { render } from "@nick/resvg";
import { imageToAnsi } from "./_helpers.ts";
import { TextEncoder } from "@nick/utf8";

const res = await fetch(
  "https://api.iconify.design/simple-icons:deno.svg?width=256&height=256&color=%23cc5847",
);
const svg = await res.text();

// the default module is auto-instantiated and ready to use
const png = render(svg, {
  dpi: 96,
  fontSize: 48,
  fontFamily: "Operator Mono Nerd Font",
  defaultSize: { width: 256, height: 256 },
  shapeRendering: "geometricPrecision",
  imageRendering: "optimizeQuality",
  textRendering: "optimizeSpeed",
  styles: "path { transform: rotate(45deg); fill: red}",
  languages: ["en", "fr"],
});

// write the PNG image to a file
const tmp = Deno.makeTempFileSync({ suffix: ".png", prefix: "deno-" });

Deno.writeFileSync(tmp, png);

console.log(`✔️ wrote PNG icon to ${tmp} (${png.length} bytes)`);

Deno.stdout.writeSync(
  new TextEncoder().encode(
    "\n\n" + "-".repeat(80) + "\n" + imageToAnsi(png, "40", "40", true) + "\n" +
      "-".repeat(80) +
      "\n\n",
  ),
);
