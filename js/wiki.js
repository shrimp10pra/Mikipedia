/* ===================================================
   wiki.js  ―  メインエンジン（編集不要）
   =================================================== */

let DB = null;

function init() {
  // _config.js と各記事ファイルのデータを統合
  DB = {
    site:       WIKI_CONFIG.site,
    categories: WIKI_CONFIG.categories,
    articles:   WIKI_ARTICLE_IDS.map(id => WIKI_ARTICLES[id]).filter(Boolean)
  };

  document.getElementById('logo-name').textContent    = DB.site.name;
  document.getElementById('logo-tagline').textContent = DB.site.tagline;
  document.getElementById('footer-notice').textContent = DB.site.notice;
  document.title = DB.site.name;

  buildCatNav();

  const hash = location.hash.slice(1);
  if (hash && DB.articles.find(a => a.id === hash)) {
    loadArticle(hash);
  } else {
    loadArticle('main');
  }

  window.addEventListener('popstate', () => {
    const h = location.hash.slice(1);
    if (h) loadArticle(h, false);
    else    loadArticle('main', false);
  });
}

// ─── カテゴリナビ ────────────────────────────────────
function buildCatNav() {
  const ul = document.getElementById('cat-nav-list');
  ul.innerHTML = '';
  DB.categories.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="cat-dot-nav" style="background:${cat.color}"></span>
      <a href="#" onclick="filterByCategory('${cat.id}');return false">${cat.name}</a>`;
    ul.appendChild(li);
  });
}

// ─── 記事読み込み ────────────────────────────────────
function loadArticle(id, pushState = true) {
  const article = DB.articles.find(a => a.id === id);
  if (!article) { showNotFound(id); return; }

  if (pushState) history.pushState({}, '', '#' + id);
  document.title = article.title + ' - ' + DB.site.name;

  // インフォボックス
  let infoboxHtml = '';
  if (article.infobox) {
    const ib = article.infobox;
    let imgHtml = '';
    if (ib.image) {
      imgHtml = `<div class="infobox-img">
        <img src="${ib.image}" alt="${ib.imageCaption}">
        ${ib.imageCaption ? `<div class="infobox-caption">${ib.imageCaption}</div>` : ''}
      </div>`;
    } else if (ib.imageCaption) {
      imgHtml = `<div class="infobox-img"><div class="infobox-caption" style="padding:8px">${ib.imageCaption}</div></div>`;
    }
    const rows = ib.rows.map(r =>
      `<tr><td>${r.label}</td><td>${wikilinks(r.value)}</td></tr>`
    ).join('');
    infoboxHtml = `<div class="infobox">
      <div class="infobox-title">${article.title}</div>
      ${imgHtml}
      <table><tbody>${rows}</tbody></table>
    </div>`;
  }

  // 目次（見出しが2つ以上あれば自動生成）
  const headings = article.sections.filter(s => s.heading);
  let tocHtml = '';
  if (headings.length >= 2) {
    const items = headings.map((s, i) =>
      `<li><a href="#section-${i+1}">${i+1} ${s.heading}</a></li>`
    ).join('');
    tocHtml = `<div id="toc"><div id="toc-title">目次</div><ol>${items}</ol></div>`;
  }

  // セクション本文
  let sectionsHtml = '';
  let secIdx = 0;
  article.sections.forEach(s => {
    if (s.heading) {
      secIdx++;
      sectionsHtml += `<h2 id="section-${secIdx}">${secIdx} ${s.heading}</h2>`;
    }
    sectionsHtml += `<p>${wikilinks(s.text)}</p>`;
  });

  // カテゴリタグ
  let catHtml = '';
  if (article.categories && article.categories.length) {
    const tags = article.categories.map(cid => {
      const cat = DB.categories.find(c => c.id === cid);
      if (!cat) return '';
      return `<span class="cat-tag"
        style="color:${cat.color};border-color:${cat.color};background:${cat.color}18"
        onclick="filterByCategory('${cat.id}')">${cat.name}</span>`;
    }).join('');
    catHtml = `<div id="article-categories"><span>カテゴリ：</span>${tags}</div>`;
  }

  const noticeBanner = article.isMain
    ? `<div class="notice-box">${DB.site.notice}</div>` : '';

  document.getElementById('article-content').innerHTML = `
    <h1 id="article-title">${article.title}</h1>
    <div class="article-meta">最終更新：${article.lastUpdated}</div>
    ${noticeBanner}
    <div id="article-body">
      ${infoboxHtml}
      ${tocHtml}
      ${sectionsHtml}
    </div>
    ${catHtml}
  `;
}

// ─── Wikiリンク [[記事名]] → <a> ─────────────────────
function wikilinks(text) {
  return text.replace(/\[\[(.+?)\]\]/g, (_, inner) => {
    const target = DB.articles.find(a => a.title === inner);
    if (target) {
      return `<a href="#${target.id}" onclick="loadArticle('${target.id}');return false">${inner}</a>`;
    }
    return `<a style="color:#c00;cursor:pointer" title="このページは存在しません">${inner}</a>`;
  });
}

// ─── 全記事一覧 ──────────────────────────────────────
function showAllArticles() {
  history.pushState({}, '', '#_list');
  document.title = '記事一覧 - ' + DB.site.name;

  let html = `<h1 id="article-title">記事一覧</h1><div id="article-body">`;
  DB.categories.forEach(cat => {
    const arts = DB.articles.filter(a => !a.isMain && a.categories && a.categories.includes(cat.id));
    if (!arts.length) return;
    html += `<div class="article-list-section">
      <h2 style="border-left:4px solid ${cat.color};padding-left:10px">${cat.name}</h2>
      <div class="article-list-grid">
        ${arts.map(a => `<div class="article-list-item" style="border-left-color:${cat.color}" onclick="loadArticle('${a.id}')">
          <h3>${a.title}</h3><p>${excerpt(a)}</p>
        </div>`).join('')}
      </div></div>`;
  });
  const uncat = DB.articles.filter(a => !a.isMain && (!a.categories || !a.categories.length));
  if (uncat.length) {
    html += `<div class="article-list-section"><h2>その他</h2><div class="article-list-grid">
      ${uncat.map(a => `<div class="article-list-item" style="border-left-color:#888" onclick="loadArticle('${a.id}')">
        <h3>${a.title}</h3><p>${excerpt(a)}</p>
      </div>`).join('')}
    </div></div>`;
  }
  html += '</div>';
  document.getElementById('article-content').innerHTML = html;
}

// ─── カテゴリフィルタ ────────────────────────────────
function filterByCategory(catId) {
  const cat = DB.categories.find(c => c.id === catId);
  if (!cat) return;
  history.pushState({}, '', '#_cat_' + catId);
  document.title = cat.name + ' - ' + DB.site.name;

  const arts = DB.articles.filter(a => a.categories && a.categories.includes(catId));
  document.getElementById('article-content').innerHTML = `
    <h1 id="article-title">カテゴリ：${cat.name}</h1>
    <div id="article-body"><div class="article-list-grid">
      ${arts.map(a => `<div class="article-list-item" style="border-left-color:${cat.color}" onclick="loadArticle('${a.id}')">
        <h3>${a.title}</h3><p>${excerpt(a)}</p>
      </div>`).join('')}
    </div></div>`;
}

// ─── おまかせ表示 ────────────────────────────────────
function showRandom() {
  const list = DB.articles.filter(a => !a.isMain);
  const pick = list[Math.floor(Math.random() * list.length)];
  if (pick) loadArticle(pick.id);
}

// ─── 検索 ────────────────────────────────────────────
function doSearch(e) {
  e.preventDefault();
  const q  = document.getElementById('search-input').value.trim();
  if (!q) return;
  history.pushState({}, '', '#_search');
  document.title = '検索：' + q + ' - ' + DB.site.name;

  const ql = q.toLowerCase();
  const results = DB.articles.filter(a => !a.isMain && (
    a.title.toLowerCase().includes(ql) ||
    a.sections.some(s => s.text.toLowerCase().includes(ql) || s.heading.toLowerCase().includes(ql))
  ));

  let html = `<h1 id="article-title">「${q}」の検索結果</h1><div id="article-body">`;
  if (!results.length) {
    html += `<div class="no-results">「<b>${q}</b>」に一致する記事は見つかりませんでした。</div>`;
  } else {
    html += `<p style="font-family:sans-serif;font-size:13px;color:#54595d;margin-bottom:16px">${results.length} 件の記事が見つかりました。</p>`;
    results.forEach(a => {
      const snip = getSnippet(a, ql);
      html += `<div class="search-result-item" onclick="loadArticle('${a.id}')">
        <h3>${hl(a.title, q)}</h3><p>${hl(snip, q)}</p>
      </div>`;
    });
  }
  html += '</div>';
  document.getElementById('article-content').innerHTML = html;
}

function hl(text, q) {
  return text.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
    m => `<span class="highlight">${m}</span>`);
}

function getSnippet(article, q) {
  for (const s of article.sections) {
    const plain = s.text.replace(/<[^>]+>/g, '').replace(/\[\[|\]\]/g, '');
    const idx = plain.toLowerCase().indexOf(q);
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      const end   = Math.min(plain.length, idx + 80);
      return (start > 0 ? '…' : '') + plain.slice(start, end) + (end < plain.length ? '…' : '');
    }
  }
  return excerpt(article);
}

// ─── 免責事項 ────────────────────────────────────────
function showNotice() {
  document.getElementById('article-content').innerHTML = `
    <h1 id="article-title">免責事項</h1>
    <div id="article-body">
      <div class="notice-box">${DB.site.notice}</div>
      <p>この百科事典に掲載されている情報はすべてフィクションであり、創作目的のためだけに作成されています。</p>
    </div>`;
}

function showNotFound(id) {
  document.getElementById('article-content').innerHTML = `
    <h1 id="article-title" style="color:#c00">ページが見つかりません</h1>
    <div id="article-body">
      <div class="notice-box">「${id}」というページは現在存在しません。</div>
      <p><a href="#" onclick="loadArticle('main');return false">メインページに戻る</a></p>
    </div>`;
}

function excerpt(article) {
  const first = article.sections[0];
  if (!first) return '';
  return first.text.replace(/<[^>]+>/g, '').replace(/\[\[|\]\]/g, '').slice(0, 80) + '…';
}

// 起動
init();
