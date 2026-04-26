(function () {
  'use strict';

  const openBtn = document.getElementById('open-facilities');
  const backBtn = document.getElementById('back-from-facilities');
  const contentEl = document.getElementById('facilities-content');

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  openBtn.addEventListener('click', () => {
    showScreen('screen-facilities');
    init();
  });

  backBtn.addEventListener('click', () => showScreen('screen-home'));

  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    const tabBar = document.createElement('div');
    tabBar.className = 'rg-tab-bar';

    const contentArea = document.createElement('div');
    contentArea.className = 'rg-content';

    FACILITIES_DATA.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rg-tab-btn' + (i === 0 ? ' active' : '');
      btn.dataset.idx = i;
      btn.innerHTML = `<span class="rg-tab-main">${tab.tabLabel}</span>`;
      tabBar.appendChild(btn);

      const panel = document.createElement('div');
      panel.className = 'fac-panel' + (i !== 0 ? ' hidden' : '');
      panel.dataset.idx = i;
      tab.items.forEach(item => panel.appendChild(buildAccordion(item)));
      contentArea.appendChild(panel);
    });

    tabBar.addEventListener('click', e => {
      const btn = e.target.closest('.rg-tab-btn');
      if (!btn) return;
      const idx = btn.dataset.idx;
      tabBar.querySelectorAll('.rg-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.idx === idx));
      contentArea.querySelectorAll('.fac-panel').forEach(p => p.classList.toggle('hidden', p.dataset.idx !== idx));
      contentArea.scrollTop = 0;
    });

    contentEl.appendChild(tabBar);
    contentEl.appendChild(contentArea);
  }

  function encodePath(path) {
    return path.split('/').map((seg, i) => (i === 0 && (seg === '.' || seg === '..')) ? seg : encodeURIComponent(seg)).join('/');
  }

  function makePhotoGallery(photos) {
    const wrap = document.createElement('div');
    wrap.className = 'fac-photo-gallery' + (photos.length > 1 ? ' fac-photo-gallery-multi' : '');

    photos.forEach(p => {
      const fig = document.createElement('figure');
      fig.className = 'fac-photo-fig';

      const imgWrap = document.createElement('div');
      imgWrap.className = 'fac-photo-img-wrap';

      const img = document.createElement('img');
      img.src = encodePath(p.src);
      img.className = 'fac-photo-img';
      img.alt = p.caption || '';
      img.loading = 'lazy';
      imgWrap.appendChild(img);

      if (p.source) {
        const badge = document.createElement('span');
        badge.className = 'fac-photo-source-badge';
        badge.textContent = '출처: ' + p.source;
        imgWrap.appendChild(badge);
      }

      fig.appendChild(imgWrap);

      if (p.caption) {
        const cap = document.createElement('figcaption');
        cap.className = 'fac-photo-cap';
        cap.textContent = p.caption;
        fig.appendChild(cap);
      }

      wrap.appendChild(fig);
    });

    return wrap;
  }

  function buildAccordion(item) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-accordion';

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'rg-accordion-header';
    header.innerHTML = `
      <div>
        <div class="fac-item-category">${item.category}</div>
        <div class="rg-acc-label">${item.name} <span class="fac-level-badge fac-level-${item.level}">${levelLabel(item.level)}</span></div>
      </div>
      <span class="rg-acc-chevron">▼</span>`;

    const body = document.createElement('div');
    body.className = 'rg-accordion-body hidden';

    if (item.definition) {
      const el = document.createElement('div');
      el.className = 'fac-definition';
      el.textContent = item.definition;
      body.appendChild(el);
    }

    if (item.description) {
      const el = document.createElement('p');
      el.className = 'fac-description';
      el.textContent = item.description;
      body.appendChild(el);
    }

    // 사진 갤러리: 실제 사진이 있으면 표시, 없고 compact가 아니면 플레이스홀더
    if (item.photos?.length) {
      body.appendChild(makePhotoGallery(item.photos));
    } else if (item.level !== 'compact') {
      body.appendChild(makePlaceholder(`${item.name} 대표 사진`));
    }

    if (item.types?.length) {
      body.appendChild(makeSectionLabel('종류'));
      const grid = document.createElement('div');
      grid.className = 'fac-type-grid';
      item.types.forEach(t => {
        const card = document.createElement('div');
        card.className = 'fac-type-card';

        if (t.photo) {
          const photoWrap = document.createElement('div');
          photoWrap.className = 'fac-mini-photo';
          if (typeof t.photo === 'string') {
            const img = document.createElement('img');
            img.src = encodePath(t.photo);
            img.alt = t.name;
            img.loading = 'lazy';
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
            photoWrap.appendChild(img);
          } else {
            photoWrap.textContent = '📷';
          }
          card.appendChild(photoWrap);
        }

        const name = document.createElement('div');
        name.className = 'fac-type-name';
        name.textContent = t.name;
        const desc = document.createElement('div');
        desc.className = 'fac-type-desc';
        desc.textContent = t.desc;
        card.appendChild(name);
        card.appendChild(desc);
        grid.appendChild(card);
      });
      body.appendChild(grid);
    }

    if (item.components?.length) {
      body.appendChild(makeSectionLabel('주요 구성요소'));
      const list = document.createElement('div');
      list.className = 'fac-comp-list';
      item.components.forEach(c => {
        const row = document.createElement('div');
        row.className = 'fac-comp-row';
        if (c.photo) row.appendChild(makeMiniPhoto('sm'));
        const text = document.createElement('div');
        text.className = 'fac-comp-text';
        text.innerHTML = `<div class="fac-comp-name">${c.name}</div><div class="fac-comp-desc">${c.desc}</div>`;
        row.appendChild(text);
        list.appendChild(row);
      });
      body.appendChild(list);
    }

    if (item.criteria?.length) {
      body.appendChild(makeSectionLabel('핵심 설치기준'));
      const ul = document.createElement('ul');
      ul.className = 'rg-acc-desc';
      item.criteria.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    if (item.usage?.length) {
      body.appendChild(makeSectionLabel('사용법'));
      const ol = document.createElement('ol');
      ol.className = 'fac-usage-list';
      item.usage.forEach(u => {
        const li = document.createElement('li');
        li.textContent = u;
        ol.appendChild(li);
      });
      body.appendChild(ol);
    }

    if (item.storage?.length) {
      body.appendChild(makeSectionLabel('보관법'));
      const ul = document.createElement('ul');
      ul.className = 'rg-acc-desc';
      item.storage.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    if (item.inspection?.length) {
      body.appendChild(makeSectionLabel('점검방법'));
      const ul = document.createElement('ul');
      ul.className = 'rg-acc-desc';
      item.inspection.forEach(ins => {
        const li = document.createElement('li');
        li.textContent = ins;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    if (item.tips?.length) {
      body.appendChild(makeSectionLabel('주의사항'));
      const box = document.createElement('div');
      box.className = 'info-box amber';
      item.tips.forEach((tip, i) => {
        const p = document.createElement('p');
        p.style.margin = i === 0 ? '0' : '6px 0 0';
        p.textContent = tip;
        box.appendChild(p);
      });
      body.appendChild(box);
    }

    header.addEventListener('click', () => {
      const open = header.classList.toggle('open');
      body.classList.toggle('hidden', !open);
    });

    wrap.appendChild(header);
    wrap.appendChild(body);
    return wrap;
  }

  function makePlaceholder(label) {
    const el = document.createElement('div');
    el.className = 'fac-photo-placeholder';
    el.innerHTML = `<span>📷</span><span>${label} 준비중</span>`;
    return el;
  }

  function makeMiniPhoto(size) {
    const el = document.createElement('div');
    el.className = 'fac-mini-photo' + (size === 'sm' ? ' fac-mini-photo-sm' : '');
    el.textContent = '📷';
    return el;
  }

  function makeSectionLabel(text) {
    const el = document.createElement('div');
    el.className = 'rg-section-label';
    el.textContent = text;
    return el;
  }

  function levelLabel(level) {
    return { full: 'FULL', standard: 'STD', compact: 'COMPACT' }[level] || '';
  }
})();
