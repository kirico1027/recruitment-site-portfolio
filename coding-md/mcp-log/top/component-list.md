# コンポーネント一覧

## 新規作成するコンポーネント

| コンポーネント名 | 使用箇所 | 想定パラメータ | 備考 |
|---|---|---|---|
| `top-header` | 全体上部 | logo, navItems[] | 固定ヘッダー |
| `hero` | FV | titleLines[], description, ctaPrimary, ctaSecondary, bgImage | メインビジュアル |
| `section-title` | WHAT WE DO / SERVICES / NEWS / CAREERS | enTitle, jaTitle | 見出し共通化可能 |
| `service-card` | SERVICES | title, description, image, link | 1カラム・2カラムで再利用 |
| `news-card` | NEWS | image, categories[], title, date, href | カード型 |
| `cta-banner` | 中段CTA | title, description, link | 背景グラデーション |
| `footer-promo-card` | フッター上段 | title, subtitle, badge, href | 2枚並び |
| `footer` | フッター下段 | navItems[], copyright | 下部リンク群 |

## ページ固有

| 要素 | 理由 |
|---|---|
| ヒーロー右側SCROLLインジケーター | トップページ固有装飾 |
| SERVICES の 1段目ワイドカードレイアウト | ほかセクションとレイアウト差が大きい |
