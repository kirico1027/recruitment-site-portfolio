# コンポーネント一覧（company）

## 既存コンポーネント（流用）

| コンポーネント名 | 使用箇所 | 備考 |
|------------------|----------|------|
| `top-header` | 全ページ | ロゴ・ハンバーガー・ナビ |
| `footer`（CTA カード〜コピーライト） | 全ページ | `top/_top.scss` に定義 |
| `container` | 各セクション | max-width・横パディング |
| `section` / `section--light` | ミッション・メッセージ | 背景 `#f8f7f6` |
| `section-heading` / `section-title` / `section-subtitle` | 英見出し＋ライン付き日本語ラベル | 会社ページでも同一パターン |

## ページ固有（company で新規）

| ブロック名 | 役割 | 備考 |
|------------|------|------|
| `company-page` | `<main>` ラッパー | — |
| `company-hero` | FV（背景画像・中央見出し） | ブロック名でセクションを識別 |
| `company-hero__*` | メディア・見出し・リード | `__media`, `__inner`, `__title`, `__lead` |
| `company-mission` | ミッションセクション | — |
| `company-mission__layout` | 2 カラム | — |
| `company-mission__grid` | 2×2 画像 | `<ul>` / `company-mission__cell` |
| `company-values` | バリュー（白背景） | — |
| `company-values__layout` | 画像 + テキスト | SP で縦積み |
| `company-values__list` | バリュー 2×2 | `<ul>` |
| `company-message` | 代表メッセージ | — |
| `company-message__layout` | テキスト + 肖像 | — |
| `company-about` | 会社概要 | — |
| `company-about__layout` | 画像 + `dl` | — |
| `company-about__list` / `company-about__row` / `__term` / `__value` | 定義リスト | ボーダーでテーブル風 |

共通パーツへの切り出しは、他ページで同型セクションが増えた段階で検討する。
