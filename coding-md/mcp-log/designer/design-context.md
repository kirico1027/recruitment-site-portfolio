# design-context（designer / デザイナー職種詳細）

## 取得情報

- 取得日: 2026-06-16
- 取得ノード: `1:2`（1920w light / デザイナー下層ページ）
- 取得ツール: `get_design_context`, `get_screenshot`

## フォント情報

- 日本語: `Noto Sans JP`（Medium 500 / Bold 700）
- 英字: `Inter`（Medium 500 / Bold 700）
- 本文: `Lato`（Regular 400 / Medium 500）
- アイコン: `Material Icons`

## カラー情報

- 基本文字色: `#242528`
- 補助文字色: `rgba(36, 37, 40, 0.7)`
- 背景色（通常）: `#ffffff`
- ブログセクション背景: `#f8f8f9`
- CTA背景: `#54565b`
- フッター背景: `#242528`

## ページ構成

1. 固定ヘッダー（共通）
2. パンくず + ページ見出し + リード
3. キービジュアル（横長画像）
4. 強みセクション（2項目、左主文 + 右補足）
5. 職種説明文（3段落）
6. 募集ポジション一覧（3件）
7. デザイナーのブログ（2カード + すべてみる）
8. CTA（共通）
9. フッター（共通）

## 実装ファイル

- HTML: `src/designer.html`
- SCSS: `src/sass/pages/designer/_designer-page.scss`
