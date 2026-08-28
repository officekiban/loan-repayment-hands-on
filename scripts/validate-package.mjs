import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const requiredFiles = [
  'CLAUDE.md',
  'README.md',
  'app/index.html',
  'app/loan-repayment-simulator.html',
  'docs/basic-design.md',
  'docs/cicd-setup.md',
  'docs/claude-hands-on.html',
  'docs/claude-hands-on.md',
  'docs/test-spec.md',
  'docs/operator-story.md',
  'scripts/build-standalone.mjs',
  'scripts/open-claude-hands-on.ps1',
  'scripts/preflight-claude-hands-on.ps1',
  'scripts/reset-hands-on.ps1',
  'claude-demo/CLAUDE.md',
  'claude-demo/app/index.html',
  'claude-demo/app/loan-repayment-simulator.html',
  'claude-demo/docs/basic-design.md',
  'claude-demo/docs/test-spec.md',
  'claude-demo/scripts/build-standalone.mjs',
  'claude-demo/scripts/validate-demo.mjs',
  '.hands-on-baseline/app/index.html',
  '.hands-on-baseline/app/loan-repayment-simulator.html',
  '.hands-on-baseline/docs/basic-design.md',
  '.hands-on-baseline/docs/test-spec.md',
  '.github/workflows/release.yml'
];

async function read(relativePath) {
  return readFile(path.join(packageRoot, relativePath), 'utf8');
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['.git', 'node_modules', 'artifacts'].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
}

for (const relativePath of requiredFiles) {
  await read(relativePath);
}

const packageJson = JSON.parse(await read('package.json'));
const expectedVersion = `v${packageJson.version.split('.').slice(0, 2).join('.')}`;
const app = await read('app/index.html');
const basicDesign = await read('docs/basic-design.md');
const testSpec = await read('docs/test-spec.md');
const operatorStory = await read('docs/operator-story.md');
const claudeInstructions = await read('CLAUDE.md');
const handsOnGuide = await read('docs/claude-hands-on.md');
const handsOnHtml = await read('docs/claude-hands-on.html');
const workflow = parseYaml(await read('.github/workflows/release.yml'));
const demoFiles = (await walk(path.join(packageRoot, 'claude-demo')))
  .map((file) => path.relative(path.join(packageRoot, 'claude-demo'), file).replaceAll('\\', '/'));

if (!app.includes(expectedVersion)) throw new Error(`App does not display ${expectedVersion}.`);
if (!app.includes('元金据置期間')) throw new Error('Grace-period input is missing.');
if (!app.includes('元利均等') || !app.includes('元金均等')) throw new Error('Repayment methods are missing.');
if (!app.includes('返済予定表') || !app.includes('loan-schedule-body') || !app.includes('PAGE_SIZE = 12')) {
  throw new Error('Repayment schedule or its 12-row pagination is missing.');
}
if (!app.includes('#1c5a00') || !app.includes('#2f8608') || !app.includes('#f5f1d7')) {
  throw new Error('The public-service-inspired color palette is missing.');
}
if (!basicDesign.includes('BD-RND-01') || !basicDesign.includes('1円未満を切り捨てる')) {
  throw new Error('Basic-design interest rounding rule is missing.');
}
if (!basicDesign.includes('BD-RND-02') || !basicDesign.includes('最終月に調整する')) {
  throw new Error('Basic-design principal adjustment rule is missing.');
}
if (!testSpec.includes('TS-05') || !testSpec.includes('四捨五入')) {
  throw new Error('Test-spec rounding expectation is missing.');
}
if (!testSpec.includes('TS-08') || !testSpec.includes('各行の区分が`返済`')) {
  throw new Error('Repayment-schedule test coverage is missing.');
}
if (!operatorStory.includes('レビューで必ず出したい4点')) throw new Error('Facilitator answer key is missing.');
if (!claudeInstructions.includes('Do not resolve the existing interest-rounding inconsistency') ||
    !claudeInstructions.includes('npm run check')) {
  throw new Error('Claude review and validation instructions are missing.');
}
if (!handsOnGuide.includes('所要時間: 約45分') || !handsOnGuide.includes('返済年数の上限を100年から30年')) {
  throw new Error('The simplified review and specification-change flow is missing.');
}
if (demoFiles.some((file) => file.includes('operator-story') || file.includes('claude-hands-on'))) {
  throw new Error('The Claude demo workspace contains facilitator or answer-key material.');
}
if (!handsOnGuide.includes('git push -u origin HEAD') || !handsOnGuide.includes('reset-hands-on.ps1')) {
  throw new Error('The Git deployment and reset flow is missing from the participant guide.');
}
if (!handsOnHtml.includes('data-progress') || !handsOnHtml.includes('localStorage')) {
  throw new Error('Interactive hands-on progress tracking is missing.');
}
if (!workflow?.jobs?.['deploy-production']?.environment) {
  throw new Error('Production environment approval job is missing.');
}
if (workflow.jobs['deploy-production'].needs !== 'capture-staging') {
  throw new Error('Production must wait for the staging screenshot job.');
}
const workflowText = await read('.github/workflows/release.yml');
if (!workflowText.includes('release-app-${{ github.sha }}') ||
    !workflowText.includes('Download the exact app reviewed in staging') ||
    !workflowText.includes('path: claude-demo/app')) {
  throw new Error('Staging and production must deploy the same frozen artifact.');
}
if (!workflowText.includes('actions/upload-artifact@v6') ||
    !workflowText.includes('actions/download-artifact@v7') ||
    !workflowText.includes('cloudflare/wrangler-action@v4')) {
  throw new Error('GitHub Actions must use Node.js 24-compatible artifact and Wrangler actions.');
}

const forbiddenPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /CLOUDFLARE_API_TOKEN\s*=\s*[^<\s$][^\s]*/
];

for (const file of await walk(packageRoot)) {
  const content = await readFile(file, 'utf8').catch(() => '');
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      throw new Error(`Possible secret found in ${path.relative(packageRoot, file)}.`);
    }
  }
}

console.log(`Package validation passed: ${expectedVersion}, ${requiredFiles.length} required files.`);
