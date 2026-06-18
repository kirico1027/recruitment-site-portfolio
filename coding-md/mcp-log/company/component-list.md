# コンポーネント一覧（company）

## 既存コンポーネント（流用）

| コンポーネント名 | 使用箇所 | 備考 |
|------------------|----------|------|
| `top-header` | 全ページ | ロゴ・ハンバーガー・ナビ。「会社情報」リンク追加 |
| `top-cta` | ページ下部 | `partials/cta.html` |
| `footer` | ページ下部 | `partials/footer.html` |
| `entry-modal` | 全ページ | `partials/entry-modal.html` |
| `section-heading` | MESSAGE / ABOUT | 日本語見出し + 英字サブタイトル |
| `figma-media` | 代表写真 | `figma-media--company-message` モディファイア |
| `l-inset-comp-1920` | 各セクション | 横インセット |

## ページ固有（company で新規）

| ブロック名 | 役割 | 備考 |
|------------|------|------|
| `company-page` | `<body>` 修飾 | — |
| `company-main` | `<main>` ラッパー | header 分 pt 90 |
| `company-intro` | ページイントロ | jobs-intro と同型 2 カラム |
| `company-statements` | MISSION + VISION ラッパー | 区切り線付き白背景 |
| `company-statement` | MISSION / VISION 各ブロック | 左ラベル + 英見出し + 右説明 |
| `company-message` | 代表メッセージ | section-heading + 2 カラム |
| `company-about` | 会社概要 | マップ iframe + `dl` 定義リスト |
| `company-about__row` / `__term` / `__value` | 会社情報行 | grid 1fr 3fr |

共通パーツへの切り出しは、他ページで同型セクションが増えた段階で検討する。
