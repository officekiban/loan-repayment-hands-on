import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const sourcePath = path.join(packageRoot, 'app', 'loan-repayment-simulator.html');
const outputPath = path.join(packageRoot, 'app', 'index.html');
const fragment = await readFile(sourcePath, 'utf8');

const standalone = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>返済シミュレータ</title>
  <style>
    html { color-scheme: light dark; }
    body { margin: 0; padding: 16px; background: light-dark(#f4f7fb, #10141b); }
  </style>
</head>
<body>
${fragment}
</body>
</html>
`;

const currentOutput = await readFile(outputPath, 'utf8').catch(() => null);
const normalized = (value) => value.replace(/\r\n/g, '\n');

if (currentOutput !== null && normalized(currentOutput) === normalized(standalone)) {
  console.log(`Standalone app unchanged: ${outputPath}`);
} else {
  await writeFile(outputPath, standalone, 'utf8');
  console.log(`Standalone app built: ${outputPath}`);
}
