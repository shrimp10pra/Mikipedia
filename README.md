# 架空百科事典 - 制作者向けガイド

## ファイル構成

```
wiki/
├── index.html          ← メインHTML（基本的に触らない）
├── css/wiki.css        ← デザイン（基本的に触らない）
├── js/wiki.js          ← 動作スクリプト（基本的に触らない）
└── data/
    └── articles.json   ← ★ここを編集する！
```

## 使い方

ローカルで動かす場合は **ローカルサーバーが必要** です。

```bash
# Python の場合（wiki フォルダで実行）
cd wiki
python3 -m http.server 8000
# → http://localhost:8000 にアクセス
```

---

## articles.json の編集方法

### サイト設定 (`site`)

```json
"site": {
  "name": "架空百科事典",          // サイト名（ロゴに表示）
  "tagline": "みんなで作る...",    // サブタイトル
  "language": "日本語",
  "notice": "この内容はフィクションです" // フッターの注意書き
}
```

### カテゴリ追加 (`categories`)

```json
{ "id": "military", "name": "軍事", "color": "#8b0000" }
```

- `id` はアルファベットで（スペース不可）
- `color` は記事一覧・タグの色

### 記事追加 (`articles`)

```json
{
  "id": "my_article",           // URLに使われるID（英数字・アンダースコアのみ）
  "title": "記事タイトル",
  "categories": ["history"],    // カテゴリIDのリスト（複数可）
  "lastUpdated": "2157年1月1日",
  "sections": [
    {
      "heading": "",            // 空文字 = 冒頭段落（見出しなし）
      "text": "本文テキスト。[[他の記事名]]でリンク。<b>太字</b>も使えます。"
    },
    {
      "heading": "歴史",
      "text": "歴史の説明..."
    }
  ],
  "infobox": {                  // 右上の情報ボックス。不要なら null
    "image": "images/foo.jpg",  // 画像（不要なら null）
    "imageCaption": "画像の説明",
    "rows": [
      { "label": "設立", "value": "2031年" },
      { "label": "人口", "value": "1億人" }
    ]
  }
}
```

### Wikiリンクの書き方

本文やインフォボックスの中で `[[記事タイトル]]` と書くと、その記事へのリンクになります。

- タイトルが一致する記事が存在する → 青リンク
- 存在しない → 赤リンク（未作成）

### HTMLタグ

テキスト内では以下のHTMLタグが使えます：

- `<b>太字</b>`
- `<i>斜体</i>`
- `<strong>強調</strong>`
- `<br>` 改行

---

## 画像の使い方

1. `wiki/images/` フォルダを作成して画像ファイルを入れる
2. infobox の `"image"` に `"images/ファイル名.jpg"` を指定

---

## 公開方法

GitHub Pages、Netlify、Vercel などに `wiki/` フォルダをそのままアップロードすればOKです。
