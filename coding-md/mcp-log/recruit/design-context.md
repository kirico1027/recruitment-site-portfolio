# design-context (recruit / 採用サイト)

## 取得情報

- 取得日: 2026-06-12
- 取得ノード: `1:2`（1920w light）
- 取得ツール: `get_metadata`, `get_design_context`, `get_variable_defs`

## フォント情報

- 日本語: `Noto Sans JP`（Medium 500 / Bold 700 / Black 900）
- 英字見出し: `Inter`（Medium 500 / Bold 700）
- 本文・補助: `Lato`（Regular 400 / Medium 500）
- アイコン: `Material Icons`
- SNS: Font Awesome 5

## カラー情報

| 用途 | 値 |
|------|-----|
| テキスト | `#242528` |
| テキスト（補助） | `rgba(36, 37, 40, 0.7)` |
| 背景ライト | `#f8f8f9` / `rgba(248, 248, 249, 0.9)` |
| 白 | `#ffffff` |
| ボーダー | `rgba(36, 37, 40, 0.1)` |
| フッター背景 | `#242528` |
| ミッション背景 | `rgba(36, 37, 40, 0.1)` |
| ライトテキスト | `#f8f8f9` |

## セクション構成

1. 固定ヘッダー（`1:580`）— FRACTAL ロゴ + 採用サイト + ナビ + CTA
2. ヒーロー（`1:5`–`1:9`）— 背景画像 + キャッチコピー
3. ミッション（`1:12`）— MISSION + 英語見出し + 本文 + 画像
4. 募集職種 Jobs（`1:23`）— 5職種カード + サブリンク
5. インタビュー（`1:411`）— カルーセル
6. 福利厚生 Welfare（`1:178`）— 8項目アイコングリッド
7. 社員ブログ Blog（`1:242`）— 6記事カード
8. ギャラリー（`1:333`）— 3×3 画像グリッド
9. FAQ（`1:353`）— アコーディオン 5項目
10. CTA（`1:475`）— カジュアル面談 + エントリー
11. フッター（`1:510`）

## タイポグラフィ（主要）

| 要素 | font | size | weight |
|------|------|------|--------|
| ヒーロー見出し | Noto Sans JP | 78.6px | Black |
| ミッション英字 | Inter | 64px | Medium |
| セクション見出し（日） | Noto Sans JP | 32px | Bold |
| セクション見出し（英） | Inter | 14px | Medium |
| 職種カードタイトル | Noto Sans JP | 24px | Medium |
| 本文 | Lato | 16px | Regular |
| ナビ | Noto Sans JP | 14px | Medium |

## 画像（MCP localhost 参照・工程2未実施）

- ヒーロー背景: `50d888898977bd4ddbd7d91db04d6c3f0b2f1288.png`
- ミッション: `d69d569299f47f9fbb15caa1bf6575e12ebc0419.png`
- ロゴ: `800e83379157976c41cfa24ec3fc2425e01ad1dc.png`
- 職種カード: `01851665568de637f7092d1ea15b2fca358355cc.png` 他

## 実装ファイル

- HTML: `src/index.html`（採用トップ）
- CSS: `src/sass/main.scss` → `src/public/assets/css/main.css`
- ページ SCSS: `src/sass/pages/top/_top-page.scss`
