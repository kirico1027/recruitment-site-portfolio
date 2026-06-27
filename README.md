# FRACTAL Recruitment Site

架空の IT 企業「FRACTAL」の採用サイトを想定したポートフォリオ作品です。
Figma デザインをもとに、HTML・SCSS・JavaScript・Gulp でコーディングを行い、ページ構成・コンポーネント設計・レスポンシブ対応・ビルドフローまで実務を意識して制作しました。
デザインの再現性だけでなく、保守性・再利用性・運用のしやすさも考慮した構成を目指しています。

---

## Demo

| 項目 | URL |
|------|-----|
| Demo Site | https://recruitment-site-portfolio-aj5y.vercel.app |
| Repository | https://github.com/kirico1027/recruitment-site-portfolio |

---

## プロジェクト概要

採用候補者向けのコーポレート採用サイトです。トップページを中心に、募集職種・会社情報・社員ブログ・応募導線を一通り実装しています。

| 項目 | 内容 |
|------|------|
| ページ数 | 10 ページ |
| コーディング | マークアップ / SCSS / JavaScript |
| デザイン | Figma（コーディング時に参照） |
| ビルド環境 | Gulp |
| 公開 | Vercel |
| 対応ブラウザ | Chrome / Safari / Firefox（最新版） |
| 対応デバイス | PC・タブレット・スマートフォン（レスポンシブ） |

### ページ一覧

| ページ | ファイル | 概要 |
|--------|----------|------|
| 採用トップ | `index.html` | ヒーロー・ミッション・募集職種・インタビュー・福利厚生・ブログ・FAQ・CTA |
| 募集職種一覧 | `jobs.html` | 職種カード一覧 |
| デザイナー | `designer.html` | 職種詳細・関連ブログ |
| UX デザイナー | `designer-ux.html` | 職種詳細（下層） |
| 会社情報 | `company.html` | ミッション / ビジョン・代表メッセージ・会社概要 |
| ブログ一覧 | `blog.html` | 注目記事・カードグリッド |
| ブログ記事詳細 | `blog-article.html` | 記事本文・関連記事 |
| ニュース | `blog-news.html` | カテゴリ別一覧 |
| 社員紹介 | `blog-staff.html` | カテゴリ別一覧 |
| インタビュー | `blog-interview.html` | カテゴリ別一覧 |

---

## 使用技術

| 区分 | 技術 |
|------|------|
| マークアップ | HTML5（セマンティック + BEM） |
| スタイル | SCSS（Dart Sass）/ CSS Custom Properties |
| スクリプト | Vanilla JavaScript（ES5+） |
| アニメーション | **GSAP / ScrollTrigger** |
| ビルド | Gulp 5 |
| テンプレート | gulp-file-include（パーシャル展開） |
| 開発サーバー | BrowserSync |
| フォント | Google Fonts（Noto Sans JP / Inter / Lato） |
| アイコン | Material Icons |

---

## 開発環境

| 項目 | バージョン |
|------|-----------|
| Node.js | 20.x 推奨 |
| npm | 10.x 推奨 |
| Gulp | 5.0.1 |
| Sass | 1.99.0 |

---

## 実装機能

### UI・レイアウト

- **レスポンシブ対応** — `clamp()` / メディアクエリによる可変タイポグラフィ・余白
- **共通インセット** — `.l-inset-comp-1920` による最大幅 1200px + 可変横余白
- **共通パーツ** — ヘッダー・フッター・CTA・応募モーダルをパーシャル化
- **BEM 設計** — ブロック / エレメント / モディファイアで命名を統一

### インタラクション

- **GSAP ScrollTrigger によるスクロールアニメーション** — セクション見出し・カード・CTA などの scroll-reveal
- **Hero 初回表示アニメーション** — GSAP によるヒーロー・ミッションの段階的フェードイン
- **インタビュースライダー** — 横スクロール + 前後ボタン・位置記憶
- **FAQ アコーディオン** — 開閉アニメーション付き
- **応募モーダル** — エントリー / カジュアル面談のスライドインモーダル
- **ヘッダードロワー** — スマートフォン向けハンバーガーメニュー
- **Hover Animation** — リンク・ボタン・カードのホバー演出

### アクセシビリティ・品質

- `aria-*` 属性・`aria-current` による現在地表示
- `prefers-reduced-motion` 対応（アニメーション軽減）
- Safari 向け横インセット・`object-fit: cover` 画像レイアウトの個別対応
- Lighthouse による品質確認

---

## ディレクトリ構成

```text
project3/
├── gulpfile.js              # Gulp タスク定義（Sass コンパイル・HTML 展開・開発サーバー）
├── package.json
├── README.md
├── coding-md/               # 制作ルール・ワークフロー・スクリーンショット
└── src/
    ├── templates/           # ページテンプレート（編集の正）
    ├── partials/            # 共通パーツ（head / header / footer / CTA / モーダル）
    ├── index.html           # ビルド生成 HTML（ブラウザはこちらを参照）
    ├── jobs.html
    ├── company.html
    ├── blog.html            # 他ページも同様
    ├── sass/
    │   ├── main.scss        # SCSS エントリーポイント
    │   ├── foundation/      # reset / variables / mixins / functions
    │   ├── layout/          # コンテナ・インセット
    │   ├── components/      # 共通コンポーネント
    │   └── pages/           # ページ別スタイル
    └── public/
        └── assets/
            ├── css/         # コンパイル済み CSS（main.css）
            ├── js/          # script.js
            └── img/         # 画像アセット
```

> **補足:** HTML の編集は `src/templates/` と `src/partials/` を正とし、`npm run build` で `src/*.html` を再生成します。

---

## 工夫した点（Highlights）

### 1. テンプレートとビルドの分離（コンポーネント化）

ヘッダー・フッター・CTA・モーダルなど共通部分を `partials/` に切り出し、`gulp-file-include` で各ページに展開しています。
10 ページ規模でも修正箇所を最小限に抑え、実務のコンポーネント運用に近い構成にしました。

### 2. GSAP ScrollTrigger によるアニメーション設計

GSAP / ScrollTrigger を用いてスクロールアニメーションを実装しました。
発火条件・スタガー・`prefers-reduced-motion` を JavaScript / SCSS で一元管理し、トップ・下層・ブログ・会社情報などページごとに最適なアニメーションを配置。サイト全体の統一感を意識しています。

### 3. Safari 向けレイアウト対策

`.l-inset-comp-1920` の横余白は、`min()` / `calc()` ではなく `padding` + `content-box` + `max-width` で実装しています。
Safari で余白が消える・非対称になる問題を調査・修正し、Chrome と同等のレイアウトを実現しました。

### 4. Figma 準拠のメディアコンポーネント

`.figma-media` モディファイアで、ヒーロー・ブログカード・インタビュー・ギャラリーなど用途別の画像比率を管理しています。
`aspect-ratio` と `object-fit: cover` を組み合わせ、デザインの寸法を再現しています。

### 5. レスポンシブ設計と情報設計

PC・タブレット・スマートフォンまで対応し、可変余白・可変タイポグラフィを採用しています。

ブログのカテゴリ分け（ニュース / 社員紹介 / インタビュー）、職種詳細の階層（一覧 → 職種 → ポジション）、応募導線（CTA → モーダル）など、実際の採用サイトでよくある情報設計を再現しました。

```
募集職種 → 職種詳細 → 募集詳細
ブログ → カテゴリ一覧 → 記事詳細
```

---

## 制作期間

| 項目 | 期間 |
|------|------|
| 制作 | 2026 年 6 月 12 日 〜 2026 年 6 月 27 日（約 2 週間） |
| コミット数 | 45 |

---

## 今後改善したい点（Future Improvements）

- [ ] **画像の最適化** — WebP 変換・`loading="lazy"` の徹底
- [ ] **フォーム送信** — 応募モーダルのバックエンド連携（現在は UI のみ）
- [ ] **E2E テスト** — Playwright による表示・操作テストの追加
- [ ] **コンポーネントドキュメント** — Storybook 等での UI カタログ化
- [ ] **パフォーマンス計測** — Lighthouse スコアの改善と計測の自動化
- [ ] **SEO 改善** — メタ情報・構造化データの整備

---

## セットアップ方法（Setup）

### 1. リポジトリのクローン

```bash
git clone git@github.com:kirico1027/recruitment-site-portfolio.git
cd recruitment-site-portfolio
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

Sass のコンパイル・HTML のパーシャル展開・BrowserSync によるライブリロードが有効になります。

```bash
npm run serve
```

ブラウザで `http://localhost:8080/index.html` を開いて確認してください。

### 4. ビルド（本番用ファイルの生成）

```bash
npm run build
```

| 処理 | 出力先 |
|------|--------|
| SCSS コンパイル | `src/public/assets/css/main.css` |
| テンプレート展開 | `src/*.html` |

### 利用可能な npm スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run serve` | 開発サーバー起動（ビルド + 監視 + ライブリロード） |
| `npm run build` | Sass コンパイル + HTML パーシャル展開 |
| `npm run gulp` | Gulp を直接実行 |

---

## ライセンス（License）

このリポジトリはポートフォリオ用途の制作物です。
画像・テキスト等のコンテンツは架空のものであり、実在の企業・サービスとは関係ありません。
