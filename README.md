# AIエージェントを知る。― 返済シミュレータ ハンズオン

- パッケージ版: v0.3
- 用途: Claude Codeによるテストレビューと仕様変更を体験する

## 主な構成

```text
loan-repayment-hands-on/
├─ CLAUDE.md
├─ README.md
├─ claude-demo/                 ← Claude Codeで開く参加者専用フォルダ
│  ├─ CLAUDE.md
│  ├─ app/
│  ├─ docs/
│  ├─ scripts/
│  └─ package.json
├─ .hands-on-baseline/          ← 初期状態の復元元
├─ scripts/
│  ├─ build-standalone.mjs
│  ├─ open-claude-hands-on.ps1
│  ├─ preflight-claude-hands-on.ps1
│  ├─ reset-hands-on.ps1
│  └─ validate-package.mjs
└─ docs/
   ├─ basic-design.md
   ├─ claude-hands-on.html
   ├─ claude-hands-on.md
   ├─ test-spec.md
   └─ operator-story.md
```

- `claude-demo`: Claude Codeに開かせる範囲。参加者が実際に使うファイルだけを収録
- `claude-demo/app/index.html`: テスト環境と本番環境へ配置する画面
- `claude-demo/docs/basic-design.md`: 基本設計。利息切捨てと元金最終月調整を記載
- `claude-demo/docs/test-spec.md`: 意図的な矛盾とテスト漏れを残したテスト仕様書兼成績書
- `.hands-on-baseline`: 100年上限の初期状態。Claude Codeには開かせない
- `scripts/reset-hands-on.ps1`: `claude-demo`を初期状態へ戻す運営者用スクリプト
- `docs/operator-story.md`: 参加者へ見せない答え合わせと完了条件
- `docs/claude-hands-on.md`: テストレビューと30年上限への仕様変更手順
- `docs/claude-hands-on.html`: 進捗をブラウザ内へ保存できる参加者向けガイド
- `CLAUDE.md`: Claude Codeが常時参照する作業順序と検証手順

## Claude Codeハンズオン

所要時間は約45分。Claude Codeで`claude-demo`だけを開いた状態にし、`docs/claude-hands-on.html`の手順に沿って進める。

## ローカル起動

`claude-demo`をカレントディレクトリにし、ローカルだけへ公開する。

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

ブラウザで `http://127.0.0.1:8765/app/` を開く。

## 初期状態へ戻す

リポジトリのルートで実行する。`claude-demo`の内容は、100年上限の開始状態へ置き換わる。

```powershell
.\scripts\reset-hands-on.ps1
```

本番環境まで30年上限を反映した後は、この復元を別ブランチでコミットし、同じPull Requestと承認手順で`main`へ戻す。これにより、テスト環境と本番環境も次回用の初期状態へ戻る。

## 現在の計算状態

`claude-demo`の画面は、元利均等、元金均等および元金据置の概算に加え、月別の返済予定表を12件ずつ表示する。計算内部では小数を保持し、画面表示時だけ円単位へ丸めている。基本設計書の「毎月利息」と「元金の端数」はまだ計算エンジンへ反映していない。

基本設計書の「毎月利息」とテスト仕様書兼成績書の「利息端数」は、テストレビューで発見する意図的な不整合として残している。

画面配色は、日本政策金融公庫の公開Webサイトで使われている深緑、緑、生成りおよび青を参考にしている。ロゴ、名称表示または固有レイアウトは複製していない。
