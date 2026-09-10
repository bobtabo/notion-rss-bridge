# Notion RSS Bridge 🚀

Notionの特定ページ（開発ログなど）のブロック構造をパースし、Cloudflare Workers経由でRSS 2.0フィード（XML）として自動配信するためのブリッジスクリプトです。<br/>
LAPRASなどの外部プロフィールへの自動連携に最適です ✨

## 🛠 概要

* **Runtime**: Cloudflare Workers ⚡
* **Library**: `@notionhq/client` 📦
* **Output**: RSS 2.0 (XML) 📡

## ⚙️ セットアップ手順

1. **Notionインテグレーションの作成** 🔑
   1. Notionのインテグレーション設定からアクセストークン（シークレット）を取得する。
   2. 対象のNotionページの右上「…」メニュー ＞「接続」から、作成したインテグレーションを許可する。

2. **Cloudflare Workersの設定** 🔐
   1. Cloudflareの **Account Home** の左メニューから **Build > Compute > Workers & Pages > notion-rss-bridge** を開く
   2. **Settings** タブを開く
   3. **Runtime variables and secrets** の **Add variable** ボタンから、以下のシークレット・環境変数を登録する

| Type | Name | Value |
| :--- | :--- | :--- |
| Secret | `NOTION_API_KEY` | Notionのアクセストークン |
| Text | `NOTION_PAGE_ID` | 読み込みたいNotionページのID<br/>（※ `AI-XXXX` のようなプレフィックスが含まれる場合は、`XXXX` の32桁のUUID部分のみ） |

3. **デプロイ** 🚀<br/>
   GitHubリポジトリにプッシュすることで、Cloudflare Workers側で自動的にビルド・デプロイされます。
