# 返済シミュレータ ハンズオン

- パッケージ版: v0.3
- 用途: AIエージェントによる成果物照合、仕様不整合の検出、人間判断への引継ぎを体験する
- 対象情報: ダミー値のみ
- 非対象: 実際の融資条件、審査、契約、返済額の確定

## 構成

```text
loan-repayment-hands-on/
├─ .github/workflows/release.yml
├─ .claude/settings.json
├─ .gitignore
├─ CLAUDE.md
├─ README.md
├─ package.json
├─ package-lock.json
├─ app/
│  ├─ index.html
│  └─ loan-repayment-simulator.html
├─ scripts/
│  ├─ build-standalone.mjs
│  ├─ capture-staging.mjs
│  ├─ open-claude-hands-on.ps1
│  ├─ preflight-claude-hands-on.ps1
│  └─ validate-package.mjs
└─ docs/
   ├─ basic-design.md
   ├─ cicd-setup.md
   ├─ claude-hands-on.html
   ├─ claude-hands-on.md
   ├─ test-spec.md
   └─ operator-story.md
```

- `app/index.html`: ブラウザで操作する単体ページ
- `app/loan-repayment-simulator.html`: 会話内表示用の編集元
- `scripts/build-standalone.mjs`: 編集元から配布用`index.html`を生成
- `docs/basic-design.md`: 基本設計。利息切捨てと元金最終月調整を記載
- `docs/test-spec.md`: テスト仕様。利息を四捨五入する期待値を記載
- `docs/operator-story.md`: 参加者へ見せない運営用の狙いと期待行動
- `.github/workflows/release.yml`: ステージング、自動画面確認、人間承認、本番デプロイ
- `docs/cicd-setup.md`: GitHubとCloudflare Pagesの設定手順、判断点、留保
- `docs/claude-hands-on.md`: Claude Codeハンズオンの全体像、時間配分、プロンプト例、チェックリスト
- `docs/claude-hands-on.html`: 進捗をブラウザ内へ保存できる参加者向けガイド
- `CLAUDE.md`: Claude Codeが常時参照する安全境界、判断停止条件、検証手順
- `.claude/settings.json`: 読取・検証を中心にし、秘密値、push、deployを抑止する共有設定

## Claude Codeハンズオン

標準45分、短縮30分。初回は次を実行する。

```powershell
npm ci
powershell -ExecutionPolicy Bypass -File scripts/preflight-claude-hands-on.ps1
powershell -ExecutionPolicy Bypass -File scripts/open-claude-hands-on.ps1
claude --permission-mode plan
```

ログイン、契約または組織ポリシーの設定は利用者側で確認する。このリポジトリへTokenやSecretを保存せず、`--dangerously-skip-permissions`は使わない。

## ローカル起動

このフォルダをカレントディレクトリにし、ローカルだけへ公開する。

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

ブラウザで `http://127.0.0.1:8765/app/` を開く。

## 現在の計算状態

画面は、元利均等、元金均等および元金据置の概算を表示する。計算内部では小数を保持し、画面表示時だけ円単位へ丸めている。基本設計の`BD-RND-01`と`BD-RND-02`はまだ計算エンジンへ反映していない。

この未反映と、基本設計・テスト仕様の利息端数処理の不整合を、AIが推測で解消しないことを確認する。人間が正とする規則を決めた後、基本設計、テスト仕様、実装および期待値を同じ変更内でそろえる。
