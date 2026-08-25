/**
 * Capture full-page screenshots of every route for design review.
 *
 *   node scripts/screenshots.mjs [baseUrl] [outDir]
 *
 * Defaults to the dev server and .screenshots/ (which is gitignored).
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { discoverRoutes, routeName } from "./routes.mjs";

const base = process.argv[2] ?? "http://localhost:4321";
const outDir = process.argv[3] ?? ".screenshots";

const routes = (await discoverRoutes()).map((route) => [
  routeName(route),
  route,
]);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 960 },
  deviceScaleFactor: 2,
});

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`${page.url()} :: ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`${page.url()} :: ${err.message}`));

for (const [name, route] of routes) {
  const response = await page.goto(`${base}${route}`, {
    waitUntil: "networkidle",
  });
  /* Give webfonts a beat to swap in before capturing. */
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log(`${response?.status()}  ${route}  ->  ${outDir}/${name}.png`);
}

/* One narrow capture to check the layout holds up on a phone. */
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/home-mobile.png`, fullPage: true });
console.log(`mobile  /  ->  ${outDir}/home-mobile.png`);

await browser.close();

if (errors.length) {
  console.log("\nConsole errors:");
  for (const error of errors) console.log(`  ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nNo console errors.");
}
