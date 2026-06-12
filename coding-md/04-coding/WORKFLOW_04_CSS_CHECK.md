# 工程 4 補足: SCSS チェック

## 概要

SCSS の書き方が正しいかチェックします。規約遵守、パフォーマンス、レスポンシブ対応なども含めて総合的にチェックします。

## 前提条件

- SCSS ファイルが作成されていること

## チェック項目

### 1. SCSS 規約の遵守

#### 1.1. BEM 記法の使用

- [ ] すべてのクラス名が BEM 記法に従っているか
- [ ] ブロック、エレメント、モディファイアの命名が正しいか

**例**:

```scss
// 正しい
.news__item {
}
.news__item-title {
}
.news__item--notice {
}

// 間違い
.news-item {
}
.newsItem {
}
```

#### 1.2. 入れ子禁止（ネスト禁止）

- [ ] すべてのクラスがフラットに記述されているか
- [ ] ネストが使用されていないか

**例**:

```scss
// 正しい
.news__item {
}
.news__item-title {
}
.news__item-text {
}

// 間違い
.news__item {
  &-title {
  }
  &-text {
  }
}
```

#### 1.3. rem()関数の使用

- [ ] すべての数値が `rem()` 関数で囲まれているか
- [ ] px 値がそのまま `rem()` に括られているか
- [ ] **⚠️ 重要: `letter-spacing` は必ず `em` 単位で記述されているか（フォントサイズに対する相対値）**
  - **`letter-spacing` は `rem()` 関数を使用してはいけません。値は「レタスぺの値（px）」割る「フォントサイズ（px）」emです**
  - **必ず `em` 単位で記述してください**

**例**:

```scss
// 正しい
font-size: rem(16);
margin: rem(20);
padding: rem(10) rem(20);
letter-spacing: 0.1em; // Figmaのletter-spacing(px) ÷ font-size(px)

// 間違い
font-size: 16px;
margin: 20px;
font-size: 1rem; // 計算結果を書かない
letter-spacing: rem(1.6); // ❌ 間違い: letter-spacingはemで記述すること
letter-spacing: rem(4.8); // ❌ 間違い: rem()は使用禁止
```

**letter-spacing の計算方法（必ず守ること）**:

Figma の letter-spacing（px）をフォントサイズ（px）で割った値を `em` で記述します。

- 例: フォントサイズ24px、letter-spacing 2.4px → `letter-spacing: 0.1em` (2.4 ÷ 24 = 0.1)
- 例: フォントサイズ50px、letter-spacing 4px → `letter-spacing: 0.08em` (4 ÷ 50 = 0.08)
- 例: フォントサイズ16px、letter-spacing 2px → `letter-spacing: 0.125em` (2 ÷ 16 = 0.125)

**⚠️ 重要: `letter-spacing` は唯一の例外で、`rem()` 関数を使用せず、必ず `em` 単位で記述してください。**

#### 1.4. @use の使用

- [ ] `@import` が使用されていないか
- [ ] `@use` が正しく使用されているか

**例**:

```scss
// 正しい
@use "global" as *;

// 間違い
@import "global";
```

#### 1.5. メディアクエリの記述

- [ ] `@include mq {}` が使用されているか
- [ ] **メディアクエリは各クラス定義ブロック内（`{}`の中）の最下部に記述されているか**
- [ ] ファイルの最後にメディアクエリをまとめて書いていないか
- [ ] PC と重複する記述が書かれていないか

**重要**: メディアクエリは必ず**各クラス定義ブロック内（`{}`の中）の最下部**に記述してください。ファイルの最後にまとめて書くのは間違いです。

**例**:

```scss
// 正しい: 各クラス定義ブロック内の最下部に記述
.news__item {
  font-size: rem(16);
  margin-bottom: rem(20);
  @include mq {
    font-size: rem(14);
    margin-bottom: rem(15);
  }
}

.news__title {
  font-size: rem(24);
  @include mq {
    font-size: rem(20);
  }
}

// 間違い: ファイルの最後にまとめて書く（絶対にNG）
.news__item {
  font-size: rem(16);
  margin-bottom: rem(20);
}

.news__title {
  font-size: rem(24);
}

@include mq {
  .news__item {
    font-size: rem(14);
    margin-bottom: rem(15);
  }
  .news__title {
    font-size: rem(20);
  }
}

// 間違い: メディアクエリがクラス定義の途中にある
.news__item {
  font-size: rem(16);
  @include mq {
    font-size: rem(14);
    margin-bottom: rem(15); // PC側にも必要なら上に書く
  }
  margin-bottom: rem(20);
}
```

#### 1.6. ホバー効果

- [ ] ホバー効果は `@media (any-hover: hover)` で実装されているか

**例**:

```scss
.button {
  background-color: var(--blue);
  @media (any-hover: hover) {
    &:hover {
      background-color: var(--green);
    }
  }
}
```

#### 1.7. クラス設計（共通パーツ / 文脈 / Modifier）

- [ ] クラス名が「見た目」ではなく「役割・構造・パーツ」を表しているか
- [ ] BEM 記法（Block / Element / Modifier）で命名されているか
- [ ] 新規実装は BEM で書かれているか
- [ ] 既存改修の移行期間にハイフン命名を使う場合、同一コンポーネント内で命名方式が混在していないか（ブロック単位で統一されているか）
- [ ] `.section .btn` のような親依存セレクタを使っていないか
- [ ] CSS が単体クラス中心で記述され、詳細度を低く保っているか
- [ ] 共通パーツと文脈クラスが分離されているか
- [ ] Modifier が色・サイズ・状態差分にのみ使われているか
- [ ] 複数クラス付与は必要な場合のみに限定されているか（過剰分割していないか）
- [ ] 同一要素に、同じ責務（同じプロパティ）を持つクラスを重複付与していないか
  - 例: `section__sub` と `section-subtitle` の併用のような重複を避ける

**確認の目安**:

- 共通パーツ例: `btn`, `section-title`, `section-subtitle`, `container`, `voice-card`, `voice-cards`
- 文脈クラス例: `archive-voice__cards`, `section-heading-row`, `careers__layout`
- Modifier 例: `btn--dark`, `btn--light`, `section--dark`, `is-active`

### 2. 変数の使用

- [ ] CSS 変数（`:root`で定義されたもの）が正しく使用されているか
- [ ] カラーは変数を使用しているか
- [ ] フォントは変数を使用しているか
- [ ] 繰り返し使う値は変数として定義されているか

**例**:

```scss
// 正しい
color: var(--base-color);
background-color: var(--white);
font-family: var(--base-font-family);

// 間違い
color: #1a1a1a;
background-color: #fff;
```

### 3. クラスの存在確認

- [ ] すべてのクラスが定義されているか（中身が空でも `.class {}` を出力）
- [ ] HTML で使用されているクラスがすべて SCSS に定義されているか

### 4. パフォーマンス

- [ ] 不要な CSS が記述されていないか
- [ ] 使用されていないクラスが定義されていないか
- [ ] 重複したスタイルが記述されていないか

### 5. レスポンシブ対応

- [ ] すべてのセクションでレスポンシブ対応がされているか
- [ ] モバイルファーストか、デスクトップファーストかが統一されているか
- [ ] ブレークポイントが適切に設定されているか
- [ ] テキストを含む要素で固定 `height` を多用していないか（`padding` と必要最小限の `min-height` で調整されているか）
- [ ] 上下の間隔調整が原則 `margin-top` で統一されているか
- [ ] 前要素に `margin-bottom` を付けていないか（`margin-bottom` は使用しない）
- [ ] 同階層の隣接要素間の間隔を、上要素の `padding-bottom` ではなく下要素の `margin-top` で管理しているか
- [ ] 外側の要素間の距離調整が `margin`、要素内側の余白調整が `padding` になっているか

#### レスポンシブ設計ルール（詳細）

レスポンシブ対応の手間を減らすため、固定値に頼りすぎず、画面幅に応じて自然に伸縮する CSS 設計を行う。数値の記述形式（`rem()` の使用など）は本ドキュメントの SCSS 規約に従う。

##### 単位の使い分け

- サイズ指定は、基本的に `rem` / `%` / `em` / `clamp()` を使用する。
- `font-size`、セクション余白、`gap`、見出しサイズなどは、`rem` や `clamp()` を優先する。
- **`rem` はルート（`html`）の `font-size` に依存する。** プロジェクトでルートのフォントサイズやデザイントークンと `rem` の対応が決まっている場合はそれに従う。
- 画像・カード・コンテナの横幅は、基本的に `%` / `max-width` / `width: min()` で管理する。
- 文字周りの余白、ボタン内余白、アイコンとの間隔など、文字サイズに連動させたい余白は `em` を使用する。
- `px` は、border 幅、box-shadow、1px ライン、細かな位置調整など、画面幅によって変化させない値に限定する。
- **タッチターゲット（クリック／タップ領域）の下限は、レスポンシブとは別軸で確保する。** 必要に応じて `min-height` / `min-width` で確保し、ルートの `font-size` と整合するなら `rem()` で指定してよい（デザインガイドに基づく）。

##### レイアウト設計

- 大画面でコンテンツが広がりすぎないよう、`max-width` を必ず設定する。
- 必要に応じて `width: min(100%, ○○rem)` を使用する。
- **2カラム/グリッドの列幅は `%` を原則**とし、`width` / `flex-basis` / `max-width` で統一する。
- **禁止**: 列幅の主指定に `flex: 0 0 rem(...)` や固定 `px` を使うこと（一時対応で入れた場合も最終調整で `%` に戻す）。
- 列の隙間は `gap` を優先して管理し、`min-width: 0` と組み合わせて折り返し・はみ出しを防ぐ。
- 画像は `width: 100%; height: auto;` を基本とする。
- MV 画像やカード画像など、トリミングが必要な場合のみ `object-fit: cover;` を使用する。
- **`aspect-ratio` は `<img>` には付けず、`figure` または `__figure` / `__media` などのラッパーに付ける。** 子の `<img>` は `width: 100%; height: 100%; object-fit: cover;` でラッパーに収める（例外やヒーロー全画面などは `.cursor/rules/markup-bem-css.mdc` の「画像のアスペクト比」を参照）。
- ニュースカード・WHAT WE DO・サービス項目中のメディア枠など、実装の単一ソースは **`src/sass/pages/top/_top.scss`** と **`src/sass/pages/services/_services.scss`**、会社ページは **`src/sass/pages/company/_company.scss`** を確認する。
- **`careers__media`** のように、`background-size` / `background-position` で微妙なトリミングが必要な箇所のみ `<img>` 化を省略してよい（親側で比率・アート調整を管理）。
- 横並びレイアウトは、狭くなったときに無理に維持せず、自然なタイミングで 1 カラム化する。

##### メディアクエリ

- メディアクエリは、原則として次の**役割付き**の 3 段階を上限とする（数値はプロジェクトで統一する）。
  - **PC 幅：** `769px` 以上 — デフォルト／広いレイアウトを想定したスタイル。
  - **狭い画面：** `768px` 以下 — レイアウトの組み替え（複数カラム解除、`flex-wrap`、ナビの開閉など）。
  - **さらに狭い画面：** `480px` 以下 — タイポグラフィ・余白の調整、細かな詰めに限定して使用する。
- **`768px` 以下と `480px` 以下は包含関係になる。** 「どちらで何を変えるか」を最初に決め、`768px` でレイアウト、`480px` では密度調整に寄せるなど役割を分ける。
- モバイルファースト／デスクトップファーストのどちらで書くかはプロジェクトで統一する（本チェックリスト「### 5. レスポンシブ対応」の冒頭項も参照）。
- `1024px`・`900px` 前後などで**表示が明確に崩れる場合のみ**、例外的に中間ブレイクポイントを追加してよい。
- ブレイクポイントは端末名ではなく、「表示が崩れる幅」を基準に設定する。
- メディアクエリを増やしすぎず、まずは `clamp()` / `%` / `max-width` / `flex-wrap` / `grid` で自然に対応できないかを優先する。
- **特例：** ヒーローなど横幅いっぱいでだけ効かせたいサイズ指定には、`vw` を限定的に使ってよい。**コンテナ幅に応じた調整が必要なブロック**では、対応ブラウザ要件を満たすならコンテナクエリ（`@container`）の利用も検討する。

##### テキスト調整

- テキスト幅が広がりすぎないよう、必要に応じて `max-width` を設定する。
- 不自然な改行が起きないよう、`font-size`、`letter-spacing`、`line-height`、テキスト幅を調整する。
- キャッチコピーなど、意味の区切りを重視するテキストでは、必要に応じて `<br>` を使用して改行位置を制御する。
- レスポンシブで不自然になる `<br>` は、PC 用・SP 用クラスなどで表示を切り替える。

##### 基本方針

- 「各幅で細かく調整する CSS」ではなく、「最初から伸縮に強い CSS」を書く。
- 固定 px で作り込まず、画面幅に応じて自然に変化する設計を優先する。
- 見た目が崩れた箇所だけ、最小限のメディアクエリで補正する。

### 6. ブラウザ互換性

- [ ] 使用している CSS プロパティが主要ブラウザでサポートされているか
- [ ] ベンダープレフィックスが必要な場合、適切に記述されているか

### 7. アクセシビリティ

- [ ] コントラスト比が適切か（WCAG 2.1 AA 以上）
- [ ] フォーカス表示が適切か
- [ ] キーボード操作でナビゲーション可能か

## チェック手順

### 1. ビルドエラーの確認

**注意**: ビルドツール（Gulp など）が自動で動作している場合、エラーは自動で検出されます。エラーがないか確認してください。

### 2. リンターエラーの確認

```bash
# Stylelintを使用（設定されている場合）
# 例: npx stylelint "{SCSSディレクトリ}/**/*.scss"
```

### 3. 未使用 CSS の確認

```bash
# PurgeCSSなどのツールを使用（設定されている場合）
# 例: npx purgecss --css {CSS出力ファイル} --content {メインHTMLファイル}
```

### 4. 手動チェック

- 上記のチェック項目を 1 つずつ確認
- **特にメディアクエリの記述位置を確認**: ファイル内で `@include mq {` を検索し、各クラス定義ブロック内（`{}`の中）に記述されているか確認。ファイルの最後にまとめて書かれていないか確認
- 問題があれば修正

### 5. ブラウザで確認

- 複数のブラウザで表示を確認
- 開発者ツールでエラーがないか確認
- レスポンシブ表示を確認

## 修正例

### ネストをフラットに修正

```scss
// 修正前
.news__item {
  &-title {
    font-size: rem(16);
  }
}

// 修正後
.news__item-title {
  font-size: rem(16);
}
```

### rem()関数の追加

```scss
// 修正前
font-size: 16px;
margin: 20px;

// 修正後
font-size: rem(16);
margin: rem(20);
```

### 未使用 CSS の削除

```scss
// 削除: 使用されていないクラス
.old-class {
  // ...
}
```

### 重複スタイルの統合

```scss
// 修正前: 重複したスタイル
.news__item-title {
  font-size: rem(16);
  font-weight: var(--bold);
}

.pickup__item-title {
  font-size: rem(16);
  font-weight: var(--bold);
}

// 修正後: 共通クラスを作成（必要に応じて）
.common-title {
  font-size: rem(16);
  font-weight: var(--bold);
}
```

### メディアクエリの記述位置を修正

```scss
// 修正前: ファイルの最後にまとめて書く（間違い）
.header {
  position: fixed;
  height: rem(80);
}

.header__inner {
  padding: 0 rem(50);
}

@include mq {
  .header {
    height: auto;
    padding: rem(16) 0;
  }
  .header__inner {
    padding: 0 var(--padding-sp);
  }
}

// 修正後: 各クラス定義ブロック内の最下部に記述（正しい）
.header {
  position: fixed;
  height: rem(80);
  @include mq {
    height: auto;
    padding: rem(16) 0;
  }
}

.header__inner {
  padding: 0 rem(50);
  @include mq {
    padding: 0 var(--padding-sp);
  }
}
```

### 変数の使用

```scss
// 修正前
color: {カラー値};
background-color: {カラー値};

// 修正後
color: var(--{カラー変数名});
background-color: var(--{カラー変数名});
```

**注意**: `{カラー値}` と `{カラー変数名}` はプロジェクトごとに異なります。CSS 変数を使用してください。

## 注意事項

- 規約に違反している箇所はすべて修正すること
- **メディアクエリは必ず各クラス定義ブロック内（`{}`の中）の最下部に記述すること。ファイルの最後にまとめて書くのは絶対に NG**
- **テキストを含む要素の高さは固定 `height` を原則避け、`padding`（必要に応じて `min-height`）で調整すること**
- **上下の間隔調整は原則 `margin-top` で統一すること**
- **`margin-bottom` は付けないこと**
- **同階層の隣接要素間の間隔は、上要素の `padding-bottom` ではなく下要素の `margin-top` で調整すること**
- **外側の要素間の距離調整は `margin`、要素内側の余白調整は `padding` を使用すること**
- パフォーマンスを考慮した実装を心がけること
- アクセシビリティを考慮した実装を心がけること
