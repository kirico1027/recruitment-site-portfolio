# design-context（blog / ブログ一覧）

## 取得情報

- 取得日: 2026-06-18
- 取得ノード: `1:2`（1920w light / ブログ一覧ページ）
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
| テキスト（補助） | `rgba(36, 37, 40, 0.7)` |
| 背景 | `#ffffff` |
| 区切り線 | `rgba(36, 37, 40, 0.1)` |
| CTA背景 | `#54565b` |
| フッター背景 | `#242528` |

## セクション構成

1. 固定ヘッダー — トップと共通、ブログにアクティブインジケータ
2. ページイントロ（`1:292`）— h1「ブログ」+ リード文（2カラム）
3. 注目記事（`1:51`–`1:71`）— 1200×800 画像 + 日付・カテゴリ・タイトル
4. カテゴリフィルター（`1:73`）— ニュース / 社員紹介 / インタビュー
5. 最新の記事（`1:112`–`1:272`）— 9件カード、3列グリッド
6. CTA — カジュアル面談 + エントリー
7. フッター — トップと共通

## タイポグラフィ（ページ固有）

| 要素 | font | size | weight | 備考 |
|------|------|------|--------|------|
| ページ見出し h1 | Noto Sans JP | 48px | Medium | letter-spacing 2.4px |
| リード文 | Lato | 18px | Medium | letter-spacing 0.9px, line-height 31.5px |
| 注目記事・日（大） | Inter | 64px | Medium | line-height 64px |
| 注目記事・月 | Inter | 16px | Medium | line-height 28px |
| 注目記事タイトル | Noto Sans JP | 24px | Medium | line-height 42px |
| セクション見出し | Noto Sans JP | 32px | Bold | line-height 43.2px |
| カード日 | Inter | 36px | Medium | トップと同一 |
| カードタイトル | Noto Sans JP | 16px | Medium | トップと同一 |
| フィルターリンク | Lato | 14px | Regular | line-height 14px |

## レイアウト

- コンテナ: `l-inset-comp-1920`（1280px 相当 + 40px 内側）
- イントロ: pt 160px / pb 80px、2カラム（各50%）、gap 20px
- 注目記事: 画像 1200×800、本文 gap 40px、pb 80px
- フィルター: pt 40px / pb 41px、リンク gap 40px
- 記事グリッド: pt 100px / pb 101px、3列（gap 80px 行 / 2px 列）

## 画像

| 用途 | パス |
|------|------|
| 注目記事 | `recruit/blog-05.png` |
| グリッド 1–6 | `recruit/blog-01.png` 〜 `blog-06.png`（既存） |
| グリッド 7–9 | 既存アセットを流用（工程2未実施） |

## 実装ファイル

- HTML: `src/templates/blog.html` → `src/blog.html`
- SCSS: `src/sass/pages/blog/_blog-page.scss`
