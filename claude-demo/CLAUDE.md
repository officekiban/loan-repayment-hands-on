# Claude Code hands-on instructions

## 最初に読むもの

1. `docs/basic-design.md`
2. `docs/test-spec.md`
3. `app/loan-repayment-simulator.html`

## 作業ルール

- レビューを依頼されたときは、ファイルを変更しない。
- 指摘の根拠はIDだけでなく、文書名と項目名で示す。
- 仕様変更では、基本設計書、テスト仕様書兼成績書、編集元HTML、生成後HTMLを同じ内容にそろえる。
- 編集する画面は`app/loan-repayment-simulator.html`。`app/index.html`は`npm run build`で生成する。
- 利息端数処理の不整合は、明示的に依頼されない限り変更しない。
- 作業の最後に`npm run check`を実行し、変更箇所と結果を報告する。

## 使用するコマンド

```powershell
npm run check
python -m http.server 8765 --bind 127.0.0.1
```
