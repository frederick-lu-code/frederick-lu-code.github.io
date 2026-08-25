import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../config";
import { getMusings } from "../lib/content";

export async function GET(context: APIContext) {
  const musings = await getMusings();

  return rss({
    title: `${SITE.name} — Musings`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: musings.map((musing) => ({
      title: musing.data.title,
      description: musing.data.deck,
      pubDate: musing.data.date,
      link: `/musings/${musing.id}/`,
      categories: [...musing.data.tags],
    })),
    customData: `<language>en-au</language>`,
  });
}
