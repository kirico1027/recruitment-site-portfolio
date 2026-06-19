# design-context（blog-article / ブログ記事詳細）

## 取得情報

- 取得日: 2026-06-19
- 取得ノード: `1:2`（1920w light / デザイナーが語るデザインの世界）
- 取得ツール: `get_design_context`, `get_screenshot`
- 備考: 個別ブログ記事の詳細ページテンプレート。サンプル記事として「デザイナーが語るデザインの世界」を実装。

## フォント情報

- 日本語見出し: `Noto Sans JP`（Medium 500 / Bold 700）
- 英字: `Inter`（Medium 500 / Bold 700）
- 本文: `Lato`（Regular 400 / Medium 500）
- アイコン: `Material Icons`

## カラー情報

| 用途 | 値 |
|------|-----|
| テキスト | `#242528` |
| 補助文字色 | `rgba(36, 37, 40, 0.7)` |
| 背景 | `#ffffff` |
| 関連記事セクション背景 | `#f8f8f9` |
| 区切り線（記事内） | `#242528`（2px） |
| 区切り線（セクション） | `rgba(36, 37, 40, 0.1)` |
| CTA背景 | `#54565b` |
| フッター背景 | `#242528` |

## セクション構成

1. 固定ヘッダー — ブログにアクティブインジケータ
2. ヒーロー画像（`1:13`）— 1280×853 相当、角丸 8px
3. シェアバー（`1:172`）— ヒーロー下部左、X / Facebook
4. 記事本文（`1:14`–`1:140`）— 2カラム（左メタ 380px / 右本文 760px、gap 60px）
5. 最新の記事（`1:191`）— 背景 #f8f8f9、3カード
6. CTA — カジュアル面談 + エントリー
7. フッター — トップと共通

## タイポグラフィ（ページ固有）

| 要素 | font | size | weight | line-height |
|------|------|------|--------|-------------|
| サイドバー日（数字） | Inter | 64px | Medium | 64px |
| サイドバー月 | Inter | 16px | Medium | 28px |
| カテゴリ | Lato | 12px | Regular | 21px |
| 記事タイトル h1 | Noto Sans JP | 24px | Medium | 42px |
| エントリーボタン | Noto Sans JP | 18px | Medium | 18px |
| 本文リード h2 | Noto Sans JP | 20px | Medium | 40px |
| セクション見出し h2 | Noto Sans JP | 20px | Medium | 40px |
| 話者名 | Inter | 16px | Medium | 32px |
| 本文 | Lato | 16px | Regular | 32px |
| リスト項目 | Inter + Lato | 16px | Medium / Regular | 32px |
| シェアラベル | Lato | 16px | Regular | 16px |
| 関連記事見出し | Inter | 32px | Bold | 43.2px |
| 関連記事サブ | Inter | 14px | Medium | 24.5px |

## レイアウト

- コンテナ: `l-inset-comp-1920`（1280px 相当 + 40px 内側）
- ヒーロー: pt 40px（ヘッダー下 90px は main padding-top）
- 記事本文: pt 100px / pb 101px、border-bottom rgba(36,37,40,0.1)
- 2カラム: 左 31.667% / 右 63.333% / gap 5%
- 関連記事: pt 100px / pb 101px、見出しとグリッド gap 80px

## 画像

| 用途 | パス |
|------|------|
| ヒーロー | `recruit/blog-01.png` |
| 関連記事1 | `recruit/blog-01.png` |
| 関連記事2 | `recruit/blog-02.png` |
| 関連記事3 | `recruit/blog-03.png` |
| シェア X | `recruit/icon-x.svg` |
| シェア Facebook | `recruit/icon-facebook.svg` |

## 実装ファイル

- HTML: `src/templates/blog-article.html` → `src/blog-article.html`
- SCSS: `src/sass/pages/blog-article/_blog-article-page.scss`
