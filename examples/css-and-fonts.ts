#!/usr/bin/env -S deno run --allow-all

performance.mark("start:demo");

import { type Options, render } from "../mod.ts";

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" viewBox="0 0 1250 610"
  width="1280" height="640" color-rendering="optimizeSpeed" shape-rendering="geometricPrecision"
  text-rendering="geometricPrecision" overflow="visible" vector-effect="non-scaling-size">
  <g>
    <rect id="container-primary" x="0" y="0" width="100%" height="100%" rx="25" filter="drop-shadow(0 5 3 #0003)" fill="url(#background)" />
    <rect id="container-masked" x="0" y="0" width="100%" height="100%" rx="25" mask="url(#fade-out)" fill="url(#bg-fade-out)" />
  </g>
  <g>
    <g filter="drop-shadow(3 8 4 #0001) drop-shadow(-3 8 4 #0001)">
      <text id="title" font-size="222" font-family="Obsidian" font-weight="100" stroke="none" x="10%" y="50%"
        text-rendering="geometricPrecision" font-style="normal" class="text-title">
        <tspan letter-spacing="-0.3rem">brō-chä</tspan>
      </text>

      <use href="#jsr" x="88.3%" y="2.25%" width="120" height="80" opacity="1" />
    </g>
    <g transform="translate(0 150) scale(1.28)">
      <g mask="url(#fade-out)" style="mix-blend-mode: color-burn;" opacity="0.6">
        <g mask="url(#wave-mask)" transform="translate(0 115) scale(1 0.70)">
          <rect x="0" y="0" width="1260" height="620" id="wavy" mask="url(#mask-outer-container)" />
        </g>
      </g>
      <g mask="url(#mask-outer-container)">
        <path class="divider"
          d="M -30,150 S 0,200 65,145 165,200 265,145 365,200 465,145 565,200 666,145 765,200 865,145 965,200 1030,145"
          stroke-width="5" opacity="1" transform="scale(1 0.70) translate(0 170)" stroke-linecap="round" fill="none">
        </path>
      </g>
    </g>

    <text id="subtitle" x="50%" y="91%" font-size="32" font-family="Sentinel ScreenSmart" font-weight="400"
      font-style="normal" filter="drop-shadow(1 1 0.5 #0003)" text-anchor="middle" user-select="none"
      letter-spacing="-0.05rem">
      <tspan fill-opacity="0.8" class="text-subtitle" fill="#fefeff">
        <tspan font-weight="700">universal brotli decompressor</tspan>
        <tspan opacity="0">—</tspan>
        <tspan fill-opacity="0.5" font-size="28" font-style="italic">performant, portable, and platform-agnostic</tspan>
      </tspan>
    </text>
  </g>
  <defs>
    <symbol width="200" height="50" viewBox="-1 -6 13 13" xmlns="http://www.w3.org/2000/svg" id="jsr"
      filter="drop-shadow(0 1 .25 #0003)" shape-rendering="crispEdges" color-rendering="optimizeQuality">
      <path d="M0,2h2v-2h7v1h4v4h-2v2h-7v-1h-4" fill="#111827" fill-rule="evenodd" />
      <g fill="#ffc31f" fill-rule="nonzero" vector-effect="non-scaling-size">
        <path d="M1,3h1v1h1v-3h1v4h-3" />
        <path d="M5,1h3v1h-2v1h2v3h-3v-1h2v-1h-2" />
        <path d="M9,2h3v2h-1v-1h-1v3h-1" />
      </g>
    </symbol>

    <symbol xmlns="http://www.w3.org/2000/svg" width="3.11em" height="1em" viewBox="0 0 512 165" fill="none"
      fill-rule="evenodd" filter="drop-shadow(0 1 .25 #0003)" id="npm" shape-rendering="crispEdges">
      <path pathLength="100" shape-rendering="crispEdges" fill="#C1212733" stroke="#C12127" stroke-width="1"
        stroke-linecap="square" stroke-linejoin="square" vector-effect="non-scaling-stroke"
        d="M157.538 164.103h65.641v-32.82h65.642V0H157.538zM223.18 32.82H256v65.64h-32.82zM315.077 0v131.282h65.64V32.821h32.821v98.461h32.821V32.821h32.82v98.461H512V0zM0 131.282h65.641V32.821h32.82v98.461h32.821V0H0z" />
    </symbol>
    <linearGradient id="text-title-fill" x1="0" x2="0" y1="120" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#b8a1f9" />
      <stop offset="1" stop-color="#9d7df5" />
    </linearGradient>
    <linearGradient id="text-title-accent-fill" x1="0" x2="0" y1="140" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fca4e7" />
      <stop offset="1" stop-color="#ff8be47f" />
    </linearGradient>
    <linearGradient id="background" x1="10" x2="0" y1="0" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0.5" stop-color="#1a1f37" />
      <stop offset="1" stop-color="#141722" />
    </linearGradient>
    <linearGradient id="bg-fade-out" x1="0" x2="0" y1="350" y2="-50" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff0" />
      <stop offset=".666" stop-color="#ffff" />
      <stop offset="1" stop-color="#ffff" />
    </linearGradient>
    <linearGradient id="accent-gradient" x1="0" x2="0" y1="-120" y2="220" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fca4e7" stop-opacity="1" />
      <stop offset="0.75" stop-color="#fca4e7" stop-opacity="1" />
      <stop offset="0.95" stop-color=" #ff8be47f" stop-opacity="0.5" />
      <stop offset="1.5" stop-color=" #ff8be47f" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="accent-gradient-2" x1="0" x2="0" y1="-80" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fca4e7" stop-opacity="1" />
      <stop offset="0.75" stop-color="#fca4e7" stop-opacity="1" />
      <stop offset="0.95" stop-color=" #ff8be47f" stop-opacity="0.5" />
      <stop offset="1.5" stop-color=" #ff8be47f" stop-opacity="0" />
    </linearGradient>
    <mask id="fade-out" maskUnits="objectBoundingBox" maskContentUnits="userSpaceOnUse" x="-10%" y="0" width="150%"
      height="150%" fill="url(#background)">
      <rect x="0" y="0" width="100%" height="100%" fill="url(#bg-fade-out)" mask="url(#mask-outer-container)" />
    </mask>
    <mask id="mask-inner-container" maskContentUnits="userSpaceOnUse" maskUnits="userSpaceOnUse" x="0" y="0"
      width="1280" height="640">
      <rect x="15" y="15" width="1250" height="610" fill="white" rx="25" />
    </mask>
    <mask id="mask-outer-container" maskContentUnits="userSpaceOnUse" maskUnits="userSpaceOnUse" x="0" y="0"
      width="1280" height="640">
      <rect x="0" y="0" width="1280" height="640" fill="white" rx="25" />
    </mask>
    <mask id="mask-container" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="1280"
      height="640">
      <rect x="10" y="0" width="1260" height="100%" fill="#fff" filter="blur(6px)" mask="url(#mask-inner-container)" />
    </mask>
    <mask id="wave-mask" width="100%" height="100%" x="0" y="20%" fill="white">
      <path
        d="M -30,150 S 0,200 65,145 165,200 265,145 365,200 465,145 565,200 666,145 765,200 865,145 965,200 1030,145 L 1030,300 L -30,300 Z"
        fill="white" />
    </mask>

    <style>
      :root {
        color-scheme: light dark;
        --bg-primary: light-dark(#fecefa, #141722);
        --bg-secondary: light-dark(#fefbe1, #1a1f37);
        --text-primary: light-dark(#a586fa, #fefeff);
        --text-secondary: light-dark(#babed8, #e7c4e1);
        --text-accent: light-dark(rgba(252, 164, 231, 0.222), #e694ff);
        --text-title: light-dark(#885ee3, #b8a1f9);
        --text-title-2: light-dark(#724dc3, #9d7df5);
        --text-title-muted: light-dark(#885ee3, #ddd4);
        --text-title-accent: light-dark(#a586fa, #fca4e7);
        --text-title-muted: light-dark(rgba(169, 113, 225, 0.68), #ff8be47f);
        --text-subtitle: light-dark(#456, #babed8);
        --text-dark: light-dark(#141722, #fefeff);
        --text-subtitle-accent: light-dark(#9677d9, light-dark(#a586fa, #fca4e7));
        --divider: light-dark(rgba(164, 14, 219, 0.555), #89ddff33);
        --shadow-primary: light-dark(rgba(83, 18, 139, 0), #00000014);
        --shadow-secondary: light-dark(rgba(69, 3, 114, 0.04), #00000012);
        --shadow-accent: light-dark(rgba(83, 18, 139, 0.12), #0002);
        --shadow-dark: light-dark(rgba(58, 6, 107, 0.12), #0003);
      }

      @media (prefers-color-scheme: light) {
        [href="#jsr"] {
          --shadow-dark: #0000;
        }
      }

      @media (prefers-color-scheme: dark) {
        [href="#jsr"] {
          mix-blend-mode: hard-light !important;
        }

        .text-title>tspan {
          filter: drop-shadow(12px 18px 10px light-dark(rgba(83, 18, 139, 0), #00000014)) drop-shadow(-12px 18px 10px light-dark(rgba(83, 18, 139, 0), #00000014)) drop-shadow(1px 3.5px 0.5px light-dark(rgba(58, 6, 107, 0.12), #0003))
        }
      }

      [href="#npm"],
      [href="#jsr"] {
        filter: drop-shadow(8px 12px 16px light-dark(rgba(83, 18, 139, 0), #00000014)) drop-shadow(-8px 12px 16px light-dark(rgba(69, 3, 114, 0.04), #00000012)) drop-shadow(1px 3.5px 0.5px light-dark(rgba(58, 6, 107, 0.12), #0003)) drop-shadow(0 0 0.5px light-dark(rgba(58, 6, 107, 0.12), #0003)) opacity(0.9);
      }

      #wavy {
        fill: url(#accent-gradient-2);
      }

      .text-title {
        letter-spacing: -0.4rem;
        word-spacing: -0.3em;
        font-feature-settings: 'ss01';
        user-select: none;
        fill: url(#text-title-fill);
        filter:
          drop-shadow(12px 28px 16px light-dark(rgba(83, 18, 139, 0), #00000014)) drop-shadow(-12px 28px 16px light-dark(rgba(83, 18, 139, 0), #00000014)) drop-shadow(1px 3.5px 0.5px light-dark(rgba(83, 18, 139, 0.12), #0002)) drop-shadow(8px 12px 16px light-dark(rgba(69, 3, 114, 0.04), #00000012)) drop-shadow(-8px 12px 16px light-dark(rgba(69, 3, 114, 0.04), #00000012)) drop-shadow(1px 3.5px 0.5px light-dark(rgba(83, 18, 139, 0.12), #0002)) drop-shadow(0 0 0.5px light-dark(rgba(83, 18, 139, 0.12), #0002));
      }

      .text-title-accent {
        fill: url(#text-title-accent-fill);
      }

      .text-title-muted {
        fill: light-dark(rgba(169, 113, 225, 0.68), #ff8be47f);
      }

      .text-subtitle {
        fill: light-dark(#456, #babed8);
        filter: drop-shadow(1px 2px 0.5px light-dark(rgba(58, 6, 107, 0.12), #0003));
      }

      .text-subtitle-accent {
        fill: light-dark(#9677d9, light-dark(#a586fa, #fca4e7));
      }

      .divider {
        stroke: light-dark(rgba(164, 14, 219, 0.555), #89ddff33);
        stroke-opacity: 0.5;
        stroke-width: 3 !important;
      }

      linearGradient#background stop:first-child {
        stop-color: light-dark(#fefbe1, #1a1f37);
      }

      linearGradient#background stop:last-child {
        stop-color: light-dark(#fecefa, #141722);
      }

      rect#container-primary {
        fill: var(--bg-primary, #141722);
      }

      rect#container-masked {
        fill: var(--bg-secondary, #1a1f37);
      }
    </style>
  </defs>
</svg>
`;

performance.mark("start:render");
const options = {
  fontFaces: [
    {
      kind: "fantasy",
      name: "Obsidian",
      data: await Deno.readFile("fonts/Obsidian/Obsidian-Roman.otf.br"),
    },
    {
      kind: "fantasy",
      name: "Obsidian",
      data: await Deno.readFile("fonts/Obsidian/Obsidian-Italic.otf.br"),
    },
    {
      kind: "serif",
      name: "Sentinel ScreenSmart",
      data: await Deno.readFile("fonts/Sentinel/SentinelSSm-Book.otf.br"),
      default: true,
    },
    {
      kind: "serif",
      name: "Sentinel ScreenSmart",
      data: await Deno.readFile("fonts/Sentinel/SentinelSSm-Bold.otf.br"),
    },
    {
      kind: "serif",
      name: "Sentinel ScreenSmart",
      data: await Deno.readFile("fonts/Sentinel/SentinelSSm-BookItalic.otf.br"),
    },
    {
      kind: "serif",
      name: "Sentinel ScreenSmart",
      data: await Deno.readFile("fonts/Sentinel/SentinelSSm-BoldItalic.otf.br"),
    },
  ],
  styles: "",
} satisfies Options;
const png = render(svg, options);
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

console.log(formatImageForTerminal(png));

await Deno.writeFile(tmp, png);

function formatImageForTerminal(image: Uint8Array) {
  const base64 = btoa(image.reduce((a, b) => a + String.fromCharCode(b), ""));
  return `\x1b]1337;File=inline=1;preserveAspectRatio=1;size=${image.length};width=100%;height=100%:${base64}\x07`;
}
