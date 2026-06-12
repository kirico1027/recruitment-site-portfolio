# design-context（company）

## 取得情報

- 取得日: 2026-05-05
- 取得ノード: `1:2`（フレーム名: 1920w light / 会社ページ）
- 取得ツール: `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`

## フォント情報

- 英字: `Montserrat`（Medium 500 / SemiBold 600 相当で見出し、Bold 700 でフッターカードタイトルなど）
- 日本語: `Noto Sans JP`（Regular 400 / Medium 500 / Bold 700）

※ トップページと同一スタック。会社ページ見出しは Figma 上 SemiBold のため、フォント読み込みに `600` を追加。

## カラー情報

- `#111111` — 本文・フッター背景・強調
- `#FFFFFF` — 白背景・FV 上の見出し色
- `#F8F7F6` — ライトセクション背景（ミッション・メッセージ）
- `#E3E3E3` / `#E8E8E8` — 会社概要リストの区切り線
- `#222222` — 会社名など一部テキスト

`get_variable_defs` は空オブジェクト `{}`（ファイル変数未定義）。

## セクション構成

1. 固定ヘッダー（ロゴ SVG・グロナビ）
2. FV — 背景写真 + 「COMPANY」「会社情報」
3. OUR MISSION — 左テキスト / 右 2×2 写真グリッド
4. VALUES — 左写真 / 右バリュー 2×2
5. MESSAGE — 左テキスト / 右代表写真
6. ABOUT — 左写真 / 右会社概要リスト
7. フッター（CTA カード・ロゴ・ナビ・コピーライト）

## 画像一覧（プロジェクト配置）

| 用途 | ファイル | 元 MCP アセット（ハッシュ） |
|------|----------|------------------------------|
| FV | `src/public/assets/img/company/fv_01.png` | 0686c9b2… |
| ミッション 1–4 | `mission_01.png` … `mission_04.png` | 046ce686… ほか |
| バリュー左 | `values_01.png` | f2fc8c9e… |
| メッセージ右 | `message_01.png` | 83c5c118… |
| 会社概要左 | `about_01.png` | 5cf12b3a… |

ヘッダー・フッターのロゴ SVG はトップと共通パス（`logo-header-figma.svg`, `logo-footer.svg`）。

## 実装メモ

- `src/company.html` + `src/sass/pages/company/_company.scss`
- スタイルは `src/sass/company.scss` から `pages/top/top` を読み込みヘッダー・フッター等を共有

## 工程5（スクリーンショット）

- Playwright: `coding-md/mcp-log/company/screenshots/` に PC / SP フルページ PNG を保存済み（タイムスタンプ付きファイル名）。
