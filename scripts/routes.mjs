/**
 * Every route the site actually built, read off dist/ rather than kept in a
 * hand-written list that goes stale whenever content is added or removed.
 */
import { readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const DIST = "dist";

async function walk(dir, found = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path, found);
    } else if (entry.name.endsWith(".html")) {
      found.push(path);
    }
  }
  return found;
}

/**
 * @returns {Promise<string[]>} routes such as `/`, `/music`, `/musings/x`, `/404`
 */
export async function discoverRoutes() {
  try {
    await stat(DIST);
  } catch {
    throw new Error(`No ${DIST}/ directory. Run \`npm run build\` first.`);
  }

  const routes = (await walk(DIST)).map((file) => {
    const rel = relative(DIST, file).split(sep).join("/");
    /* foo/index.html -> /foo, 404.html -> /404, index.html -> / */
    const trimmed = rel.endsWith("/index.html")
      ? rel.slice(0, -"/index.html".length)
      : rel.replace(/\.html$/, "");
    return trimmed === "index" ? "/" : `/${trimmed}`;
  });

  /* Shallow routes first, then alphabetical, so output reads top-down. */
  return [...new Set(routes)].sort((a, b) => {
    const depth = a.split("/").length - b.split("/").length;
    return depth !== 0 ? depth : a.localeCompare(b);
  });
}

/** A filename-safe label for a route. */
export function routeName(route) {
  return route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
}
