# Sass Directory Guide

- `foundation`: 変数、リセット、ミックスインなど全体共通
- `layout`: レイアウトの土台（container, grid など）
- `components`: 再利用パーツ（button, card など）
- `pages`: ページ固有スタイル（top, about など）

## Current Examples

- `foundation/_reset.scss`
- `foundation/_variables.scss`
- `layout/_container.scss`
- `components/button/_button.scss`
- `pages/top/_top.scss`
- `pages/about/_about.scss`

必要なときに `src/sass/top.scss` のようなエントリーファイルから `@use` して取り込みます。
