# コンポーネント一覧（recruit / 採用サイト）

## 新規作成するコンポーネント

| コンポーネント名 | 使用箇所 | 想定パラメータ | 備考 |
|---|---|---|---|
| `top-header` | トップページ上部 | logo, navItems[], ctaLink | 固定ヘッダー・ドロップダウン |
| `section-heading` | Jobs / Welfare / Blog / Interviews / FAQ | jaTitle, enTitle, link? | 日英見出しブロック |
| `job-card` | 募集職種 | image, enRole, jaRole, subLinks[] | 3列グリッド |
| `interview-card` | インタビュー | image, category, title | カルーセル内 |
| `welfare-item` | 福利厚生 | icon, title, description | 4列グリッド |
| `blog-card` | 社員ブログ | image, day, month, category?, title | 3列グリッド |
| `faq-item` | FAQ | question, answer | アコーディオン |
| `top-cta` | ページ下部CTA | icon, title, description, btnLabel | 2カラム |
| `top-footer` | フッター | navLinks[], sns[], copyright | ダーク背景 |

## ページ固有

| 要素 | 理由 |
|---|---|
| ヒーロー（`top-hero`） | 採用トップ固有のFV |
| ミッション（`mission`） | 採用トップ固有レイアウト |
| ギャラリーグリッド（`gallery`） | 採用トップ固有の9枚グリッド |
