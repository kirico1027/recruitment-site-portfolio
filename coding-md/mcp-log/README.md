# MCP ログの保存ルール

Figma MCP の `get_design_context` / `get_variable_defs` / `get_screenshot` で取得した値は、**JSON**（一次ログ）と **Markdown**（整形サマリー）で保存する。

## 保存先

`coding-md/mcp-log/{page}/`

例: `coding-md/mcp-log/top/`、`coding-md/mcp-log/about/`

## ファイル形式・命名

MCP ログは用途によって 2 種類のファイル形式を使い分ける。

### 1. 一次ログ（JSON）

MCP から返ってきたレスポンスを、そのまま保存する一次データ。

- **形式**: JSON（`.json`）
- **命名**: `YYYYMMDD_{section}.json`

例:

- `coding-md/mcp-log/top/20260120_fv.json`
- `coding-md/mcp-log/top/20260120_header.json`
- `coding-md/mcp-log/common/20260120_variables.json`

### 2. 整形サマリー（Markdown）

後続工程（品質チェック・コンポーネント検出など）で参照しやすいように、一次ログを人間向けに整形したファイル。

- **形式**: Markdown（`.md`）
- **用途別の命名**:
  - `design-context.md` — ページ単位のフォント・カラー・タイポグラフィ・画像一覧などのサマリー（工程 6 で参照）
  - `component-list.md` — コンポーネント一覧（工程 3 で作成）

例:

- `coding-md/mcp-log/top/design-context.md`
- `coding-md/mcp-log/top/component-list.md`

## 保存内容

### JSON（一次ログ）

MCP から返ってきたレスポンスを、そのまま（または必要な部分だけを構造化して）JSON で保存する。

- `get_design_context` → 返却オブジェクトを JSON で保存
- `get_variable_defs` → 返却オブジェクトを JSON で保存
- `get_screenshot` → 画像バイナリではなく、メタ情報（nodeId・取得日時など）を JSON で保存する。画像ファイルは別途手動保存する場合はパスを JSON に記載

最低限、次のようなメタ情報を JSON に含めるとよい。

```json
{
  "source": "get_design_context",
  "nodeId": "1:4700",
  "fetchedAt": "2026-01-20T15:00:00",
  "page": "top",
  "section": "header",
  "data": {}
}
```

`data` に MCP の返却内容をそのまま入れるか、必要なキーだけ抜き出して格納する。

### Markdown（整形サマリー）

`design-context.md` には、後続工程が参照しやすいよう以下の情報を整形して記載する。

- **フォント情報**: font-family, font-weight の一覧
- **カラー情報**: CSS 変数名とカラーコードの対応表
- **タイポグラフィ詳細**: セクションごとの font-size, line-height, letter-spacing
- **画像一覧**: 使用されている画像のファイル名と保存先パス

`component-list.md` の書き方は [`03-component-detection/WORKFLOW_03_COMPONENT_DETECTION.md`](../03-component-detection/WORKFLOW_03_COMPONENT_DETECTION.md) を参照。

## 補足

- 画像取得の指示がない限り、`get_design_context` では `dirForAssetWrites` を指定せず、デザイン情報のみ取得する。
- スクリーンショット画像は MCP がファイル保存しないため、必要なら Figma から手動で保存し、そのパスを JSON に書いておく。
