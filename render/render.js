import puppeteer from 'puppeteer-core';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [,, htmlPath, outDir, ...rest] = process.argv;
if (!htmlPath || !outDir) {
  console.error('usage: node render.js <sceneHtmlPath> <outDir> [--fps 30] [--maxMs N]');
  process.exit(1);
}
const arg = (name, dflt) => {
  const i = rest.indexOf(name);
  return i >= 0 ? Number(rest[i + 1]) : dflt;
};
const fps = arg('--fps', 30);
const maxMs = arg('--maxMs', Infinity);

mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 540, height: 960, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(resolve(htmlPath)).href);
  await page.evaluate(() => window.__ready);
  await page.evaluate(() => document.fonts.ready);
  const duration = Math.min(await page.evaluate(() => window.__duration()), maxMs);
  const frames = Math.round((duration / 1000) * fps);
  for (let f = 0; f < frames; f++) {
    await page.evaluate((ms) => window.__seek(ms), (f * 1000) / fps);
    await page.screenshot({
      path: `${outDir}/f${String(f).padStart(5, '0')}.png`,
      clip: { x: 0, y: 0, width: 540, height: 960 },
    });
    if (f % 30 === 0) console.log(`frame ${f}/${frames}`);
  }
  console.log(`done: ${frames} frames -> ${outDir}`);
} finally {
  await browser.close();
}
