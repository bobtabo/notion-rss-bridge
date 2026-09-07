# Notion RSS Bridge 🚀

Notionの特定ページ（開発ログなど）のブロック構造をパースし、Cloudflare Workers経由でRSS 2.0フィード（XML）として自動配信するためのブリッジスクリプトです。LAPRASなどの外部プロフィールへの自動連携に最適です ✨

## 🛠 概要

* **Runtime**: Cloudflare Workers ⚡
* **Library**: `@notionhq/client` 📦
* **Output**: RSS 2.0 (XML) 📡

## ⚙️ セットアップ手順

1. **Notionインテグレーションの作成** 🔑
* Notionのインテグレーション設定からアクセストークン（シークレット）を取得する。
* 対象のNotionページの右上「…」メニュー ＞「接続」から、作成したインテグレーションを許可する。


2. **Cloudflare Workersの設定** 🔐
Cloudflareダッシュボードの **Settings > Variables and Secrets** に以下のシークレット・環境変数を登録する：
* `NOTION_API_KEY`: Notionのアクセストークン
* `NOTION_PAGE_ID`: 読み込みたいNotionページのID（※ `AI-XXXX` のようなプレフィックスが含まれる場合は、プレフィックスを除いた `XXXX` の32桁のUUID部分のみを指定する）


3. **デプロイ** 🚀
GitHubリポジトリにプッシュすることで、Cloudflare Workers側で自動的にビルド・デプロイされます。
