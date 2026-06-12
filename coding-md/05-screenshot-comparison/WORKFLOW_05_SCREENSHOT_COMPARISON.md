# 工程 5: スクリーンショット比較と調整

## 概要

Playwright で実サイトのスクリーンショットを取得し、Figma MCP で取得したデザインのスクリーンショットと比較します。差異を修正し、2 回繰り返して精度を上げます。

## 前提条件

- 工程 4（コーディング）が完了していること
- 開発サーバー（Gulp の BrowserSync など）が起動していること

## 出力物

- 実サイトのスクリーンショット: `coding-md/screenshots/` 配下
- Figma デザインのスクリーンショット: `coding-md/mcp-log/{ページ名}/screenshots/` 配下
- 比較用 JSON メタ情報: `coding-md/mcp-log/{ページ名}/YYYYMMDD_screenshot.json`

## 手順

### 1. 実サイトのスクリーンショットを取得（Playwright）

Playwright を使用して、実サイトのスクリーンショットを取得します。

```bash
# 基本的な使用方法（SPビューポートでフルページキャプチャ）
node coding-md/screenshot.cjs

# 特定セクションのみキャプチャ（CSSセレクタを指定）
node coding-md/screenshot.cjs --selector ".l-footer" --viewport sp
node coding-md/screenshot.cjs --selector ".l-header" --viewport pc

# SP/PC両方をキャプチャ
node coding-md/screenshot.cjs --selector ".l-footer" --viewport both

# 出力ファイル名を指定
node coding-md/screenshot.cjs --selector ".l-footer" --name footer
```

**ビューポート設定:**

- `--viewport sp`: 375px 幅（デフォルト）
- `--viewport pc`: 1440px 幅
- `--viewport both`: 両方を出力

出力は `coding-md/screenshots/` 配下に保存されます。

### 2. Figma のスクリーンショットを取得（MCP 経由）

Figma MCP の `get_screenshot` を使用して、比較対象となるデザインのスクリーンショットを取得します。

#### 2-1. ノード ID の確認

1. Figma Desktop で比較したいフレーム・セクションを選択
2. 右サイドバー or URL から **ノード ID**（例: `1:4700`）を取得

#### 2-2. `get_screenshot` の実行

ノード ID を指定して MCP を実行します。

```
get_screenshot(nodeId: "1:4700")
```

**注意**: MCP の `get_screenshot` は画像バイナリを返しますが、**ファイル保存は自動で行われません**。返却画像を手動で `coding-md/mcp-log/{ページ名}/screenshots/` に保存してください。

#### 2-3. 保存ルール

- **保存先**: `coding-md/mcp-log/{ページ名}/screenshots/`
- **命名**: `{セクション名}_{viewport}.png`（例: `header_sp.png`, `fv_pc.png`）
- 同じセクションで SP/PC 両方を取得する場合は `_sp` / `_pc` のサフィックスで区別
- メタ情報（nodeId、取得日時など）は `YYYYMMDD_screenshot.json` として同ディレクトリに保存する

例:

```
coding-md/mcp-log/top/
├── screenshots/
│   ├── fv_sp.png
│   ├── fv_pc.png
│   └── header_pc.png
└── 20260120_screenshot.json
```

### 3. 実サイトと Figma を比較

実サイトのスクリーンショットと Figma のスクリーンショットを並べて比較します。

```bash
# --compare オプションで並べて確認
node coding-md/screenshot.cjs --selector ".l-footer" --compare coding-md/mcp-log/top/screenshots/footer_sp.png
```

#### 比較の観点

以下の観点で差異を確認してください（上から優先度順）。

1. **レイアウトのズレ**
   - 要素の位置・並び順
   - 余白（margin / padding）
   - Flexbox/Grid の配置
2. **サイズの差異**
   - 要素の幅・高さ
   - フォントサイズ
3. **色・塗り**
   - 背景色
   - テキスト色
   - ボーダー色
4. **タイポグラフィ**
   - フォントファミリ
   - 行間（line-height）
   - 文字間（letter-spacing）
5. **画像・アイコン**
   - 使用画像の差し替え忘れ
   - 解像度（@2x）

#### 差異の許容範囲

- **レイアウト・サイズ**: ピクセル単位で差異がないことを目指す（1〜2px の差は許容可）
- **色**: カラーコード単位で一致（`var(--xxx)` の指定ミスがないか）
- **タイポグラフィ**: Figma の値と完全一致

### 4. 差異の修正とフィードバックループ

比較で見つかった差異を修正し、再度スクリーンショットを取得して確認します。

```
実サイトキャプチャ → Figma と比較 → 差異を修正
    ↑                              ↓
    └──────── 差異がなくなるまで繰り返す（最低 2 回）
```

- **1 回目**: 大きなレイアウト・サイズの差異を修正
- **2 回目**: 細部（余白、色、文字組）の差異を修正
- 差異がなくなるまで繰り返す

### 5. 最終確認

- [ ] SP / PC 両方で比較を実施したか
- [ ] 主要セクション（header / fv / 各コンテンツ / footer）を網羅したか
- [ ] MCP ログの screenshots ディレクトリに Figma 側の画像が保存されているか
- [ ] 開発サーバーのコンソールにエラーが出ていないか

## 注意事項

- 開発サーバーが起動している必要があります
- 出力先は `coding-md/screenshots/`（実サイト側）と `coding-md/mcp-log/{ページ名}/screenshots/`（Figma 側）を使い分ける
- スクリーンショット比較は **目視チェック**が基本です（ピクセル差分ツールを使うのは任意）
- Figma のスクリーンショットは、MCP のバイナリ返却を手動保存する必要があります（自動保存はされません）
