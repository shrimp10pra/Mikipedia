/* =====================================================
   _config.js  ―  サイト設定・カテゴリ定義
   ここでサイト名やカテゴリを管理します
   ===================================================== */

const WIKI_CONFIG = {
  site: {
    name:     "架空百科事典",
    tagline:  "みんなで作る架空の百科事典",
    language: "日本語",
    notice:   "この百科事典の内容はすべてフィクションです。実在の人物・団体・事件とは一切関係ありません。"
  },

  // ─── カテゴリ一覧 ────────────────────────────────
  // 追加するときは { id, name, color } を増やすだけ
  categories: [
    { id: "history",   name: "歴史",      color: "#c69a0e" },
    { id: "geography", name: "地理",      color: "#3a7d44" },
    { id: "person",    name: "人物",      color: "#1a4a8a" },
    { id: "science",   name: "科学技術",  color: "#7b2d8b" },
    { id: "culture",   name: "文化・芸術",color: "#b84b1f" },
  ]
};
