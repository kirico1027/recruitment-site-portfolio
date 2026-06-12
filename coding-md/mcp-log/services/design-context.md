# design-context（services）

## 取得情報

- 取得日: 2026-05-06
- 取得ノード: `1:2`（フレーム名: 1920w light / services ページ）
- 取得ツール: `get_design_context`, `get_variable_defs`, `get_screenshot`

## フォント情報

- 英字: `Montserrat`（Medium 500 / SemiBold 600）
- 日本語: `Noto Sans JP`（Regular 400 / Medium 500 / Bold 700）

## カラー情報

- `#111111` — 本文・ボタン背景・フッター背景
- `#FFFFFF` — カード背景・FV 見出し
- `#F8F7F6` — ページ背景（メインセクション）

`get_variable_defs` の返却は空オブジェクト `{}`（ファイル変数未定義）。

## セクション構成

1. 固定ヘッダー（ロゴ SVG・グロナビ）
2. FV — 背景写真 + 「SERVICES」「事業内容」
3. OUR SERVICES — 見出し + 右リード文
4. サービスカード 3件（左テキスト / 右画像）
5. フッター（CTA カード・ロゴ・ナビ・コピーライト）

## 実装メモ

- `src/services.html` + `src/sass/pages/services/_services.scss`
- 共有コンポーネント（`top-header`, `footer`, `section-heading`）は `pages/top/top` を流用
- 画像は追加ダウンロードせず、MCP が返した `localhost:3845` のアセット URL を参照

## 工程5（スクリーンショット）

- Figma 側: `get_screenshot`（node `1:2`）を取得済み
- 実装側: Playwright で `services.html` の PC/SP を撮影済み
  - `coding-md/mcp-log/services/screenshots/services_fullpage_pc_20260506_011154.png`
  - `coding-md/mcp-log/services/screenshots/services_fullpage_sp_20260506_011154.png`
