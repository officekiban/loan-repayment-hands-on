# Claude Code ハンズオン

**所要時間: 約30分**

## 0. 開始（2分）

```powershell
powershell -ExecutionPolicy Bypass -File scripts/preflight-claude-hands-on.ps1
powershell -ExecutionPolicy Bypass -File scripts/open-claude-hands-on.ps1
claude --dangerously-skip-permissions
```

## 1. テスト仕様書兼成績書をレビューする（10分）

次のプロンプトをClaude Codeへ貼り付ける。

```text
docs/test-spec.mdを、テスト仕様書兼成績書としてレビューしてください。
docs/basic-design.mdとapp/loan-repayment-simulator.htmlを照合し、まだファイルは変更しないでください。

次の観点で、問題ごとに「指摘」「根拠となるファイルとID」「見逃した場合の影響」「追加または修正すべきテスト」を示してください。

- 基本設計と期待結果の矛盾
- 設計項目に対するテスト漏れ
- 境界値テストの漏れ
- 成績欄だけでは判定できないテスト

重要度の高い順に並べてください。
```

### 答え合わせ

Claudeの回答に、最低限次の4点が含まれていることを確認する。

- [ ] `BD-RND-01`は利息を切り捨てるが、`TS-05`は四捨五入になっている
- [ ] `TS-02`は最終回返済額が必ず同額としており、`BD-RND-02`の最終月調整を判定できない
- [ ] `BD-RND-02`の「元金合計＝借入金額」「最終残高0円」を直接確認するテストがない
- [ ] `IN-03`の返済年数について、1年・100年・0年・101年の境界値テストがない

追加の有効な指摘があってもよい。上の4点を外していたら、根拠ファイルを指定して再レビューさせる。

## 2. 仕様変更を実装する（15分）

続けて、次のプロンプトを貼り付ける。

```text
仕様変更です。返済年数の上限を100年から30年へ変更してください。

次を同じ作業でそろえてください。

1. docs/basic-design.mdのIN-03
2. docs/test-spec.mdの返済年数境界値テスト
   - 30年は受け付ける
   - 31年は入力エラーにする
3. app/loan-repayment-simulator.htmlの入力上限とエラーメッセージ
4. npm run buildで生成するapp/index.html

利息端数処理の不整合は今回の変更対象ではありません。
実装後にnpm run checkを実行し、変更箇所と確認結果を報告してください。
```

### 完了確認

- [ ] `IN-03`が1年以上30年以下になった
- [ ] 画面の返済年数上限が30になった
- [ ] 31年を入力するとエラーになる
- [ ] 30年と31年のテストケースが追加された
- [ ] `app/index.html`が再生成された
- [ ] `npm run check`が成功した

## 3. 終了（3分）

Claudeの最終報告で、変更した4成果物と検証結果を確認して終了する。
