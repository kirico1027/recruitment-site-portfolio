# design-context（staff / 社員紹介一覧）

## 取得情報

- 取得日: 2026-06-19
- 取得ノード: `2:2`（1920w light / 社員紹介ページ）
- 取得ツール: `get_design_context`, `get_variable_defs`, `get_screenshot`

## フォント情報

- 日本語: `Noto Sans JP`（Medium 500 / Bold 700）
- 英字: `Inter`（Medium 500 / Bold 700）
- 本文: `Lato`（Regular 400 / Medium 500）
- アイコン: `Material Icons`

## カラー情報

| 用途 | 値 |
|------|-----|
| テキスト | `#242528` |
| 背景 | `#ffffff` |
| 区切り線 | `rgba(36, 37, 40, 0.1)` |
| カード画像プレースホルダ | `#f0efef` |
| CTA背景 | `#54565b` |
| フッター背景 | `#242528` |

## セクション構成

1. 固定ヘッダー — ブログにアクティブインジケータ
2. ページイントロ（`2:171`）— パンくず + h1「社員紹介」
3. カテゴリフィルター（`2:51`）— ニュース / 社員紹介 / インタビュー
4. 記事一覧（`2:90`–`2:168`）— 4件カード、3列グリッド
5. CTA — カジュアル面談 + エントリー
6. フッター — トップと共通

## タイポグラフィ（ページ固有）

| 要素 | font | size | weight | 備考 |
|------|------|------|--------|------|
| パンくず | Lato | 14px | Regular | line-height 14px |
| ページ見出し h1 | Inter | 48px | Medium | letter-spacing 2.4px, line-height 64.8px |
| フィルターリンク | Lato | 14px | Regular | ブログ一覧と同一 |
| カード日 | Inter | 36px | Medium | トップ・ブログと同一 |
| カード月 | Inter | 12px | Medium | line-height 21px |
| カードカテゴリ | Lato | 12px | Regular | line-height 21px |
| カードタイトル | Inter | 16px | Medium | line-height 28px |

## レイアウト

- コンテナ: `l-inset-comp-1920`（1280px 相当 + 40px 内側）
- イントロ: pt 160px / pb 80px、パンくずと h1 の gap 20px
- フィルター: pt 40px / pb 41px、リンク gap 40px
- 記事グリッド: pt 100px / pb 101px、3列グリッド（4件表示）

## 画像

| 用途 | パス |
|------|------|
| 記事1 | `recruit/blog-03.png` |
| 記事2 | `recruit/blog-04.png` |
| 記事3 | `recruit/blog-06.png` |
| 記事4 | `recruit/blog-09.png`（コンパクト比率） |

## 実装ファイル

- HTML: `src/templates/blog-staff.html` → `src/blog-staff.html`
- SCSS: `src/sass/pages/blog-staff/_blog-staff-page.scss`
