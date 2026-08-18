(function () {
  const DEFAULT_LANG = localStorage.getItem('site-lang') || 'zh';

  function getPageKey() {
    return document.body.getAttribute('data-page') || 'home';
  }

  function getSiteBundle(lang) {
    return (window.SITE_DATA && window.SITE_DATA[lang]) || {};
  }

  function getPageBundle(lang, pageKey) {
    return (window.PAGE_DATA && window.PAGE_DATA[lang] && window.PAGE_DATA[lang][pageKey]) || null;
  }

  function createTopbar(lang) {
    const siteInfo = getSiteBundle(lang).site;
    const links = siteInfo.topLinks.map(item => `<a href="${item.href}">${item.label}</a>`).join('');
    return `
      <div class="topbar">
        <div class="container">
          <div>${siteInfo.topbarLeft}</div>
          <div class="topbar-links">${links}</div>
        </div>
      </div>
    `;
  }

  function createHeader(lang, pageKey) {
    const siteInfo = getSiteBundle(lang).site;
    const nav = (window.SITE_NAV || []).map(item => {
      const label = item[lang];
      const active = item.key === pageKey ? 'active' : '';
      return `<li><a class="${active}" href="${item.href}">${label}</a></li>`;
    }).join('');

    return `
      <header class="site-header">
        <div class="container header-main">
          <a class="brand" href="index.html">
            <img src="assets/logo.png" alt="logo" />
            <div>
              <h1 class="brand-title">${siteInfo.name}</h1>
              <div class="brand-subtitle">${siteInfo.subtitle}</div>
            </div>
          </a>
          <div class="header-actions">
            <div class="header-note">${siteInfo.headerNote}</div>
            <div class="lang-switch" aria-label="language switch">
              <button type="button" data-lang="zh" class="${lang === 'zh' ? 'active' : ''}">中文</button>
              <button type="button" data-lang="en" class="${lang === 'en' ? 'active' : ''}">EN</button>
            </div>
          </div>
        </div>
        <div class="nav-wrap">
          <div class="container">
            <nav>
              <ul class="nav">${nav}</ul>
            </nav>
          </div>
        </div>
      </header>
    `;
  }

  // <div className="hero-badge">${page.badge}</div>
  function createHero(lang, pageKey) {
    const page = getPageBundle(lang, pageKey);
    const art = (window.HERO_ARTS || {})[pageKey];
    return `
      <section class="hero">
        <div class="container hero-inner">
          <div class="hero-text">

            <h2>${page.title}</h2>
            <p>${page.desc}</p>
          </div>
          <div class="hero-art">
            <img src="${art}" alt="hero art" />
          </div>
        </div>
      </section>
    `;
  }

// 专著
  function createSidebar(lang) {
    const side = getSiteBundle(lang).sidebar;

  //   const latest = (side.latest || []).map(item => `
  //   <li class="latest-slide-item">
  //     <div class="latest-slide-title">${item.title}</div>
  //     <small class="latest-slide-date">${item.date}</small>
  //   </li>
  // `).join('');
    const latest = (side.latest || []).map(item => `
  <li class="latest-slide-item">
    ${item.link
        ? `<a class="latest-slide-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
          <div class="latest-slide-title">${item.title}</div>
          <small class="latest-slide-date">${item.date}</small>
        </a>`
        : `<div class="latest-slide-title">${item.title}</div>
         <small class="latest-slide-date">${item.date}</small>`}
  </li>
`).join('');

    const info = (side.info || []).map(item => `
    <a class="info-pill info-book-card" href="${item.link || '#'}" target="_blank" rel="noopener noreferrer">
      <img src="${item.image}" alt="${item.title || ''}" class="info-book-img" />
      <div class="info-book-title">${item.title || ''}</div>
    </a>
  `).join('');

    const contact = (side.contact || []).map(item => `<li>${item}</li>`).join('');

    return `
    <aside>

  <!-- 联系方式 -->
  <div class="panel side-card">
    <div class="side-title">${side.contactTitle}</div>
    <div class="side-body">
      <ul class="side-list">${contact}</ul>
    </div>
  </div>

  <!-- 代表性专著 -->
  <div class="panel side-card" style="margin-top:18px;">
    <div class="side-title">${side.quickTitle}</div>
    <div class="side-body">
      <div class="info-grid">${info}</div>
    </div>
  </div>

  <!-- 最新动态 -->
  <div class="panel side-card" style="margin-top:18px;">
    <div class="side-title side-title-row">
      <span>${side.latestTitle}</span>

      <div class="latest-controls">
        <button type="button"
                class="latest-btn"
                id="latestPrev"
                aria-label="previous">‹</button>

        <button type="button"
                class="latest-btn"
                id="latestNext"
                aria-label="next">›</button>
      </div>
    </div>

    <div class="side-body">
      <div class="latest-slider-window" id="latestSliderWindow">
        <ul class="latest-slider-list" id="latestSliderList">
          ${latest}
        </ul>
      </div>
    </div>
  </div>

</aside>
`;
  }




  function getFieldLabels(lang) {
    return lang === 'zh'
        ? {
          room: '办公室',
          phone: '电话',
          email: '邮箱',
          research: '研究方向',
          lab: '实验室'
        }
        : {
          room: 'Office',
          phone: 'Tel',
          email: 'Email',
          research: 'Research',
          lab: 'Lab'
        };
  }

  function buildContactRows(data, fieldKeys = [], lang = 'zh') {
    const labels = getFieldLabels(lang);

    return fieldKeys
        .filter(key => data[key] && String(data[key]).trim() !== '')
        .map(key => `<div>${labels[key] || key}: ${data[key]}</div>`)
        .join('');
  }

  function renderLeader(section, lang) {
    const p = section.person;
    const interests = (p.interests || []).map(item => `<span class="leader-interest">${item}</span>`).join('');
    const exps = (p.experiences || []).map(item => `<li>${item}</li>`).join('');
    const nameHtml = p.profileUrl ? `<a class="person-name-link" href="${p.profileUrl}">${p.name}</a>` : p.name;
    const avatarStart = p.profileUrl ? `<a class="leader-avatar-link" href="${p.profileUrl}">` : '';
    const avatarEnd = p.profileUrl ? `</a>` : '';
    const contactFields = section.contactFields || ['room', 'phone', 'email'];

    return `
      <section class="section people-section section-people-leader">
        <h3 class="section-title">${section.title}</h3>
        <div class="leader-layout">
          <div class="leader-side">
            ${avatarStart}<img class="leader-avatar" src="${p.image}" alt="${p.name}" />${avatarEnd}
            <div class="leader-name">${nameHtml}</div>
            <div class="leader-title">${p.title || ''}</div>
            <div class="leader-contact">${buildContactRows(p, contactFields, lang)}</div>
          </div>
          <div class="leader-main">
            <div class="leader-block-title">${p.experienceTitle || ''}</div>
            <ul class="leader-exp-list">${exps}</ul>
            <div class="leader-block-title" style="margin-top:18px;">${p.interestTitle || ''}</div>
            <div class="leader-interests">${interests}</div>
          </div>
        </div>
      </section>
    `;
  }

  // function renderPeopleGrid(section, lang) {
  //   const contactFields = section.contactFields || ['room', 'phone', 'email'];
  //
  //   const cards = (section.items || []).map(item => {
  //     const nameHtml = item.profileUrl ? `<a class="person-name-link" href="${item.profileUrl}">${item.name}</a>` : item.name;
  //     const avatar = item.profileUrl
  //         ? `<a href="${item.profileUrl}"><img class="person-avatar" src="${item.image}" alt="${item.name}" /></a>`
  //         : `<img class="person-avatar" src="${item.image}" alt="${item.name}" />`;
  //
  //     return `
  //       <div class="person-card">
  //         <div class="person-avatar-wrap">${avatar}</div>
  //         <div class="person-name">${nameHtml}</div>
  //         <div class="person-title">${item.title || ''}</div>
  //         <div class="person-contact">
  //           ${buildContactRows(item, contactFields, lang)}
  //         </div>
  //       </div>
  //     `;
  //   }).join('');
  //
  //   return `
  //     <section class="section people-section section-people-grid">
  //       <h3 class="section-title section-title-centered">${section.title}</h3>
  //       ${section.intro ? `<p class="section-intro">${section.intro}</p>` : ''}
  //       <div class="people-grid">${cards}</div>
  //     </section>
  //   `;
  // }
  function renderPeopleGrid(section, lang) {
    const contactFields = section.contactFields || ["research", 'phone', 'email'];
    const isFormerMembers = section.title === (lang === 'zh' ? '已毕业/出站成员' : 'Former members');

    const cards = (section.items || []).map(item => {
      const nameHtml = item.profileUrl
          ? `<a class="person-name-link" href="${item.profileUrl}">${item.name}</a>`
          : item.name;

      const avatar = item.profileUrl
          ? `<a href="${item.profileUrl}"><img class="person-avatar" src="${item.image}" alt="${item.name}" /></a>`
          : `<img class="person-avatar" src="${item.image}" alt="${item.name}" />`;

      return `
      <div class="person-card">
        ${isFormerMembers ? '' : `<div class="person-avatar-wrap">${avatar}</div>`}
        <div class="person-name">${nameHtml}</div>
        <div class="person-title">${item.title || ''}</div>
        <div class="person-contact">
          ${buildContactRows(item, contactFields, lang)}
        </div>
      </div>
    `;
    }).join('');

    return `
    <section class="people-section">
      ${section.title ? `<h2 class="section-title">${section.title}</h2>` : ''}
      <div class="people-grid">
        ${cards}
      </div>
    </section>
  `;
  }


  function renderActivitySlider(images = []) {
    if (!images.length) {
      return `<div class="activity-slider empty">暂无图片</div>`;
    }

    return `
    <div class="activity-slider">
      <div class="activity-slider-track">
        ${images.map((src, i) => `
          <div class="activity-slide ${i === 0 ? 'active' : ''}">
            <img src="${src}" alt="activity image ${i + 1}">
          </div>
        `).join('')}
      </div>

      ${images.length > 1 ? `
        <button type="button" class="activity-arrow prev" aria-label="上一张">‹</button>
        <button type="button" class="activity-arrow next" aria-label="下一张">›</button>
        <div class="activity-dots">
          ${images.map((_, i) => `
            <span class="activity-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  }

  function renderActivitySlider(images = []) {
    if (!images.length) {
      return `<div class="activity-slider empty">暂无图片</div>`;
    }

    return `
    <div class="activity-slider">
      <div class="activity-slider-track">
        ${images.map((src, i) => `
          <div class="activity-slide ${i === 0 ? 'active' : ''}">
            <img src="${src}" alt="activity image ${i + 1}">
          </div>
        `).join('')}
      </div>

      ${images.length > 1 ? `
        <button type="button" class="activity-arrow prev" aria-label="上一张">‹</button>
        <button type="button" class="activity-arrow next" aria-label="下一张">›</button>
        <div class="activity-dots">
          ${images.map((_, i) => `
            <span class="activity-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
  }

  function bindActivitySliders() {
    const sliders = document.querySelectorAll('.activity-slider');

    sliders.forEach(slider => {
      const slides = slider.querySelectorAll('.activity-slide');
      const dots = slider.querySelectorAll('.activity-dot');
      const prevBtn = slider.querySelector('.activity-arrow.prev');
      const nextBtn = slider.querySelector('.activity-arrow.next');

      if (!slides.length) return;

      let current = 0;

      function updateSlider(index) {
        current = index;

        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === current);
        });

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === current);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          updateSlider((current + 1) % slides.length);
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          updateSlider((current - 1 + slides.length) % slides.length);
        });
      }

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          updateSlider(Number(dot.dataset.index));
        });
      });
    });
  }
  function renderSection(section, lang) {
    const sectionId = section.id ? ` id="${section.id}"` : '';
    let body = '';

    if (section.type === 'leaderProfile') {
      return `<div${sectionId}>${renderLeader(section, lang)}</div>`;
    }

    if (section.type === 'peopleGrid') {
      return `<div${sectionId}>${renderPeopleGrid(section, lang)}</div>`;
    }

    if (section.type === 'stats') {
      body = `<div class="stats-grid">${section.items.map(item => `
        <div class="stat-card">
          <div class="stat-value">${item.value}</div>
          <div class="stat-label">${item.label}</div>
        </div>`).join('')}</div>`;
    }

    if (section.type === 'cards') {
      body = `<div class="card-grid">${section.items.map(item => `
        <div class="card">
          <h4>${item.title}</h4>
          <p>${item.text}</p>
          ${item.meta ? `<div class="card-meta">${item.meta}</div>` : ''}
        </div>`).join('')}</div>`;
    }

    if (section.type === 'timeline') {
      body = `<div class="timeline">${section.items.map(item => `
        <div class="timeline-item">
          <h4>${item.title}</h4>
          <p>${item.text}</p>
        </div>`).join('')}</div>`;
    }

    if (section.type === 'notice') {
      body = `<div class="notice-box">${section.text}</div>`;
    }

    if (section.type === 'profiles') {
      body = `<div class="profile-grid">${section.items.map(item => `
        <div class="profile-card">
          <div class="profile-role">${item.role}</div>
          <h4>${item.name}</h4>
          <p>${item.text}</p>
          <div class="profile-meta">${item.meta || ''}</div>
        </div>`).join('')}</div>`;
    }

    if (section.type === 'table') {
      body = `<div class="table-like">${section.rows.map(row => `
        <div class="table-row">
          <div class="key">${row.key}</div>
          <div class="value">${row.value}</div>
        </div>`).join('')}</div>`;
    }

    // if (section.type === 'projects') {
    //   body = `<div class="project-list">${section.items.map(item => `
    //     <div class="project-card">
    //       <h4>${item.title}</h4>
    //       <p>${item.text}</p>
    //       ${item.bullets ? `<ul>${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    //       ${item.meta ? `<div class="project-meta">${item.meta}</div>` : ''}
    //     </div>`).join('')}</div>`;
    // }
    if (section.type === 'projects') {
      body = `
    <div class="project-list">
      ${(section.items || []).map(item => `
        <div class="project-card">

          <div class="project-content ${item.reverse ? 'project-reverse' : ''}">

            ${item.image ? `
              <div class="project-card-photo">
                <img src="${item.image}" alt="${section.title || ''}">
              </div>
            ` : ''}

            <div class="project-card-text">
              ${item.title ? `<h4>${item.title}</h4>` : ''}
              ${item.text ? `<p>${item.text}</p>` : ''}
              ${item.bullets
          ? `<ul>${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
          : ''}
            </div>

          </div>

        </div>
      `).join('')}
    </div>
  `;
    }

    if (section.type === 'labels') {
      body = `<div class="label-list">${section.items.map(item => `<span class="label">${item}</span>`).join('')}</div>`;
    }

    // if (section.type === 'publications') {
    //   body = `<div class="pub-list">${section.items.map(item => `
    //     <div class="pub-card">
    //       <h4>${item.title}</h4>
    //       <p>${item.text}</p>
    //       ${item.meta ? `<div class="pub-meta">${item.meta}</div>` : ''}
    //     </div>`).join('')}</div>`;
    // }
    if (section.type === "publications") {
      const items = (section.groups || []).flatMap(group => group.items || []);

      body = `
    <ol class="pub-inline-list">
      ${items.map(item => `
        <li class="pub-inline-item">
          <span class="pub-inline-text">
            ${item.meta || ""} ${item.title || ""} ${item.text || ""}
          </span>

          ${item.url ? `
            <a href="${item.url}"
               target="_blank"
               rel="noopener noreferrer"
               class="pub-inline-link">🔗</a>
          ` : ""}
        </li>
      `).join("")}
    </ol>
  `;
    }

    if (section.type === "books") {
      body = `
    <div class="book-grid">
      ${(section.items || []).map(item => `
        <div class="book-card">

          ${item.image ? `
            <div class="book-cover">
              <img src="${item.image}" alt="${item.title}">
            </div>
          ` : ""}

          <div class="book-info">
            <h4>《${item.title}》</h4>
            <p class="book-author">${item.author}</p>
            <p class="book-publisher">${item.publisher}，${item.year}</p>
          </div>

        </div>
      `).join("")}
    </div>
  `;
    }


    if (section.type === 'news') {
      body = `<div class="news-grid">${section.items.map(item => `
        <div class="news-card">
          <h4>${item.title}</h4>
          <p>${item.text}</p>
          ${item.meta ? `<div class="news-meta">${item.meta}</div>` : ''}
        </div>`).join('')}</div>`;
    }

    /* home 代表性成果  图片设置  */
    if (section.type === "timeline") {
      body = `
    <div class="timeline">
      ${(section.items || []).map(item => `
        <div class="timeline-item">

          ${item.title ? `
            <h4 class="timeline-title">${item.title}</h4>
          ` : ""}

          <div class="timeline-content ${item.reverse ? "timeline-reverse" : ""}">

            ${item.image ? `
              <div class="timeline-photo">
                <img src="${item.image}" alt="${item.title || ""}">
              </div>
            ` : ""}

            ${item.text ? `
              <p>${item.text}</p>
            ` : ""}

          </div>

        </div>
      `).join("")}
    </div>
  `;
    }



    // if (section.type === 'activities') {
    //   body = `<div class="activity-grid">${section.items.map(item => `
    //     <div class="activity-card">
    //       <h4>${item.title}</h4>
    //       <p>${item.text}</p>
    //       ${item.bullets ? `<ul>${item.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    //       ${item.meta ? `<div class="activity-meta">${item.meta}</div>` : ''}
    //     </div>`).join('')}</div>`;
    // }
    if (section.type === 'activities') {
      body = `
    <div class="activity-grid">
      ${(section.items || []).map(item => `
        <div class="activity-card">
          <h4>${item.title || ''}</h4>
          ${renderActivitySlider(item.images || [])}
        </div>
      `).join('')}
    </div>
  `;
    }
    else if (section.type === 'paper-grid') {
      body = `
    <div class="paper-grid">
      ${(section.items || []).map(item => `
        <div class="paper-item">
          <img src="${item.image}" />
          <div class="paper-caption">${item.caption || ''}</div>
        </div>
      `).join('')}
    </div>
  `;
    }
    else if (section.type === 'video-grid') {
      body = `
    <div class="paper-grid">
      ${(section.items || []).map(item => `
        <div class="paper-item video-card">

          <div class="video-thumb">
            <video controls preload="metadata" playsinline>
              <source src="${item.video}" type="video/mp4">
              您的浏览器不支持视频播放。
            </video>
          </div>

          <div class="paper-caption">${item.caption || ''}</div>

        </div>
      `).join('')}
    </div>
  `;
    }

    return `
      <section class="section"${sectionId}>
        <h3 class="section-title">${section.title}</h3>
        ${section.intro ? `<p class="section-intro">${section.intro}</p>` : ''}
        ${body}
      </section>
    `;
  }


  // function createMain(lang, pageKey) {
  //   const page = getPageBundle(lang, pageKey);
  //   const sections = page.sections.map(section => renderSection(section, lang)).join('');
  //   return `
  //     <main class="main container">
  //       <div class="page-layout">
  //         <div class="panel content-panel">${sections}</div>
  //         ${createSidebar(lang)}
  //       </div>
  //     </main>
  //   `;
  // }
  function createMain(lang, pageKey) {
    const page = getPageBundle(lang, pageKey);
    const mainTitle = page.mainTitle
        ? `<h2 class="page-main-title">${page.mainTitle}</h2>`
        : '';

    const sections = (page.sections || []).map(section => renderSection(section, lang)).join('');

    return `
    <main class="main container">
      <div class="page-layout">
        <div class="panel content-panel">
          ${mainTitle}
          ${sections}
        </div>
        ${createSidebar(lang)}
      </div>
    </main>
  `;
  }

  // function createFooter(lang) {
  //   const lines = getSiteBundle(lang).site.footer.map(line => `<div>${line}</div>`).join('');
  //   return `<footer class="footer"><div class="container">${lines}</div></footer>`;
  // }
  function createFooter(lang) {
    const siteInfo = getSiteBundle(lang).site;
    const lines = siteInfo.footer.map(line => `<div>${line}</div>`).join('');
    const visitLabel = lang === 'zh' ? '访问次数：' : 'Visits: ';

    return `
    <footer class="footer">
      <div class="container">
        ${lines}
        <div class="footer-counter">
          ${visitLabel}<span id="visitCount">0</span>
        </div>
      </div>
    </footer>
  `;
  }

  async function fetchVisitCount(increment = false) {
    const url = increment ? '/api/visit-count/increment' : '/api/visit-count';
    const options = increment ? { method: 'POST' } : { method: 'GET' };

    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  }

  async function updateVisitCount() {
    const el = document.getElementById('visitCount');
    console.log('visitCount element =', el);

    if (!el) {
      console.warn('没有找到 #visitCount');
      return;
    }

    try {
      const counted = sessionStorage.getItem('site_visit_counted') === '1';
      console.log('site_visit_counted =', counted);

      const data = counted
          ? await fetchVisitCount(false)
          : await fetchVisitCount(true);

      console.log('visit api result =', data);

      el.textContent = data.count ?? 0;

      if (!counted) {
        sessionStorage.setItem('site_visit_counted', '1');
      }
    } catch (err) {
      console.error('访问次数获取失败：', err);
    }
  }

  async function updateVisitCount() {
    const visitEl = document.getElementById('visitCount');
    if (!visitEl) return;

    try {
      const counted = sessionStorage.getItem('site_visit_counted') === '1';

      const data = counted
          ? await fetchVisitCount(false)
          : await fetchVisitCount(true);

      visitEl.textContent = data.count ?? 0;

      if (!counted) {
        sessionStorage.setItem('site_visit_counted', '1');
      }
    } catch (err) {
      console.error('访问次数获取失败：', err);
      visitEl.textContent = '0';
    }
  }


  // function loadBusuanzi() {
  //   const oldScript = document.getElementById('busuanzi-script');
  //   if (oldScript) oldScript.remove();
  //
  //   const script = document.createElement('script');
  //   script.id = 'busuanzi-script';
  //   script.async = true;
  //   script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  //   document.body.appendChild(script);
  // }

  function render(lang) {
    const pageKey = getPageKey();
    const pageBundle = getPageBundle(lang, pageKey);
    if (!pageBundle) {
      document.getElementById('app').innerHTML = '<div style="padding:40px;font-size:18px;">Page data not found.</div>';
      return;
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const navItem = (window.SITE_NAV || []).find(n => n.key === pageKey);
    document.title = `${getSiteBundle(lang).site.name} - ${navItem ? navItem[lang] : pageKey}`;
    document.getElementById('app').innerHTML = [
      createTopbar(lang),
      createHeader(lang, pageKey),
      createHero(lang, pageKey),
      createMain(lang, pageKey),
      createFooter(lang),
      '<button class="back-top" id="backTop" aria-label="back to top">↑</button>'
    ].join('');

    bindLanguageButtons();
    bindBackTop();
    bindLatestSlider();
    bindActivitySliders();
    updateVisitCount();
  }

  function bindLanguageButtons() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', function () {
        const lang = this.getAttribute('data-lang');
        localStorage.setItem('site-lang', lang);
        render(lang);
      });
    });
  }

  function bindBackTop() {
    const btn = document.getElementById('backTop');
    if (!btn) return;
    const toggle = () => {
      btn.style.display = window.scrollY > 280 ? 'block' : 'none';
    };
    window.addEventListener('scroll', toggle);
    toggle();
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function bindLatestSlider() {
    const windowEl = document.getElementById('latestSliderWindow');
    const list = document.getElementById('latestSliderList');
    const prevBtn = document.getElementById('latestPrev');
    const nextBtn = document.getElementById('latestNext');

    if (!windowEl || !list) return;

    const originalItems = Array.from(list.querySelectorAll('.latest-slide-item'));
    const visibleCount = 5;

    if (!originalItems.length) return;

    if (originalItems.length <= visibleCount) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    const cloneCount = visibleCount;
    for (let i = 0; i < cloneCount; i++) {
      const clone = originalItems[i].cloneNode(true);
      clone.classList.add('is-clone');
      list.appendChild(clone);
    }

    const items = Array.from(list.querySelectorAll('.latest-slide-item'));
    let currentIndex = 0;
    let timer = null;
    let itemHeight = 0;
    let isAnimating = false;

    function updateSizes() {
      const firstItem = list.querySelector('.latest-slide-item');
      if (!firstItem) return;
      itemHeight = firstItem.offsetHeight;
      windowEl.style.height = `${itemHeight * visibleCount}px`;
      list.style.transform = `translateY(-${currentIndex * itemHeight}px)`;
    }

    function goTo(index, animate = true) {
      if (isAnimating) return;
      isAnimating = true;

      if (!animate) {
        list.style.transition = 'none';
      } else {
        list.style.transition = 'transform 0.45s ease';
      }

      currentIndex = index;
      list.style.transform = `translateY(-${currentIndex * itemHeight}px)`;

      if (!animate) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            list.style.transition = 'transform 0.45s ease';
            isAnimating = false;
          });
        });
        return;
      }

      setTimeout(() => {
        const totalOriginal = originalItems.length;

        if (currentIndex >= totalOriginal) {
          currentIndex = 0;
          list.style.transition = 'none';
          list.style.transform = `translateY(0px)`;
        }

        if (currentIndex < 0) {
          currentIndex = totalOriginal - 1;
          list.style.transition = 'none';
          list.style.transform = `translateY(-${currentIndex * itemHeight}px)`;
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            list.style.transition = 'transform 0.45s ease';
            isAnimating = false;
          });
        });
      }, 460);
    }

    function nextSlide() {
      goTo(currentIndex + 1, true);
    }

    function prevSlide() {
      if (currentIndex === 0) {
        const totalOriginal = originalItems.length;
        list.style.transition = 'none';
        currentIndex = totalOriginal;
        list.style.transform = `translateY(-${currentIndex * itemHeight}px)`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            list.style.transition = 'transform 0.45s ease';
            goTo(currentIndex - 1, true);
          });
        });
        return;
      }

      goTo(currentIndex - 1, true);
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(nextSlide, 3000);
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAuto();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAuto();
      });
    }

    windowEl.addEventListener('mouseenter', stopAuto);
    windowEl.addEventListener('mouseleave', startAuto);
    window.addEventListener('resize', updateSizes);

    updateSizes();
    startAuto();
  }

  render(DEFAULT_LANG);
})();

document.addEventListener("click", e => {
  if (!e.target.matches(".paper-grid img")) return;

  const box = document.getElementById("imageLightbox");
  const img = document.getElementById("lightboxImg");
  const caption = document.getElementById("lightboxCaption");

  img.src = e.target.src;

  const item = e.target.closest(".paper-card, .paper-item");
  caption.textContent =
      item?.querySelector(".caption")?.textContent ||
      e.target.alt ||
      "";

  box.classList.add("active");
});

function closeLightbox() {
  document.getElementById("imageLightbox").classList.remove("active");
}

document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);

document.getElementById("imageLightbox")?.addEventListener("click", e => {
  if (e.target.id === "imageLightbox") closeLightbox();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});