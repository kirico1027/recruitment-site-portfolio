# Site Template Base

このフォルダは、今後のサイト制作で再利用するためのベースです。  
過去案件のページ実体（HTML/CSS/画像/JS）とページ固有SCSSを削除し、制作ルールと開発環境を残した状態になっています。

## 含まれているもの

- `coding-md/` : 制作ルール・ワークフロー
- `src/sass/` : Sassの設計基盤（初期エントリー: `main.scss`）
- `src/ejs/`, `src/templates/`, `src/partials/` : テンプレート関連
- `gulpfile.js`, `package.json` : ビルド環境

## 新規案件の開始手順

1. 依存関係をインストール

```bash
npm install
```

2. 開発サーバー起動（監視 + ビルド）

```bash
npm run serve
```

3. 必要なページやアセットを `src/` 配下に追加して制作開始

## 補足

- `node_modules/` は環境依存のためGit管理しません。
- 生成物のソースマップ（`src/public/assets/css/*.map`）は `.gitignore` で除外しています。
