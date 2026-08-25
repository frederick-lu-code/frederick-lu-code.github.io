import { OGImageRoute } from "astro-og-canvas";
import { SITE } from "../../config";
import { getMusings } from "../../lib/content";

const musings = await getMusings();

/** Keys become the image path, e.g. `proofs-and-solos` -> /og/proofs-and-solos.png */
const pages: Record<string, { title: string; description: string }> = {
  default: { title: SITE.name, description: SITE.tagline },
  experience: {
    title: "Where I have worked",
    description: "Jane Street, TikTok, Google, UNSW, Loch Safety.",
  },
  projects: {
    title: "Things I have built",
    description: "Projects.",
  },
  music: {
    title: "Songs I have taken apart",
    description: "Guitar covers, recorded at home, buzzes and all.",
  },
  musings: {
    title: "Musings",
    description: "Things I wrote down to find out what I thought.",
  },
  about: {
    title: "Who this is",
    description: "The longer version.",
  },
};

for (const musing of musings) {
  pages[musing.id] = {
    title: musing.data.title,
    description: musing.data.deck,
  };
}

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,

  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    /* Same paper and rust as the site itself. */
    bgGradient: [[234, 231, 224]],
    border: { color: [184, 83, 42], width: 24, side: "inline-start" },
    padding: 72,
    font: {
      /* Keep this in sync with --font-display in global.css. */
      title: {
        families: ["Young Serif", "Courier Prime"],
        color: [26, 26, 26],
        size: 78,
        lineHeight: 1.05,
      },
      description: {
        families: ["Courier Prime"],
        color: [103, 100, 96],
        size: 30,
        lineHeight: 1.45,
      },
    },
    fonts: [
      "./src/assets/og-fonts/YoungSerif-Regular.ttf",
      "./src/assets/og-fonts/CourierPrime-Regular.ttf",
      "./src/assets/og-fonts/CourierPrime-Bold.ttf",
    ],
  }),
});
