#!/usr/bin/env -S deno run --allow-all

import { render } from "@nick/resvg";
import { imageToAnsi } from "./_helpers.ts";
import { Size } from "../src/wasm/resvg.generated.js";

const styles = `
  :root {
    --bg-primary: #141722;
    --bg-secondary: #1a1f37;
    --text-primary: #fefeff;
    --text-title: #b8a1f9;
    --text-title-2: #9d7df5;
    --text-title-muted: #ddd4;
    --text-title-accent: #fca4e7;
    --text-title-accent-2: #ff8be4;
    --text-subtitle: #babed8;
    --text-subtitle-accent: var(--text-title-accent);
    --divider: #89ddff33;
    --shadow-primary: #00000014;
    --shadow-secondary: #00000012;
    --shadow-accent: #0002;
    --shadow-dark: #0003;
  }

  @media (prefers-color-scheme: light) {
    :root {
      /* lol */
      --bg-primary: #feceface;
      --bg-secondary: #fbedff;
      --text-title-accent: #a586fa;
      --text-title-accent-2: #967ae2;
      --text-title: #885ee3;
      --text-title-2: #724dc3;
      --text-title-muted: rgba(169, 113, 225, 0.38);
      --text-subtitle: #456;
      --text-subtitle-accent: #885ee3;
      --divider: #8765;
      --shadow-primary: rgba(83, 18, 139, 0);
      --shadow-secondary: rgba(69, 3, 114, 0.04);
      --shadow-accent: rgba(83, 18, 139, 0.12);
      --shadow-dark: rgba(58, 6, 107, 0.12);
    }

    [href="#jsr"] {
      mix-blend-mode: normal !important;
      --shadow-dark: #0000;
    }
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-primary: #141722;
      --bg-secondary: #1a1f37;
      --text-primary: #fefeff;
      --text-secondary: #babed8;
      --text-accent: #fca4e7;
      --text-title: #b8a1f9;
      --text-title-2: #9d7df5;
      --text-title-muted: #ddd4;
      --text-title-accent: #fca4e7;
      --text-title-accent-2: #ff8be4;
      --text-subtitle: #babed8;
      --text-subtitle-accent: var(--text-title-accent);
      --divider: #89ddff33;
      --shadow-primary: #00000014;
      --shadow-secondary: #00000012;
      --shadow-accent: #0002;
      --shadow-dark: #0003;
    }

    [href="#jsr"] {
      mix-blend-mode: hard-light !important;
    }

    .text-title>tspan {
      filter: drop-shadow(12px 18px 10px var(--shadow-primary)) drop-shadow(-12px 18px 10px var(--shadow-primary)) drop-shadow(1px 3.5px 0.5px var(--shadow-dark))
    }
  }

  [href="#jsr"] {
    filter: drop-shadow(8px 12px 16px var(--shadow-primary)) drop-shadow(-8px 12px 16px var(--shadow-secondary)) drop-shadow(1px 3.5px 0.5px var(--shadow-dark)) drop-shadow(0 0 0.5px var(--shadow-dark));
  }

  .text-title {
    letter-spacing: -0.125em;
    word-spacing: -0.4em;
    font-feature-settings: 'ss01';
    user-select: none;
    fill: url(#text-title-fill);
    filter:
      drop-shadow(12px 28px 16px var(--shadow-primary)) drop-shadow(-12px 28px 16px var(--shadow-primary)) drop-shadow(1px 3.5px 0.5px var(--shadow-accent)) drop-shadow(8px 12px 16px var(--shadow-secondary)) drop-shadow(-8px 12px 16px var(--shadow-secondary)) drop-shadow(1px 3.5px 0.5px var(--shadow-accent)) drop-shadow(0 0 0.5px var(--shadow-accent));
  }

  .text-title-accent {
    fill: url(#text-title-accent-fill);
  }

  .text-title-muted {
    fill: var(--text-title-muted);
  }

  .text-subtitle {
    fill: var(--text-subtitle);
    filter: drop-shadow(1px 2px 0.5px var(--shadow-dark));
  }

  .text-subtitle-accent {
    fill: var(--text-subtitle-accent);
  }

  .divider {
    stroke: url(#accent-gradient);
    stroke-opacity: 0.5;
    stroke-width: 3 !important;
  }

  linearGradient#background stop:first-child {
    stop-color: var(--bg-secondary);
  }

  linearGradient#background stop:last-child {
    stop-color: var(--bg-primary);
  }

  rect#container-primary {
    fill: var(--bg-primary, #141722);
  }

  rect#container-masked {
    fill: var(--bg-secondary, #1a1f37);
  }

`;

const svg = await Deno.readTextFile("../../.github/assets/banner.svg");

// the default module is auto-instantiated and ready to use
const png = render(svg, {
  dpi: 96,
  fontSize: 48,
  fontFamily: "Operator Mono Nerd Font",
  fontFaces: [
    {
      kind: "mono",
      name: "OperatorMono Nerd Font",
      data: await Deno.readFile(
        "./fonts/OperatorMonoNerd/OperatorMonoNerd-Book.ttf.br",
      ),
      default: true,
    },
    {
      kind: "mono",
      name: "OperatorMono Nerd Font",
      data: await Deno.readFile(
        "./fonts/OperatorMonoNerd/OperatorMonoNerd-Italic.ttf.br",
      ),
      default: true,
    },
    {
      kind: "mono",
      name: "IBM Plex Mono",
      data: await Deno.readFile("./fonts/IBMPlexMono/IBMPlexMono-Regular.otf"),
    },
    {
      kind: "mono",
      name: "IBM Plex Mono",
      data: await Deno.readFile("./fonts/IBMPlexMono/IBMPlexMono-Italic.otf"),
    },
    {
      kind: "mono",
      name: "IBM Plex Mono",
      data: await Deno.readFile("./fonts/IBMPlexMono/IBMPlexMono-Bold.otf"),
    },
    {
      kind: "mono",
      name: "IBM Plex Mono",
      data: await Deno.readFile(
        "./fonts/IBMPlexMono/IBMPlexMono-BoldItalic.otf",
      ),
    },
  ],
  defaultSize: Size.fromJSON({ width: 512, height: 256 }),
  shapeRendering: "geometricPrecision",
  imageRendering: "optimizeQuality",
  textRendering: "optimizeSpeed",
  styles,
  languages: ["en"],
  autofix: true,
});

// write the PNG image to a file
const tmp = Deno.makeTempFileSync({ suffix: ".png", prefix: "banner-" });

Deno.writeFileSync(tmp, png);

console.log(`✔️ wrote banner.png to ${tmp} (${png.length} bytes)`);

console.log(imageToAnsi(png));
