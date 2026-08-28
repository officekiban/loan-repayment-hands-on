import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, '..');

async function read(relativePath) {
  return readFile(path.join(workspaceRoot, relativePath), 'utf8');
}

const source = await read('app/loan-repayment-simulator.html');
const output = await read('app/index.html');
const basicDesign = await read('docs/basic-design.md');
const testSpec = await read('docs/test-spec.md');

if (!source.includes('返済予定表') || !source.includes('PAGE_SIZE = 12')) {
  throw new Error('返済予定表または12件ごとのページ表示が見つかりません。');
}
if (!output.includes(source.trim())) {
  throw new Error('app/index.htmlが編集元HTMLから生成されていません。');
}

const upperLimitMatch = basicDesign.match(/返済年数[^\n]*1年以上(30|100)年以下/);
if (!upperLimitMatch) {
  throw new Error('基本設計書の返済年数上限を確認できません。');
}

const upperLimit = upperLimitMatch[1];
if (!source.includes(`id="loan-years" name="years" type="number" value="10" min="1" max="${upperLimit}"`) ||
    !source.includes(`返済年数は1年以上${upperLimit}年以下の整数で入力してください`)) {
  throw new Error(`画面の返済年数上限が基本設計書の${upperLimit}年と一致しません。`);
}

if (upperLimit === '30' && (!testSpec.includes('30年') || !testSpec.includes('31年'))) {
  throw new Error('30年上限への変更後は、30年と31年のテストが必要です。');
}

if (!testSpec.includes('四捨五入') || !testSpec.includes('返済予定表')) {
  throw new Error('レビュー対象のテスト項目が見つかりません。');
}

console.log(`Claude demo validation passed: repayment term upper limit ${upperLimit} years.`);
