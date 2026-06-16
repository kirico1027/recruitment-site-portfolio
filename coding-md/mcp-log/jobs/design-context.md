# design-context（jobs / 募集職種一覧）

## 取得情報

- 取得日: 2026-06-16
- 取得ノード: `1:2`（1920w light / 募集職種下層ページ）
- 取得ツール: `get_metadata`, `get_design_context`, `get_variable_defs`

## フォント情報

- 日本語: `Noto Sans JP`（Medium 500 / Bold 700）
- 英字: `Inter`（Medium 500）
- 本文: `Lato`（Medium 500）
- アイコン: `Material Icons`

## カラー情報

| 用途 | 値 |
|------|-----|
| テキスト | `#242528` |
| テキスト（補助） | `rgba(36, 37, 40, 0.7)` |
| 背景 | `#ffffff` |
| CTA背景 | `#54565b` |
| フッター背景 | `#242528` |
| 白テキスト | `#ffffff` / `rgba(255, 255, 255, 0.95)` |

## セクション構成

1. 固定ヘッダー（`1:268`）— トップと共通、募集職種にアクティブインジケータ
2. ページイントロ（`1:157`）— h1「募集職種」+ リード文（2カラム）
3. 職種一覧（`1:6`–`1:8`）— 5職種カード、2列グリッド
4. CTA（`1:163`）— カジュアル面談 + エントリー
5. フッター（`1:197`）— トップと共通

## タイポグラフィ（ページ固有）

| 要素 | font | size | weight | 備考 |
|------|------|------|--------|------|
| ページ見出し h1（`1:157`） | Noto Sans JP | 48px | Medium | letter-spacing 2.4px, line-height 64.8px |
| リード文（`1:162`） | Lato | 18px | Medium | letter-spacing 0.9px, line-height 31.5px、2行改行 |
| 職種カード英字 | Inter | 14px | Medium | トップと同一 |
| 職種カード日本語 | Noto Sans JP | 24px | Medium | トップと同一 |

## レイアウト

- コンテナ: `l-inset-comp-1920`（1280px 相当 + 40px 内側）
- イントロ: pt 159px / pb 80px、2カラム（各50%）、gap 20px
- 職種グリッド: padding 100px、2列（カード幅 585px / gap 30px / 行間 50px）

## 画像

- 職種カード画像はトップページと同一（`src/public/assets/img/recruit/job-*.png`）
- 新規画像取得は不要（工程2未実施・既存アセット流用）

## 実装ファイル

- HTML: `src/jobs.html`
- SCSS: `src/sass/pages/jobs/_jobs-page.scss`
