# GitHub CI/CD ハンズオン設定

## 目的

一つのコミットについて、次の順序を体験する。

1. ファイルと意図的な仕様不整合を自動検査し、配布物を固定する。
2. 架空のステージング環境へ自動デプロイする。
3. ステージングをブラウザ操作し、画面スクリーンショットを保存する。
4. 人がステージングURLとスクリーンショットを確認する。
5. GitHubの`production` Environmentで人が承認する。
6. 承認された同一配布物を架空の本番環境へデプロイする。

## 推奨構成

- 公開GitHubリポジトリ一件。ダミー・公開情報だけを保存する。
- Cloudflare Pages Direct Uploadプロジェクト二件。
  - 架空ステージング用
  - 架空本番用
- GitHub Environment二件。
  - `staging`: 自動実行。承認なし
  - `production`: Required reviewersを設定

CloudflareのGit連携による自動デプロイは使わない。GitHub ActionsからWranglerで直接アップロードし、本番デプロイがGitHubの承認ジョブを通る構成にする。

## 1. GitHubリポジトリ

このフォルダの内容を、新しい公開リポジトリのルートへ置く。GitHub Free、ProまたはTeamでEnvironmentのRequired reviewersを無料利用する場合、リポジトリは公開である必要がある。

`main`にはブランチ保護を設定し、Pull Requestと`Validate package`の成功をマージ条件にする。実在情報、内部資料、個人情報、メールアドレス、認証情報または内部識別子は入れない。

## 2. Cloudflare Pages

Cloudflare PagesでDirect Uploadプロジェクトを二件作る。例示名は次のとおり。

- `loan-hands-on-staging`
- `loan-hands-on-production`

実名、組織名または内部用途をプロジェクト名へ入れない。API Tokenは`Account / Cloudflare Pages / Edit`だけを付与する。Account IDとTokenはファイルやGitへ保存しない。

## 3. GitHub Environments

リポジトリの`Settings > Environments`で`staging`と`production`を作る。それぞれに同じ名前のSecretとVariableを登録するが、値は環境ごとに分ける。

| 種別 | 名前 | staging | production |
|---|---|---|---|
| Secret | `CLOUDFLARE_ACCOUNT_ID` | ステージング配置先の値 | 本番配置先の値 |
| Secret | `CLOUDFLARE_API_TOKEN` | ステージング用Token | 本番用Token |
| Variable | `CLOUDFLARE_PAGES_PROJECT` | ステージング用プロジェクト名 | 本番用プロジェクト名 |

`production`にはRequired reviewersを一人以上設定する。二人で行う場合は`Prevent self-review`を有効にする。一人で体験する場合は無効のままにし、自己承認であることを記録する。可能なら管理者による保護規則の迂回も無効にする。

## 4. 実行

1. 変更をPull Requestで`main`へマージする。
2. `Staging review and production approval`が起動する。
3. 検証ジョブが生成した`release-app-<commit SHA>`を、ステージングと本番の共通配布物として固定する。
4. `capture-staging`完了後、ActionsのSummaryを開く。
5. ステージングURLと`staging-screen-<commit SHA>`を確認する。
6. 待機中の`production` Environmentを承認または拒否する。
7. 承認時だけ、ステージングと同じ`release-app-<commit SHA>`が本番へデプロイされる。

## 判定と留保

- スクリーンショット作成の成功は、内容が正しいという判定ではない。
- GitHubは、承認者が実際にスクリーンショットを開いたことまでは強制しない。確認行為は人間の運用記録である。
- Environment承認はGitHub上のゲートであり、Cloudflareアカウント全体の権限制御を代替しない。
- ステージング用Tokenが本番プロジェクトも変更できる権限を持つ場合、Cloudflare側の技術的分離は不完全である。
- この本番環境はハンズオン上の架空環境であり、実業務の可用性、監視、障害対応または本番統制を証明しない。

## 公式資料

- GitHub Environments: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
- Cloudflare Pages Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/
- Cloudflare PagesとGitHub Actions: https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- Playwright CI: https://playwright.dev/docs/ci
