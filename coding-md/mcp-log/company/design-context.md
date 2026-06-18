# design-context（company）

## 取得情報

- 取得日: 2026-06-18
- 取得ノード: `1:2`（フレーム名: 1920w light / 会社情報ページ）
- 取得ツール: `get_design_context`, `get_variable_defs`, `get_screenshot`

## フォント情報

- 英字見出し: `Inter`（Medium 500 / Bold 700）
- 本文・英字サブ: `Lato`（Regular 400 / Medium 500）
- 日本語: `Noto Sans JP`（Medium 500 / Bold 700）

※ プロジェクト既存スタックと同一（`--font-en: Inter`, `--font-body: Lato`, `--font-ja: Noto Sans JP`）

## カラー情報

- `#242528` — 本文・見出し（`--color-text`）
- `#FFFFFF` — 白背景（`--color-bg`）
- `rgba(36, 37, 40, 0.7)` — 補助テキスト（`--color-text-muted`）
- `rgba(36, 37, 40, 0.1)` — セクション区切り線（`--color-border`）
- `#54565b` — CTA 背景（`--color-bg-cta`）

`get_variable_defs` は空オブジェクト `{}`（ファイル変数未定義）。

## セクション構成

1. 固定ヘッダー（ロゴ・グロナビ・「会社情報」アクティブ）
2. ページイントロ — 「会社概要」+ リード文（2 カラム）
3. MISSION — 左ラベル + 英見出し + 和文サブ / 右説明文
4. VISION — 同上レイアウト
5. MESSAGE — 代表のメッセージ（左テキスト + 右肖像）
6. ABOUT — 会社概要（左 Google マップ + 右定義リスト）
7. CTA セクション（共通パーシャル）
8. フッター（共通パーシャル）

## タイポグラフィ（主要）

| 要素 | font | size | weight | line-height |
|------|------|------|--------|-------------|
| ページタイトル | Noto Sans JP | 48px | 500 | 64.8px |
| イントロ本文 | Lato | 18px | 500 | 31.5px |
| MISSION/VISION 英見出し | Inter | 64px | 500 | 64px |
| MISSION/VISION ラベル | Inter | 16px | 700 | 21.6px |
| 和文サブ | Lato | 16px | 400 | 32px |
| 右説明文 | Lato | 14px | 400 | 28px |
| セクション見出し | Noto Sans JP | 32px | 700 | 43.2px |
| 代表引用 | Noto Sans JP | 24px | 500 | 32.4px |
| 会社概要 dl | Noto Sans JP / Lato | 14px | 500/400 | 28px |

## 画像一覧

| 用途 | ファイル | 元 MCP アセット |
|------|----------|-----------------|
| 代表写真 | `src/public/assets/img/company/message_01.png` | 1769d66a… |
| 地図 | Google Maps iframe（Figma 1:48 相当） | インタラクティブ埋め込み |

## 実装ファイル

- `src/templates/company.html`
- `src/sass/pages/company/_company-page.scss`
- `src/sass/components/figma-media/_figma-media.scss`（`figma-media--company-message`）
