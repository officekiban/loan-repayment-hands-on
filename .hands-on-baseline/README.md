# Claude Code デモ用フォルダ

このフォルダだけをClaude Codeで開く。

## 入っているもの

- `docs/basic-design.md`: 返済シミュレータの基本設計書
- `docs/test-spec.md`: 意図的に確認漏れを残したテスト仕様書兼成績書
- `app/loan-repayment-simulator.html`: 編集する画面
- `app/index.html`: テスト環境と本番環境へ配置する生成後画面
- `scripts/`: 生成と検証に使うスクリプト

## 開発環境

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

<http://127.0.0.1:8765/app/> を開く。

## 検証

```powershell
npm run check
```

初期状態への復元は、このフォルダの外にある`../scripts/reset-hands-on.ps1`を運営者が実行する。
