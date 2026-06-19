# コンポーネント一覧（blog-article / ブログ記事詳細）

## 共通コンポーネント（既存を流用）

| コンポーネント | クラス | 参照元 |
|---|---|---|
| ヘッダー | `top-header` | `partials/header.html` |
| CTA | `top-cta` | `partials/cta.html` |
| フッター | `top-footer` | `partials/footer.html` |
| エントリーモーダル | `entry-modal` | `partials/entry-modal.html` |
| ブログカード | `blog-card` | `top-page.scss` |

## ページ固有

| ブロック | 説明 |
|---|---|
| `blog-article-hero` | ヒーロー画像 + シェアバー |
| `blog-article-body` | 2カラム記事レイアウト |
| `blog-article-meta` | 左サイドバー（日付・カテゴリ・タイトル・CTA） |
| `blog-article-content` | 右本文（見出し・対談・区切り線） |
| `blog-article-related` | 最新の記事セクション |
