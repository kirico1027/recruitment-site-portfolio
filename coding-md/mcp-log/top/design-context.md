# design-context (top)

## 取得情報

- 取得日: 2026-04-27
- 取得ノード: `1:2`（1920w light）
- 取得ツール: `get_metadata`, `get_design_context`, `get_screenshot`, `get_variable_defs`

## フォント情報

- 英字: `Montserrat`（400 / 500 / 700）
- 日本語: `Noto Sans JP`（400 / 500 / 700）
- アイコン: `Material Icons`

## カラー情報

- `#111111`（本文・背景）
- `#FFFFFF`（白文字・ボタン）
- `#F8F7F6`（ライト背景）
- `#AAAAAA`（補助テキスト）
- グラデーション: `rgba(51,51,51,0.5) -> #333333`

## セクション構成

1. 固定ヘッダー
2. ヒーロー（NEW SMART COMPANY）
3. WHAT WE DO
4. SERVICES（3カード）
5. CTAバナー
6. NEWS（3カード）
7. CAREERS
8. フッター

## 画像一覧（MCP参照URL）

- ヒーロー背景: `8e941d1281465cebf62ce669a1a4f883bc7b7f24.png`
- WHAT WE DO: `2b50f7cba596ce618b304f9ff8dd8963ecd79b46.png`
- SERVICES: `131e6e6754d975393235e73fde06aca7474d581f.png`, `f7d82139748fd2d9c9cf2624b83157f302038fb4.png`, `b45a9d83e5f382b1e5e54c158460cbffdb61d1b2.png`
- NEWS: `3cee09230ba1a6530328978fd1cde024c027537b.png`, `63a3d15a182ab0ca9adcc8d7903521d77ff19d38.png`, `fa74d39b0273bb73fdbad9a05c5484147c17a517.png`

## 実装メモ

- 現在はページ骨格を `src/ejs/index.ejs` と `src/sass/pages/top/_top.scss` に実装。
- 画像は工程2の命名済みアセット未提供のため、MCPのlocalhost URLを一時使用。
