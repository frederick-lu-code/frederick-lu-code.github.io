/**
 * Everything about you that the site reads from one place.
 * Change these before deploying; `url` in particular feeds the sitemap and RSS.
 */
export const SITE = {
  url: "https://frederick-lu-code.github.io",
  name: "Freddie",
  /* Placeholder wording. Rewrite it in your own voice. */
  tagline: "Guitar covers, things I am still thinking about, and whatever else.",
  description:
    "Guitar covers, essays, and the things I keep thinking about. A personal site by Freddie.",
  email: "hello@freddie.dev",
  locale: "en",
} as const;

export const NAV = [
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/music", label: "Music" },
  { href: "/musings", label: "Musings" },
  { href: "/about", label: "About" },
] as const;

export const SOCIALS = [
  { href: "https://github.com/frederick-lu-code", label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/frederick-yi-ming-lu/",
    label: "LinkedIn",
  },
] as const;

/**
 * The "right now" strip on the homepage. Empty means the strip does not
 * render at all. Add entries whenever, that is the point of it:
 *
 *   { label: "Learning", value: "Blackbird, slowly" },
 */
export const NOW: ReadonlyArray<{ label: string; value: string }> = [];

/**
 * Scrolls across the homepage. Small, specific, unserious. Empty means the
 * marquee does not render. Add strings like "open tunings" or "the third take".
 */
export const MARQUEE: ReadonlyArray<string> = [];
