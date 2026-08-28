import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const stagingUrl = process.env.STAGING_URL;
const screenshotPath = path.resolve(
  packageRoot,
  process.env.SCREENSHOT_PATH || 'artifacts/staging-screen.png'
);

if (!stagingUrl || (!/^https:\/\//.test(stagingUrl) && !/^http:\/\/127\.0\.0\.1(?::\d+)?(?:\/|$)/.test(stagingUrl))) {
  throw new Error('STAGING_URL must be HTTPS, except for local 127.0.0.1 verification.');
}

const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const expectedVersion = `v${packageJson.version.split('.').slice(0, 2).join('.')}`;
await mkdir(path.dirname(screenshotPath), { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 1000 } });

try {
  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await page.goto(stagingUrl, { waitUntil: 'networkidle', timeout: 30_000 });
      if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'unknown'}`);
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 6) await page.waitForTimeout(5_000);
    }
  }
  if (lastError) throw lastError;

  const app = page;
  await app.locator('#loan-repayment-simulator').waitFor();
  const version = (await app.locator('.loan-version').textContent())?.trim();
  if (version !== expectedVersion) {
    throw new Error(`Expected ${expectedVersion}, received ${version || 'no version'}.`);
  }

  await app.locator('#loan-principal').fill('3000000');
  await app.locator('input[name="method"][value="principal"]').check();
  const graceInput = app.locator('#loan-grace');
  await graceInput.fill('6');
  if (await graceInput.inputValue() !== '6') {
    throw new Error('Grace-period input did not retain the test value.');
  }
  await app.locator('#loan-form button[type="submit"]').click();
  await app.locator('#loan-period').filter({ hasText: '6か月据置後' }).waitFor();

  const firstPayment = await app.locator('#loan-first-payment').textContent();
  const lastPayment = await app.locator('#loan-last-payment').textContent();
  const period = await app.locator('#loan-period').textContent();
  if (!firstPayment?.includes('￥') || !lastPayment?.includes('￥')) {
    throw new Error('Repayment results were not displayed.');
  }
  if (!period?.includes('6か月据置後')) {
    throw new Error(`Grace-period result was not displayed: ${period || 'empty'}.`);
  }

  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Staging screenshot created: ${screenshotPath}`);
  console.log(`Staging URL checked: ${stagingUrl}`);
} finally {
  await browser.close();
}
