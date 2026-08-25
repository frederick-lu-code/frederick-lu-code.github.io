/**
 * Report the real transfer weight of a page, grouped by resource type.
 *
 *   node scripts/weigh.mjs [url]
 */
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:4322/";

const browser = await chromium.launch();
const page = await browser.newPage();

const seen = [];
page.on("response", async (response) => {
  try {
    const body = await response.body();
    seen.push({
      url: new URL(response.url()).pathname,
      type: response.request().resourceType(),
      bytes: body.length,
    });
  } catch {
    /* Redirects and aborted requests have no body. */
  }
});

await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await browser.close();

const byType = new Map();
for (const item of seen) {
  byType.set(item.type, (byType.get(item.type) ?? 0) + item.bytes);
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const total = seen.reduce((sum, item) => sum + item.bytes, 0);

console.log(url);
for (const [type, bytes] of [...byType].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type.padEnd(12)} ${kb(bytes)}`);
}
console.log(`  ${"TOTAL".padEnd(12)} ${kb(total)}\n`);

console.log("Largest resources:");
for (const item of seen.sort((a, b) => b.bytes - a.bytes).slice(0, 8)) {
  console.log(`  ${kb(item.bytes).padStart(10)}  ${item.url}`);
}
