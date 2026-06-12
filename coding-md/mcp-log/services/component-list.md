# コンポーネント一覧（services）

## 既存コンポーネント（流用）

| コンポーネント名 | 使用箇所 | 備考 |
|------------------|----------|------|
| `top-header` | 全ページ | ロゴ・ハンバーガー・ナビ |
| `footer`（CTA カード〜コピーライト） | 全ページ | `top/_top.scss` に定義 |
| `container` | 各セクション | max-width・横パディング |
| `section` / `section--light` | メイン背景 | 背景 `#f8f7f6` |
| `section-heading` / `section-title` / `section-subtitle` | OUR SERVICES 見出し | 英語見出し + 日本語ラベル |

## ページ固有（services で新規）

| ブロック名 | 役割 | 備考 |
|------------|------|------|
| `services-page` | `<main>` ラッパー | — |
| `services-hero` | FV（背景画像・中央見出し） | `services-hero__media`, `__inner`, `__title`, `__lead` |
| `services-overview` | OUR SERVICES セクション全体 | 見出し + リード文 |
| `services-overview__head` | 見出し行レイアウト | 左見出し / 右説明 |
| `services-list` | サービスカード一覧 | 3件の縦並び |
| `services-item` | 個別サービスカード | 左テキスト / 右画像 |
| `services-item__content` | テキスト列 | タイトル・説明・CTA |
| `services-item__media` | 画像列 | `aspect-ratio: 437 / 320` |

共通化の判断は「2回目で検討・3回目で共通化」を目安に、他下層ページ実装時に見直す。
