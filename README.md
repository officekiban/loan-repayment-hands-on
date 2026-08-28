# 返済シミュレータ ハンズオン

- パッケージ版: v0.3
- 用途: Claude Codeによるテストレビューと仕様変更を体験する

## 主な構成

```text
loan-repayment-hands-on/
├─ CLAUDE.md
├─ README.md
├─ app/
│  ├─ index.html
│  └─ loan-repayment-simulator.html
├─ scripts/
│  ├─ build-standalone.mjs
│  ├─ open-claude-hands-on.ps1
│  ├─ preflight-claude-hands-on.ps1
│  └─ validate-package.mjs
└─ docs/
   ├─ basic-design.md
   ├─ claude-hands-on.html
   ├─ claude-hands-on.md
   ├─ test-spec.md
   └─ operator-story.md
```

- `app/index.html`: ブラウザで操作する単体ページ。試算結果と月別返済予定表を表示
- `app/loan-repayment-simulator.html`: 会話内表示用の編集元
- `scripts/build-standalone.mjs`: 編集元から配布用`index.html`を生成
- `docs/basic-design.md`: 基本設計。利息切捨てと元金最終月調整を記載
- `docs/test-spec.md`: 意図的な矛盾とテスト漏れを残したテスト仕様書兼成績書
- `docs/operator-story.md`: 参加者へ見せない答え合わせと完了条件
- `docs/claude-hands-on.md`: テストレビューと30年上限への仕様変更手順
- `docs/claude-hands-on.html`: 進捗をブラウザ内へ保存できる参加者向けガイド
- `CLAUDE.md`: Claude Codeが常時参照する作業順序と検証手順

## Claude Codeハンズオン

所要時間は約30分。次の順に実行する。

```powershell
powershell -ExecutionPolicy Bypass -File scripts/preflight-claude-hands-on.ps1
powershell -ExecutionPolicy Bypass -File scripts/open-claude-hands-on.ps1
claude --dangerously-skip-permissions
```

## ローカル起動

このフォルダをカレントディレクトリにし、ローカルだけへ公開する。

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

ブラウザで `http://127.0.0.1:8765/app/` を開く。

## 現在の計算状態

画面は、元利均等、元金均等および元金据置の概算に加え、月別の返済予定表を12件ずつ表示する。計算内部では小数を保持し、画面表示時だけ円単位へ丸めている。基本設計の`BD-RND-01`と`BD-RND-02`はまだ計算エンジンへ反映していない。

`BD-RND-01`と`TS-05`の利息端数処理は、テストレビューで発見する意図的な不整合として残している。

画面配色は、日本政策金融公庫の公開Webサイトで使われている深緑、緑、生成りおよび青を参考にしている。ロゴ、名称表示または固有レイアウトは複製していない。
