# 架空百科事典 - 制作者向けガイド

## ファイル構成

```
（リポジトリルート）/
├── index.html              ← HTMLのみ（基本的に触らない）
├── css/wiki.css            ← デザイン（基本的に触らない）
├── js/wiki.js              ← 動作スクリプト（基本的に触らない）
└── articles/
    ├── _config.js          ← ★ サイト設定・カテゴリ定義
    ├── _index.js           ← ★ 記事ID一覧（記事追加時に編集）
    ├── _template.js        ← 新記事のテンプレート（コピーして使う）
    ├── main.js             ← メインページ記事
    ├── valhiem.js          ← 記事ファイル（1記事＝1ファイル）
    ├── erik.js
    └── aurora_power.js
```

---

## 記事を追加する手順

### 1. テンプレートをコピー

`articles/_template.js` をコピーして、記事IDのファイル名に変更します。

```
例: articles/oslo_nexus.js
```

### 2. ファイルを編集

VSCode でコピーしたファイルを開き、内容を書き換えます。

```js
WIKI_ARTICLES["oslo_nexus"] = {
  id:          "oslo_nexus",       // ← ファイル名と同じにする
  title:       "オスロ・ネクサス",
  categories:  ["geography"],
  lastUpdated: "2157年6月1日",

  infobox: {
    image:        null,
    imageCaption: "",
    rows: [
      { label: "人口", value: "340万人" },
    ]
  },

  sections: [
    { heading: "",      text: "冒頭説明。[[ヴァルハイム帝国]]の首都。" },
    { heading: "歴史",  text: "2031年に首都として指定された。" },
  ]
};
```

### 3. _index.js に追記

`articles/_index.js` を開いて、記事IDを追加します。

```js
const WIKI_ARTICLE_IDS = [
  "main",
  "valhiem",
  "erik",
  "aurora_power",
  "oslo_nexus",  // ← 追加
];
```

### 4. index.html に script タグを追加

`index.html` の `<!-- ↓ 新しい記事ファイルをここに追加 -->` の下に追記します。

```html
<script src="articles/oslo_nexus.js"></script>
```

---

## 記事を削除する手順

1. `articles/` からファイルを削除する
2. `articles/_index.js` から該当のIDを削除する
3. `index.html` から該当の `<script>` タグを削除する

---

## 記事を編集する

該当の `.js` ファイルを VSCode で開いて直接編集するだけです。

---

## Wikiリンクの書き方

本文の `text` 内で `[[記事タイトル]]` と書くとリンクになります。

- タイトルが一致する記事がある → 青リンク
- 存在しない → 赤リンク（まだ書いていない記事の予告に使える）

---

## カテゴリを追加する

`articles/_config.js` の `categories` に追記します。

```js
{ id: "military", name: "軍事", color: "#8b0000" },
```

---

## 画像を使う

1. `images/` フォルダを作成して画像を置く
2. infobox の `image` に `"images/ファイル名.jpg"` を指定

---

## GitHub Pages への公開

このフォルダの中身をそのままリポジトリのルートにアップロードし、
Settings → Pages → Source で `main` ブランチ・`/ (root)` を選択してください。
