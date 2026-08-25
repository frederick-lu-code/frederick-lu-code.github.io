/**
 * Run axe-core against every route.
 *
 *   node scripts/a11y.mjs [baseUrl]
 *
 * Exits non-zero if any violation is found.
 */
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { discoverRoutes } from "./routes.mjs";

const base = process.argv[2] ?? "http://localhost:4321";

/* /type-lab is a dev-only tool and redirects in a production build. */
const routes = (await discoverRoutes()).filter(
  (route) => route !== "/type-lab",
);

const browser = await chromium.launch();
/* axe-core/playwright requires an explicit context rather than browser.newPage. */
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();

let total = 0;

for (const route of routes) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  if (violations.length === 0) {
    console.log(`ok    ${route}`);
    continue;
  }

  total += violations.length;
  console.log(`FAIL  ${route}`);
  for (const violation of violations) {
    console.log(`        [${violation.impact}] ${violation.id}: ${violation.help}`);
    for (const node of violation.nodes.slice(0, 3)) {
      const data = node.any?.[0]?.data;
      const detail = data?.contrastRatio
        ? ` (${data.contrastRatio}:1, ${data.fgColor} on ${data.bgColor}, needs ${data.expectedContrastRatio})`
        : "";
      console.log(`          ${node.target.join(" ")}${detail}`);
    }
  }
}

await browser.close();

console.log(total === 0 ? "\nNo violations." : `\n${total} violation(s).`);
process.exitCode = total === 0 ? 0 : 1;
