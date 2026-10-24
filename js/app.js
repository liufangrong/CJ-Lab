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


    function renderPeopleGrid(section, lang) {
        const isFormerMembers = /已毕业|出站|former|alumni/i.test(section.title || '');
        // 只有下列三位研究人员保留个人主页入口。
        const allowedProfiles = new Set(['车静', '柴静', '高伟', 'CHE Jing']);
        const profileLabel = lang === 'zh' ? 'KIZ 个人主页' : 'KIZ - Personal Homepage';

        const cards = (section.items || []).map(item => {

            // 已毕业/出站成员：从米雪开始另起一行
            const breakBefore = isFormerMembers &&
                (item.name === "米雪" || item.name === "MI Xue" );

            if (isFormerMembers) {
                return `
            ${breakBefore ? '<div class="former-row-break"></div>' : ''}

            <div class="person-card">
                <div class="person-name">${item.name}</div>
                <div class="person-title">${item.title || ''}</div>
            </div>
        `;
            }

            const homepage = allowedProfiles.has(item.name) &&
            item.profileUrl && item.profileUrl !== '#' ? item.profileUrl : null;
            // 简介只显示正文，邮箱另成一段，避免重复。
            const rawSummary = String(item.description || item.bio || [
                item.title,
                item.research
            ].filter(Boolean).join('。')).trim();
            const summary = rawSummary
                .replace(/(?:联系邮箱|电子邮箱|邮箱|Email)\s*[：:]\s*[^\s。；;，,]+/gi, '')
                .replace(/[。；;，,\s]+$/g, '')
                .trim();
            const paragraph = summary
                ? `<p class="person-paragraph">${/[。！？.!?]$/.test(summary.trim()) ? summary.trim() : summary.trim() + (lang === 'en' ? '.' : '。')}</p>`
                : '';
            const emailParagraph = item.email && String(item.email).trim()
                ? `<p class="person-email">${lang === 'zh' ? '联系邮箱' : 'Email'}：<a href="mailto:${item.email}">${item.email}</a></p>`
                : '';
            const avatar = item.image
                ? `<img class="person-avatar" src="${item.image}" alt="${item.name}" loading="lazy">`
                : '';
            const homepageButton = homepage
                ? `<a class="person-homepage-button" href="${homepage}" target="_blank" rel="noopener noreferrer">${profileLabel}</a>`
                : '';

            return `<div class="person-card">
        <div class="person-personal">
          <div class="person-avatar-wrap">${avatar}</div>
          <div class="person-name">${item.name}</div>
        </div>
        <div class="person-info">
          ${paragraph}
          ${emailParagraph}
          ${homepageButton}
        </div>
      </div>`;
        }).join('');

        return `<section class="people-section ${isFormerMembers ? 'former-members' : 'current-members'}">
      ${section.title ? `<h2 class="section-title">${section.title}</h2>` : ''}
      <div class="people-grid">${cards}</div>
    </section>`;
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

    /* =========================================================
     实验室成员姓名自动加粗
     所有 section 都可以调用
     ========================================================= */

    function boldLabMemberNames(value) {
        if (!value) return "";

        const names = [...(window.CHE_LAB_MEMBER_NAMES || [])]
            .filter(Boolean)
            .sort((a, b) => b.length - a.length);

        if (!names.length) {
            return String(value);
        }

        const escapeRegExp = text =>
            String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(
            `(${names.map(escapeRegExp).join("|")})`,
            "g"
        );

        return String(value).replace(
            regex,
            '<strong class="lab-member-name">$1</strong>'
        );
    }


    function renderSection(section, lang) {
        const sectionId = section.id ? ` id="${section.id}"` : '';
        const sectionTypeClass = section.type ? ` section-${section.type}` : '';
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

        if (section.type === 'home-intro') {
            const paragraphs = (section.paragraphs || [])
                .filter(text => text && String(text).trim())
                .map(text => `<p>${text}</p>`)
                .join('');

            body = `<div class="home-intro-copy">${paragraphs}</div>`;
        }


        if (section.type === 'image-gallery') {
            const galleryItems = (section.items || []).map(item => {
                const image = `
            <img src="${item.image}"
                 alt="${item.alt || item.caption || ''}"
                 loading="lazy"
                 decoding="async">`;

                const media = item.href
                    ? `<a class="home-image-link" href="${item.href}"
                  target="_blank" rel="noopener noreferrer">${image}</a>`
                    : image;

                return `
            <figure class="home-image-item">
                ${media}
                ${item.caption
                    ? `<figcaption>${item.caption}</figcaption>`
                    : ''}
            </figure>`;
            }).join('');


            body = `
    <div class="home-gallery-viewport">
        <div class="home-image-grid home-gallery-track">
            ${galleryItems}
        </div>

        <button type="button"
                class="home-gallery-arrow home-gallery-prev"
                aria-label="Previous image">‹</button>

        <button type="button"
                class="home-gallery-arrow home-gallery-next"
                aria-label="Next image">›</button>
    </div>`;
        }


        if (section.type === 'logo-links') {
            const logoItems = (section.items || []).map(item => {
                const content = `
          <img src="${item.image}" alt="${item.alt || item.title || ''}" loading="lazy" decoding="async" onerror="this.hidden=true">
          ${item.title ? `<span>${item.title}</span>` : ''}`;

                return item.href
                    ? `<a class="home-logo-card" href="${item.href}" target="_blank" rel="noopener noreferrer" aria-label="${item.title || item.alt || ''}">${content}</a>`
                    : `<div class="home-logo-card">${content}</div>`;
            }).join('');

            body = `<div class="home-logo-grid">${logoItems}</div>`;
        }

        if (section.type === 'cards') {
            body = `<div class="card-grid">${section.items.map(item => `
        <div class="card">
          <h4>${item.title}</h4>
          ${item.text && String(item.text).trim() ? `<p>${item.text}</p>` : ''}
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



        /* =========================================================
           Projects：研究方向
           左右图文布局 + 自然段落 + 无项目符号
           ========================================================= */

        if (section.type === "projects") {

            body = `
      <div class="project-list">

        ${(section.items || []).map(item => `

          <div class="project-card">

            <div class="project-content">

              ${item.image ? `
                <div class="project-card-photo ${item.reverse ? 'is-right' : 'is-left'}">
                  <img
                    src="${item.image}"
                    alt="${section.title || ''}"
                  >
                </div>
              ` : ''}

              <div class="project-card-text">

                ${item.title ? `
                  <h4>${item.title}</h4>
                ` : ''}

                ${item.text ? `
                  <p class="project-description">
                    ${item.text}
                  </p>
                ` : ''}

                ${(item.bullets || []).map(text => `
                  <p class="project-description">
                    ${text}
                  </p>
                `).join('')}

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
        if (section.type === "paperPublications" || section.type === "allPublications") {
            const escapeRegExp = value =>
                String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            const boldLabMembers = value => {
                return (section.labMembers || []).reduce((result, name) => {
                    return result.replace(
                        new RegExp(escapeRegExp(name), "g"),
                        `<strong class="pub-lab-member">${name}</strong>`
                    );
                }, value || "");
            };

            // const renderRepresentativeItems = items => `
            //   <div class="pub-modern-list">
            //     ${(items || []).map(item => `
            //       <article class="pub-modern-item">
            //         <div class="pub-modern-content">
            //           <h4 class="pub-modern-title">${item.title || ""}</h4>
            //           ${item.meta ? `
            //             <div class="pub-modern-authors">
            //               ${boldLabMembers(item.meta)}
            //             </div>
            //           ` : ""}
            //           ${item.text ? `
            //             <div class="pub-modern-journal">${item.text}</div>
            //           ` : ""}
            //         </div>
            //
            //         ${item.url ? `
            //           <a class="pub-doi-button"
            //              href="${item.url}"
            //              target="_blank"
            //              rel="noopener noreferrer">DOI</a>
            //         ` : ""}
            //       </article>
            //     `).join("")}
            //   </div>
            // `;
            const formatRepresentativeJournal = value => {
                const text = String(value || "").trim();

                if (!text) return "";

                const commaIndex = text.indexOf(",");

                if (commaIndex === -1) {
                    return `<em class="pub-representative-journal">${text}</em>`;
                }

                const journal = text.slice(0, commaIndex);
                const details = text.slice(commaIndex);

                return `
    <em class="pub-representative-journal">${journal}</em>${details}
  `;
            };

            const renderRepresentativeItems = items => `
  <div class="pub-modern-list">

    ${(items || []).map(item => `
      <article class="pub-modern-item">

        <div class="pub-representative-citation">

          ${item.meta ? `
            <span class="pub-representative-authors">
              ${boldLabMembers(item.meta)}
            </span>
          ` : ""}

          ${item.title ? `
            <span class="pub-representative-title">
              ${item.title}
            </span>
          ` : ""}

          ${item.text ? `
            <span class="pub-representative-source">
              ${formatRepresentativeJournal(item.text)}
            </span>
          ` : ""}

        </div>

        ${item.url ? `
          <a
            class="pub-doi-button"
            href="${item.url}"
            target="_blank"
            rel="noopener noreferrer"
          >DOI</a>
        ` : ""}

      </article>
    `).join("")}

  </div>
`;


            if (section.type === "paperPublications") {
                const items = (section.groups || []).flatMap(group => group.items || []);

                body = `
    ${section.legend ? `
      <div class="pub-modern-legend">
        ${section.legend}
      </div>
    ` : ""}

    ${section.listTitle ? `
      <div class="representative-title-wrap">
        <h3 class="section-title representative-left-title">
          ${section.listTitle}
        </h3>
      </div>
    ` : ""}

    ${renderRepresentativeItems(items)}
  `;
            }

            //   if (section.type === "allPublications") {
            //     body = `
            //       <div class="all-pub-groups">
            //         ${(section.groups || []).map(group => `
            //           <section class="all-pub-year-block">
            //             <h4 class="all-pub-year-title">
            //               <span>${group.year || ""}</span>
            //               <small>${(group.items || []).length}篇</small>
            //             </h4>
            //             <div class="all-pub-list">
            //               ${(group.items || []).map(item => `
            //                 <article class="all-pub-item">
            //                   ${boldLabMembers(item.citation || "")}
            //                 </article>
            //               `).join("")}
            //             </div>
            //           </section>
            //         `).join("")}
            //       </div>
            //     `;
            //   }
            // }


            if (section.type === "allPublications") {
                body = `
    <details class="all-pub-details">

      <summary class="all-pub-toggle">
        <span>${section.title || (lang === "zh" ? "更多论文" : "More Publications")}</span>
        <span class="all-pub-arrow">→</span>
      </summary>

      <div class="all-pub-groups">
        ${(section.groups || []).map(group => `
          <section class="all-pub-year-block">

            <h4 class="all-pub-year-title">
              <span>${group.year || ""}</span>
              <small>${(group.items || []).length}篇</small>
            </h4>

            <div class="all-pub-list">
              ${(group.items || []).map(item => `
                <article class="all-pub-item">

                  <div class="all-pub-citation">
                    ${boldLabMembers(item.citation || "")}
                  </div>

                  ${item.doi
                    ? '<a class="pub-doi-button all-pub-doi-button"' +
                    ' href="https\\://doi.org/' + item.doi + '"' +
                    ' target="_blank"' +
                    ' rel="noopener noreferrer">DOI</a>'
                    : ""
                }

                </article>
              `).join("")}
            </div>

          </section>
        `).join("")}
      </div>

    </details>
  `;
            }
        }


        function boldLabMemberNames(text) {
            if (!text) return "";

            const names = [...(window.CHE_LAB_MEMBER_NAMES || [])]
                .sort((a, b) => b.length - a.length);

            if (!names.length) return text;

            const escapedNames = names.map(name =>
                name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            );

            const regex = new RegExp(`(${escapedNames.join("|")})`, "g");

            return text.replace(
                regex,
                '<strong class="lab-member-name">$1</strong>'
            );
        }



        /* =========================================================
           CJ Lab · 出版著作 Books
           第一行：三个分类，各展示一本
           第二行：青藏高原丛书，展示三本
           保留原有卡片样式
           支持点击封面放大
           ========================================================= */

        if (section.type === "books") {

            const groups = section.groups || [];

            // 单本图书卡片
            const renderBook = item => `
        <div class="book-card">

            ${item.image ? `
                <div class="book-cover">
    <img
        src="${item.image}"
        alt="${item.title || ""}"
        class="book-zoom-image"
       role="button" tabindex="0"
        style="cursor: zoom-in;"
        onclick="openBookImage(this)"
    >
</div>
            ` : ""}

            <div class="book-info">

                <h4>《${item.title || ""}》</h4>

                <p class="book-author">
                    ${boldLabMemberNames(item.author || "")}
                </p>

                <p class="book-publisher">
                    ${item.publisher || ""}，${item.year || ""}
                </p>

            </div>

        </div>
    `;

            // 单个图书分类
            const renderGroup = (index, number) => {

                const group = groups[index];

                if (!group) return "";

                return `
            <div class="books-group">

                <h3 class="books-category-title">
                    ${number}. ${group.title || ""}
                </h3>

                <div class="book-grid">
                    ${(group.items || []).map(renderBook).join("")}
                </div>

            </div>
        `;
            };

            // 出版著作整体布局
            body = `
        <div class="books-layout">

            

            <!-- 第二行：青藏高原丛书 -->
            <div class="books-second-row">

                ${renderGroup(3, 1)}

            </div>
            
            <!-- 第一行：三个分类 -->
            <div class="books-first-row">

                ${renderGroup(0, 2)}

                ${renderGroup(2, 3)}
                
                ${renderGroup(1, 4)}

            </div>

        </div>
    `;
        }




        /* =========================================================
           主要获奖：纯文字列表
           年份 + 奖项名称 + 获奖成果
           ========================================================= */

        if (section.type === "awards") {

            const items = (section.groups || [])
                .flatMap(group => group.items || []);

            body = `
    <div class="award-simple-list">

      ${items.map(item => {

                const year = item.date
                    ? String(item.date).slice(0, 4)
                    : "";

                const achievement = item.achievement || "";
                const award = item.award || "";

                return `
          <div class="award-simple-item">
            ${year ? `<span class="award-simple-year">${year}</span>` : ""}
            ${achievement}
            ${award ? `（${award}）` : ""}
          </div>
        `;

            }).join("")}

    </div>
  `;
        }


        if (section.type === 'news') {
            body = `
    <div class="research-news-list">

      ${(section.items || []).map(item => `
        <article class="research-news-item">

          ${item.image ? `
            <div class="research-news-cover">
              ${item.url ? `
                <a href="${item.url}"
                   target="_blank"
                   rel="noopener noreferrer">
                  <img
                    src="${item.image}"
                    alt="${item.title || ''}"
                    loading="lazy"
                    decoding="async"
                  >
                </a>
              ` : `
                <img
                  src="${item.image}"
                  alt="${item.title || ''}"
                  loading="lazy"
                  decoding="async"
                >
              `}
            </div>
          ` : ''}

          <div class="research-news-content">

            <h4 class="research-news-title">
              ${item.url ? `
                <a href="${item.url}"
                   target="_blank"
                   rel="noopener noreferrer">
                  ${item.title || ''}
                </a>
              ` : `
                ${item.title || ''}
              `}
            </h4>

            ${item.text ? `
              <p class="research-news-text">
                ${item.text}
              </p>
            ` : ''}

            ${item.meta ? `
              <div class="research-news-meta">
                ${item.meta}
              </div>
            ` : ''}

          </div>

        </article>
      `).join('')}

    </div>
  `;
        }

        /* home 代表性成果  图片设置 */
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
                <img src="${item.image}" alt="${item.title || ""}" loading="lazy" decoding="async">
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
        } else if (section.type === 'paper-grid') {
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
        } else if (section.type === 'video-grid') {
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

        const centerPublicationTitles = [
            "出版著作",
            "主要获奖",
            "发表论文",

            "Published Books",
            "Major Awards",
            "Publications",
            "Published Papers"
        ];

        const sectionTitleClass =
            centerPublicationTitles.includes(section.title)
                ? "section-title pub-center-title"
                : "section-title";

        return `
  <section class="section${sectionTypeClass}"${sectionId}>
    ${
            section.title && section.type !== "allPublications"
                ? `<h3 class="section-title">${section.title}</h3>`
                : ''
        }
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
    function getProfileId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || '';
    }

    function createProfileMain(lang) {
        const id = getProfileId();
        const person =
            window.PERSON_DETAIL &&
            window.PERSON_DETAIL[lang] &&
            window.PERSON_DETAIL[lang][id];

        if (!person) {
            return `
        <main class="main container">
          <div class="panel content-panel">
            <div class="profile-message">
              ${lang === 'zh' ? '未找到该人员的详细信息。' : 'Person information was not found.'}
            </div>
          </div>
        </main>
      `;
        }

        const bio = String(person.bio || '')
            .replace(/\r/g, '')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean)
            .join(' ');

        return `
      <main class="main container">
        <div class="panel content-panel">
          <section class="profile-simple">
            <div class="profile-simple-photo">
              ${person.image
            ? `<img src="${person.image}" alt="${person.name || ''}">`
            : `<div class="profile-photo-placeholder"></div>`}
            </div>

            <div class="profile-simple-info">
              <h1 class="profile-simple-name">${person.name || ''}</h1>
              <p class="profile-simple-bio">${bio}</p>
            </div>
          </section>
        </div>
      </main>
    `;
    }

    function createMain(lang, pageKey) {
        if (pageKey === 'profile') {
            return createProfileMain(lang);
        }

        const page = getPageBundle(lang, pageKey);
        const mainTitle = page.mainTitle
            ? `<h2 class="page-main-title">${page.mainTitle}</h2>`
            : '';

        const sections = (page.sections || []).map(section => renderSection(section, lang)).join('');

        return `
    <main class="main container">
      <div class="panel content-panel">
        ${mainTitle}
        ${sections}
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




    function bindHomeGallerySlider() {
        const viewport = document.querySelector(
            'body[data-page="home"] .home-gallery-viewport'
        );

        if (!viewport) return;

        if (window.__homeGalleryCleanup) {
            window.__homeGalleryCleanup();
        }

        const track = viewport.querySelector('.home-gallery-track');
        if (!track) return;

        const originals = Array.from(track.children);
        const total = originals.length;

        if (total < 2) return;

        // 克隆开头的图片，实现循环播放
        originals.slice(0, Math.min(3, total)).forEach(function (item) {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        let index = 0;
        let timer = null;
        let resetTimer = null;

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        }



        function moveTo(targetIndex, animate = true) {
            const first = track.querySelector('.home-image-item');
            if (!first) return;

            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.columnGap || style.gap) || 0;
            const step = first.getBoundingClientRect().width + gap;

            track.style.transition = animate
                ? 'transform 0.5s ease'
                : 'none';

            track.style.transform =
                'translateX(-' + (targetIndex * step) + 'px)';
        }

        function next() {
            index += 1;
            moveTo(index);

            if (index >= total) {
                if (resetTimer !== null) {
                    window.clearTimeout(resetTimer);
                }

                resetTimer = window.setTimeout(function () {
                    index = 0;
                    moveTo(index, false);
                    resetTimer = null;
                }, 520);
            }
        }

        function previous() {
            stop();

            if (resetTimer !== null) {
                window.clearTimeout(resetTimer);
                resetTimer = null;
            }

            if (index <= 0) {
                index = total - 1;
                moveTo(index, false);
            } else {
                index -= 1;
                moveTo(index);
            }

            start();
        }

        function start() {
            stop();

            if (!viewport.matches(':hover')) {
                timer = window.setInterval(next, 3200);
            }
        }

        const prevBtn = viewport.querySelector('.home-gallery-prev');
        const nextBtn = viewport.querySelector('.home-gallery-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', previous);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                stop();

                if (resetTimer !== null) {
                    window.clearTimeout(resetTimer);
                    resetTimer = null;
                }

                next();
                start();
            });
        }

        viewport.addEventListener('mouseenter', stop);
        viewport.addEventListener('mouseleave', start);

        function handleResize() {
            moveTo(index, false);
        }

        window.addEventListener('resize', handleResize);

        window.__homeGalleryCleanup = function () {
            stop();

            if (resetTimer !== null) {
                window.clearTimeout(resetTimer);
                resetTimer = null;
            }

            window.removeEventListener('resize', handleResize);
        };

        start();
    }



    function bindHomeGalleryLightbox() {
        if (document.body.dataset.page !== 'home') return;
        if (window.__homeGalleryLightboxBound) return;

        window.__homeGalleryLightboxBound = true;

        // 创建大图预览层
        const overlay = document.createElement('div');
        overlay.className = 'home-image-lightbox';

        overlay.innerHTML = `
        <button type="button"
                class="home-lightbox-close"
                aria-label="关闭大图">×</button>
        <img class="home-lightbox-image" alt="大图预览">
    `;

        document.body.appendChild(overlay);

        const preview = overlay.querySelector('.home-lightbox-image');
        const closeButton = overlay.querySelector('.home-lightbox-close');

        function closeLightbox() {
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
            preview.removeAttribute('src');
        }

        // 直接监听首页照片，不依赖轮播容器
        document.addEventListener('click', function (event) {
            if (!(event.target instanceof Element)) return;

            const img = event.target.closest(
                'body[data-page="home"] .home-image-item img'
            );

            if (!img) return;

            event.preventDefault();

            preview.src = img.currentSrc || img.src;
            preview.alt = img.alt || '大图预览';

            overlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }, true);

        closeButton.addEventListener('click', closeLightbox);

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeLightbox();
            }
        });
    }


    function render(lang) {
        const pageKey = getPageKey();
        const pageBundle = getPageBundle(lang, pageKey);

        if (pageKey !== 'profile' && !pageBundle) {
            document.getElementById('app').innerHTML = '<div style="padding:40px;font-size:18px;">Page data not found.</div>';
            return;
        }

        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        const navItem = (window.SITE_NAV || []).find(n => n.key === pageKey);
        document.title = `${getSiteBundle(lang).site.name} - ${navItem ? navItem[lang] : pageKey}`;
        document.getElementById('app').innerHTML = [
            createHeader(lang, pageKey),
            createMain(lang, pageKey),
            createFooter(lang),
            '<button class="back-top" id="backTop" aria-label="back to top">↑</button>'
        ].join('');


        bindLanguageButtons();
        bindBackTop();
        bindLatestSlider();
        bindActivitySliders();
        bindHomeGallerySlider();
        bindHomeGalleryLightbox();
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

/* 书籍封面放大：对动态渲染的中英文页面均有效 */
window.openBookImage = function (img) {
    let overlay = document.getElementById("bookImageOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "bookImageOverlay";
        overlay.style.cssText = "position:fixed;inset:0;z-index:999999;display:none;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;background:rgba(0,0,0,.9)";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", "Book cover preview");
        overlay.innerHTML = `
            <button class="book-image-close" type="button" aria-label="Close">×</button>
            <img class="book-image-large" alt="">
        `;
        document.body.appendChild(overlay);
        overlay.querySelector(".book-image-large").style.cssText = "display:block;max-width:95vw;max-height:90vh;width:auto;height:auto;object-fit:contain";
        overlay.querySelector(".book-image-close").style.cssText = "position:absolute;top:20px;right:30px;background:transparent;border:0;color:white;font-size:40px;cursor:pointer";
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay || event.target.closest(".book-image-close")) {
                window.closeBookImage();
            }
        });
    }
    const largeImage = overlay.querySelector(".book-image-large");
    largeImage.src = img.currentSrc || img.src;
    largeImage.alt = img.alt || "";
    overlay.style.display = "flex";
    document.body.classList.add("book-image-open");
    document.body.style.overflow = "hidden";
    overlay.querySelector(".book-image-close").focus();
};

window.closeBookImage = function () {
    const overlay = document.getElementById("bookImageOverlay");
    if (overlay) {
        overlay.style.display = "none";
        const img = overlay.querySelector(".book-image-large");
        img.removeAttribute("src");
    }
    document.body.classList.remove("book-image-open");
    document.body.style.overflow = "";
};

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") window.closeBookImage();
    if ((event.key === "Enter" || event.key === " ") &&
        event.target.matches(".book-zoom-image")) {
        event.preventDefault();
        window.openBookImage(event.target);
    }
});