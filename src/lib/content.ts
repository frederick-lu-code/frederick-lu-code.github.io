import { getCollection, type CollectionEntry } from "astro:content";

const isPublished = <T extends { data: { draft: boolean } }>(entry: T) =>
  import.meta.env.DEV || !entry.data.draft;

const byNewest = (
  a: { data: { date: Date } },
  b: { data: { date: Date } },
) => b.data.date.valueOf() - a.data.date.valueOf();

export async function getMusings(): Promise<CollectionEntry<"musings">[]> {
  const musings = await getCollection("musings", isPublished);
  return musings.sort(byNewest);
}

export async function getCovers(): Promise<CollectionEntry<"covers">[]> {
  const covers = await getCollection("covers", isPublished);
  return covers.sort(byNewest);
}

export async function getProjects(): Promise<CollectionEntry<"projects">[]> {
  const projects = await getCollection("projects", isPublished);
  return projects.sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return byNewest(a, b);
  });
}

/** The newest featured cover, falling back to the newest cover overall. */
export function pickFeatured(covers: CollectionEntry<"covers">[]) {
  return covers.find((cover) => cover.data.featured) ?? covers[0];
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-AU", {
    month: "short",
    year: "numeric",
  });
}

/** Rough, and deliberately so. 200wpm is close enough for an estimate. */
export function readingTime(body: string | undefined): string {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const posterCache = new Map<string, string>();

/**
 * YouTube only generates `maxresdefault` for videos uploaded at 720p or above,
 * so older or low-res uploads 404 and the card renders as a grey box. Probe
 * once per video per build and fall back to `hqdefault`, which always exists.
 */
export async function bestPoster(id: string): Promise<string> {
  const cached = posterCache.get(id);
  if (cached) return cached;

  const maxres = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const fallback = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  let chosen = fallback;
  try {
    const response = await fetch(maxres, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) chosen = maxres;
  } catch {
    /* Offline builds just use the always-present hqdefault. */
  }

  posterCache.set(id, chosen);
  return chosen;
}
