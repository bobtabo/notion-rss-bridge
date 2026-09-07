import { Client } from "@notionhq/client";

interface Env {
  NOTION_PAGE_ID: string;
  NOTION_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const notion = new Client({ auth: env.NOTION_API_KEY });
    const pageId = env.NOTION_PAGE_ID;
    const cleanPageId = pageId.replace(/-/g, "");

    try {
      // 1. 指定したページのブロック一覧（子ブロック）を取得
      const blocksResponse = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
      });

      // 2. ページ自体のタイトルを取得（RSSのチャンネル名用）
      const pageInfo = await notion.pages.retrieve({ page_id: pageId });
      // @ts-ignore
      const pageTitle = pageInfo.properties?.title?.title?.[0]?.plain_text || "AI駆動開発 開発ログ";

      let itemsXml = "";
      let currentTitle = "";
      let currentContent = "";
      // 記事ごとのpubDate用に現在時刻（またはページの更新日時など）を定義
      const pubDate = new Date().toUTCString();

      // 3. ブロックを走査して「H2見出し」を区切りとして記事（item）に分解する
      for (const block of blocksResponse.results) {
        if (!("type" in block)) continue;

        if (block.type === "heading_2") {
          // 前の記事があればXMLとして確定
          if (currentTitle) {
            const encodedTitle = encodeURIComponent(currentTitle);
            itemsXml += `
              <item>
                <title><![CDATA[${currentTitle}]]></title>
                <link>https://www.notion.so/${cleanPageId}#${encodedTitle}</link>
                <guid>https://www.notion.so/${cleanPageId}#${encodedTitle}</guid>
                <description><![CDATA[${currentContent.trim()}]]></description>
                <pubDate>${pubDate}</pubDate>
              </item>`;
          }
          // 新しいセクションの開始
          // @ts-ignore
          currentTitle = block.heading_2.rich_text.map(t => t.plain_text).join("");
          currentContent = "";
        } else if (block.type === "paragraph" && currentTitle) {
          // @ts-ignore
          const text = block.paragraph.rich_text.map(t => t.plain_text).join("");
          currentContent += `<p>${text}</p>`;
        }
      }

      // 最後の記事を追加
      if (currentTitle) {
        const encodedTitle = encodeURIComponent(currentTitle);
        itemsXml += `
          <item>
            <title><![CDATA[${currentTitle}]]></title>
            <link>https://www.notion.so/${cleanPageId}#${encodedTitle}</link>
            <guid>https://www.notion.so/${cleanPageId}#${encodedTitle}</guid>
            <description><![CDATA[${currentContent.trim()}]]></description>
            <pubDate>${pubDate}</pubDate>
          </item>`;
      }

      // 4. RSS 2.0のXMLフォーマットで出力
      const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${pageTitle}]]></title>
    <link>https://www.notion.so/${cleanPageId}</link>
    <description><![CDATA[Notion page parsed RSS feed for LAPRAS]]></description>
    <language>ja</language>
    ${itemsXml}
  </channel>
</rss>`;

      return new Response(rssXml, {
        headers: {
          "Content-Type": "application/rss+xml; charset=utf-8",
        },
      });

    } catch (error: any) {
      return new Response(`Error generating RSS: ${error.message}`, { status: 500 });
    }
  },
};
