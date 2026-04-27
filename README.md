# 架空百科事典 - 制作者向けガイド

## ファイル構成

```
wiki/
├── index.html          ← メインHTML（基本的に触らない）
├── css/wiki.css        ← デザイン（基本的に触らない）
└── js/
    ├── data.js         ← ★ここを編集する！（記事データ）
    └── wiki.js         ← 動作スクリプト（基本的に触らない）
```

> **注意**: 以前のバージョンにあった `data/articles.json` は不要になりました。
> 代わりに `js/data.js` を編集してください。

---

## ローカルで確認する

`index.html` をブラウザで**直接ダブルクリックするだけで動きます**。
（fetchを使わなくなったためローカルサーバー不要）

---

## GitHub Pages への公開

1. GitHubリポジトリに `wiki/` 内のファイルをすべてアップロード
2. リポジトリの Settings → Pages → Source で `main` ブランチのルートを選択
3. 公開されたURLにアクセス

---

## js/data.js の編集方法

### サイト設定

```js
"site": {
  "name": "架空百科事典",
  "tagline": "みんなで作る...",
  "notice": "この内容はフィクションです"
}
```

### カテゴリ追加

```js
{ "id": "military", "name": "軍事", "color": "#8b0000" }
```

### 記事追加

```js
{
  "id": "my_article",
  "title": "記事タイトル",
  "categories": ["history"],
  "lastUpdated": "2157年1月1日",
  "sections": [
    { "heading": "", "text": "冒頭文。[[他の記事名]]でリンク。<b>太字</b>も可。" },
    { "heading": "歴史", "text": "歴史の説明..." }
  ],
  "infobox": {
    "image": null,
    "imageCaption": "",
    "rows": [
      { "label": "設立", "value": "2031年" }
    ]
  }
}
```

Wikiリンク: `[[記事タイトル]]` → 該当記事が存在すれば青リンク、なければ赤リンク

### 画像の使い方

1. `wiki/images/` フォルダを作成して画像を入れる
2. infobox の `"image"` に `"images/ファイル名.jpg"` を指定
