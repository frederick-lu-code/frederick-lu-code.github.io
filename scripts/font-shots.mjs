/**
 * Renders the /type-lab name specimen once per display face so the options can
 * be compared side by side without clicking through the page.
 *
 *   node scripts/font-shots.mjs [baseUrl]
 *
 * Needs the dev server running, since /type-lab redirects in a production build.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:4331";
const outDir = ".screenshots/fonts";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 620 },
  deviceScaleFactor: 2,
});

await page.goto(`${base}/type-lab`, { waitUntil: "networkidle" });

/* The controls are sticky, so they sit on top of any element screenshot. They
   are hidden only while the shutter is open, since the script still has to
   click the chips inside them. */
await page.addStyleTag({
  content: `
    body[data-shooting] > header { display: none !important; }
    #specimen { padding: 2rem 3rem 2.5rem !important; }
    #specimen .eyebrow {
      font-size: 1.75rem !important;
      letter-spacing: 0.1em;
      margin-bottom: 1rem !important;
    }
  `,
});

const ids = await page.$$eval('.lab-chip[data-group="display"]', (chips) =>
  chips.map((chip) => ({
    id: chip.dataset.id,
    label: chip.textContent.trim(),
  })),
);

for (const [index, { id, label }] of ids.entries()) {
  await page.click(`.lab-chip[data-group="display"][data-id="${id}"]`);
  await page.evaluate(() => document.fonts.ready);

  /* Caption each frame with the face it is showing, so the contact sheet is
     readable without cross-referencing filenames. */
  await page.evaluate(
    ([caption, n]) => {
      document.querySelector("#specimen .eyebrow").textContent =
        `${n}. ${caption}`;
    },
    [label, index + 1],
  );
  await page.waitForTimeout(150);

  const name = `${String(index + 1).padStart(2, "0")}-${id}`;
  await page.evaluate(() => document.body.setAttribute("data-shooting", ""));
  await page.locator("#specimen > div").first().screenshot({
    path: `${outDir}/${name}.png`,
  });
  await page.evaluate(() => document.body.removeAttribute("data-shooting"));
  console.log(`${name}  ${label}`);
}

await browser.close();
console.log(`\n${ids.length} specimens written to ${outDir}/`);
