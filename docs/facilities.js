(function () {
  'use strict';

  // 데이터: facilities-data-v2.js (FACILITIES_V2). 항목 구조는 그 파일 맨 위 주석 참고.
  const DATA = FACILITIES_V2;

  const openBtn = document.getElementById('open-facilities');
  const backBtn = document.getElementById('back-from-facilities');
  const contentEl = document.getElementById('facilities-content');

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function trackMenuClick(menuName) {
    if (typeof gtag === "function") {
      gtag("event", "menu_click", { menu_name: menuName });
    }
  }

  openBtn.addEventListener('click', () => {
    // 홈 카드 트래킹은 app.js(open-facilities 리스너)에서 "소방시설 도감"으로 처리 — 여기서 중복 발화 금지
    showScreen('screen-facilities');
    init();
  });

  backBtn.addEventListener('click', () => showScreen('screen-home'));

  // 도감 '설치기준'이 어느 시점 법령 기준인지 표시 (법령 대조 시 갱신)
  const CRITERIA_BASIS_DATE = '2026.10';

  // ── 검토 모드: 상단 "소방시설 도감" 제목을 5번 연속 누르면 켜고 끔 ──
  // 켜면 원문 미확인 문장({?…?})이 노란 밑줄로 보임. 일반 사용자 화면에는 표시 없음.
  const REVIEW_KEY = 'fac-review-mode';
  function setReviewMode(on) {
    document.documentElement.classList.toggle('fac-review', on);
    try { localStorage.setItem(REVIEW_KEY, on ? '1' : '0'); } catch (e) {}
  }
  try { if (localStorage.getItem(REVIEW_KEY) === '1') document.documentElement.classList.add('fac-review'); } catch (e) {}
  (function bindReviewTap() {
    const title = document.querySelector('#screen-facilities .tb-title');
    if (!title) return;
    let count = 0, timer = null;
    title.addEventListener('click', () => {
      count++;
      clearTimeout(timer);
      timer = setTimeout(() => { count = 0; }, 1500);
      if (count < 5) return;
      count = 0;
      const on = !document.documentElement.classList.contains('fac-review');
      setReviewMode(on);
      if (typeof showToast === 'function') showToast(on ? '도감 검토 모드 켜짐 (노란 밑줄 = 원문 미확인)' : '도감 검토 모드 꺼짐');
    });
  })();

  let initialized = false;
  let activeTabIndex = 0;

  function init() {
    if (initialized) return;
    initialized = true;

    const tabBar = document.createElement('div');
    tabBar.className = 'rg-tab-bar';

    const contentArea = document.createElement('div');
    contentArea.className = 'rg-content';

    DATA.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rg-tab-btn' + (i === 0 ? ' active' : '');
      btn.dataset.idx = i;
      btn.innerHTML = `<span class="rg-tab-main">${tab.tabLabel}</span>`;
      tabBar.appendChild(btn);

      const panel = document.createElement('div');
      panel.className = 'fac-panel' + (i !== 0 ? ' hidden' : '');
      panel.dataset.idx = i;
      if (tab.intro) panel.appendChild(buildIntroCard(tab.intro));
      tab.items.forEach(item => panel.appendChild(buildAccordion(item)));
      contentArea.appendChild(panel);
    });

    function activateTab(idx) {
      activeTabIndex = Number(idx);
      tabBar.querySelectorAll('.rg-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.idx === String(activeTabIndex)));
      contentArea.querySelectorAll('.fac-panel').forEach(p => p.classList.toggle('hidden', p.dataset.idx !== String(activeTabIndex)));
      contentArea.scrollTop = 0;
      if (typeof animateSwipeNavigation === 'function') animateSwipeNavigation(contentEl, contentArea);
    }

    tabBar.addEventListener('click', e => {
      const btn = e.target.closest('.rg-tab-btn');
      if (!btn) return;
      activateTab(btn.dataset.idx);
    });

    contentEl.appendChild(tabBar);
    contentEl.appendChild(contentArea);

    if (typeof attachHorizontalSwipeNavigation === 'function') {
      attachHorizontalSwipeNavigation(contentEl, () => ({
        keys: DATA.map((_, i) => String(i)),
        current: String(activeTabIndex),
        onChange: activateTab,
      }));
    }
  }

  window.initFacilities = init;

  // 검색 딥링크 공용 헬퍼들
  function activateFacTab(tabIdx) {
    activeTabIndex = Number(tabIdx);
    contentEl.querySelectorAll('.rg-tab-bar .rg-tab-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.idx === String(tabIdx)));
    contentEl.querySelectorAll('.fac-panel').forEach(p =>
      p.classList.toggle('hidden', p.dataset.idx !== String(tabIdx)));
  }
  function facFlash(el) {
    if (!el) return;
    el.classList.add('search-flash');
    setTimeout(() => el.classList.remove('search-flash'), 1600);
  }
  function openAccordion(acc) {
    const header = acc.querySelector('.rg-accordion-header');
    const body = acc.querySelector('.rg-accordion-body');
    if (header) header.classList.add('open');
    if (body) body.classList.remove('hidden');
  }

  // 특정 도감 항목으로 바로 이동
  function openFacilityItem(tabIdx, itemId) {
    trackMenuClick('소방시설 도감');
    showScreen('screen-facilities');
    init();
    activateFacTab(tabIdx);
    const acc = document.getElementById('facacc-' + itemId);
    if (!acc) return;
    openAccordion(acc);
    // render/탭전환 직후엔 레이아웃이 안정되지 않아 scrollIntoView가 무효일 수 있어 약간 지연
    setTimeout(() => { acc.scrollIntoView({ behavior: 'auto', block: 'start' }); facFlash(acc); }, 60);
  }

  // 탭 상단 intro 카드로 이동(펼친 상태로)
  function openFacilityIntro(tabIdx) {
    trackMenuClick('소방시설 도감');
    showScreen('screen-facilities');
    init();
    activateFacTab(tabIdx);
    setTimeout(() => {
      const panel = contentEl.querySelector('.fac-panel[data-idx="' + tabIdx + '"]');
      const card = panel ? panel.querySelector('.fac-intro-card') : null;
      if (card) {
        const body = card.querySelector('.fac-intro-body');
        const toggle = card.querySelector('.fac-intro-toggle');
        if (body && body.classList.contains('hidden')) {
          body.classList.remove('hidden');
          if (toggle) toggle.classList.add('open');
        }
        card.scrollIntoView({ behavior: 'auto', block: 'start' });
        facFlash(card);
      } else { const sc = contentEl.querySelector('.rg-content'); if (sc) sc.scrollTop = 0; }
    }, 60);
  }

  window.openFacilityItem = openFacilityItem;
  window.openFacilityIntro = openFacilityIntro;

  // 결과 화면 등에서 특정 도감 항목만 모달(팝업)로 보기 — 화면 이동 없이 그 항목만
  function openFacilityModal(itemId) {
    let found = null;
    DATA.forEach(tab => (tab.items || []).forEach(it => { if (it.id === itemId) found = it; }));
    if (!found) return;
    const overlay = document.getElementById('fac-modal-overlay');
    const host = document.getElementById('fac-modal-body');
    if (!overlay || !host) return;
    const titleEl = document.getElementById('fac-modal-title');
    const catEl = document.getElementById('fac-modal-cat');
    if (catEl) catEl.textContent = found.category || '';
    if (titleEl) titleEl.textContent = found.name || '';
    host.innerHTML = '';
    // 모달은 탐색기 결과 화면에서 열리므로 "탐색기에서 확인" 안내는 뺌
    const acc = buildAccordion(found, { inModal: true });
    const accBody = acc.querySelector('.rg-accordion-body');
    if (accBody) { accBody.classList.remove('hidden'); host.appendChild(accBody); }
    else { host.appendChild(acc); }
    overlay.classList.remove('hidden');
    host.scrollTop = 0;
    trackMenuClick('소방시설 도감');
  }
  function closeFacilityModal() {
    const overlay = document.getElementById('fac-modal-overlay');
    if (overlay) overlay.classList.add('hidden');
  }
  window.openFacilityModal = openFacilityModal;
  window.closeFacilityModal = closeFacilityModal;

  (function bindFacModal() {
    const overlay = document.getElementById('fac-modal-overlay');
    if (!overlay) return;
    const closeBtn = document.getElementById('fac-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeFacilityModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeFacilityModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeFacilityModal();
    });
  })();

  function encodePath(path) {
    return path.split('/').map((seg, i) => (i === 0 && (seg === '.' || seg === '..')) ? seg : encodeURIComponent(seg)).join('/');
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
  // **굵게**, {?원문 미확인?} 표시를 HTML로. 미확인 표시는 검토 모드에서만 밑줄이 보임(CSS)
  function md(s) {
    return esc(s)
      .replace(/\{\?(.+?)\?\}/g, '<span class="nf-unv">$1</span>')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }

  function img(src, alt) {
    return `<img src="${esc(encodePath(src))}" alt="${esc(alt || '')}" loading="lazy">`;
  }

  function fieldRows(rows) {
    let cards = '', bullets = '';
    rows.forEach(r => {
      if (r.title || r.photo) {
        cards += '<div class="nf-field">' +
          (r.photo ? `<div class="nf-field-photo">${img(r.photo, r.title)}${r.source ? `<span class="src">출처: ${esc(r.source)}</span>` : ''}</div>` : '') +
          `<div class="nf-field-text">${r.title ? `<b>${esc(r.title)}</b>` : ''}${md(r.text)}</div></div>`;
      } else {
        bullets += `<li>${md(r.text)}</li>`;
      }
    });
    return (cards ? `<div class="nf-fields">${cards}</div>` : '') + (bullets ? `<ul class="nf-list">${bullets}</ul>` : '');
  }
  function sec(title, inner) {
    return `<div class="nf-sec"><div class="nf-sec-title">${esc(title)}</div>${inner}</div>`;
  }
  function ul(list, ordered) {
    const t = ordered ? 'ol' : 'ul';
    return `<${t} class="nf-list">${list.map(x => `<li>${md(x)}</li>`).join('')}</${t}>`;
  }

  function itemBodyHtml(it, opts) {
    let h = `<p class="nf-summary">${md(it.summary)}</p>`;
    if (it.photo) {
      h += `<div class="nf-main-photo">${img(it.photo, it.name)}${it.photoLabel ? `<span class="fac-photo-source-badge">${esc(it.photoLabel)}</span>` : ''}</div>`;
    }
    if (it.field) {
      h += sec('현장에서 알아보는 법', (it.field.lead ? `<p class="nf-lead">${md(it.field.lead)}</p>` : '') + fieldRows(it.field.rows || []));
    }
    (it.sections || []).forEach(s => {
      h += sec(s.title, ul(s.list) + (s.note ? `<div class="nf-note">${md(s.note)}</div>` : ''));
    });
    if (it.types && it.types.length) {
      let t = '', lastGroup = null, open = false;
      it.types.forEach(ty => {
        if (ty.group !== lastGroup) {
          if (open) t += '</div>';
          if (ty.group) t += `<div class="nf-type-group">${esc(ty.group)}</div>`;
          t += '<div class="nf-types">'; open = true; lastGroup = ty.group;
        }
        t += `<div class="nf-type"><b>${esc(ty.name)}${ty.rare ? '<span class="rare">드묾</span>' : ''}</b><span>${md(ty.desc)}</span></div>`;
      });
      if (open) t += '</div>';
      h += sec('종류', t);
    }
    if (it.checks && it.checks.length) h += sec('점검할 때 보는 것', ul(it.checks));
    if (!opts.inModal) {
      h += '<button type="button" class="nf-explorer"><b>이 건물에 필요한가요?</b> 설치 대상은 건축허가 시기에 따라 달라서 <b>소방시설 탐색기</b>에서 확인합니다. →</button>';
    }
    const m = it.more;
    if (m) {
      const parts = [];
      let b = '';
      if (m.components && m.components.length) {
        parts.push('구성요소');
        b += sec('구성요소', m.components.map(c => `<div class="nf-comp"><b>${esc(c.name)}</b>${md(c.desc)}</div>`).join(''));
      }
      if (m.criteria && m.criteria.length) {
        parts.push('설치기준');
        b += sec('설치기준', `<div class="fac-criteria-basis">현행 기준(${CRITERIA_BASIS_DATE}) · 기존 건물은 설치 당시 기준이 적용됩니다.</div>` + ul(m.criteria));
      }
      if (m.usage && m.usage.length) {
        const ut = m.usageTitle || '사용법';
        parts.push(ut);
        b += sec(ut, ul(m.usage, !m.usageTitle) + (m.note ? `<div class="nf-note">${md(m.note)}</div>` : ''));
      } else if (m.note) {
        b += `<div class="nf-note">${md(m.note)}</div>`;
      }
      (m.extra || []).forEach(x => { parts.push(x.title); b += sec(x.title, ul(x.list)); });
      h += `<details class="nf-more"><summary>더 자세히 (${esc(parts.join(' · '))})</summary><div class="nf-more-body">${b}</div></details>`;
    }
    return h;
  }

  // 탐색기 열기 — 홈의 소방시설 탐색기 카드와 같은 동작
  function openExplorer() {
    const btn = document.getElementById('open-explorer');
    if (btn) btn.click();
  }

  function buildAccordion(item, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'rg-accordion';
    if (item.id) wrap.id = 'facacc-' + item.id;

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'rg-accordion-header';
    header.innerHTML = `
      <div>
        <div class="fac-item-category">${esc(item.category)}</div>
        <div class="rg-acc-label">${esc(item.name)}</div>
      </div>
      <span class="rg-acc-chevron">▼</span>`;

    const body = document.createElement('div');
    body.className = 'rg-accordion-body nf-body hidden';
    body.innerHTML = itemBodyHtml(item, opts);
    const exp = body.querySelector('.nf-explorer');
    if (exp) exp.addEventListener('click', openExplorer);

    header.addEventListener('click', () => {
      const open = header.classList.toggle('open');
      body.classList.toggle('hidden', !open);
    });

    wrap.appendChild(header);
    wrap.appendChild(body);
    return wrap;
  }

  function buildIntroCard(intro) {
    const card = document.createElement('div');
    card.className = 'fac-intro-card';

    // 헤더 (클릭으로 접기/펼치기). 처음엔 접어 둠 — 항목 목록이 바로 보이게
    const header = document.createElement('div');
    header.className = 'fac-intro-header';
    header.innerHTML = `<div class="fac-intro-header-left">
        <span class="fac-intro-title">${esc(intro.title)}</span>
        ${intro.badge ? `<span class="fac-intro-badge">${esc(intro.badge)}</span>` : ''}
      </div>
      <span class="fac-intro-toggle">▼</span>`;
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'fac-intro-body nf-body hidden';
    let h = `<p class="nf-summary">${md(intro.summary)}</p>`;
    const icon = intro.groupsTitle ? '' : '📍 ';
    let g = '';
    (intro.groups || []).forEach(gr => { g += `<div class="nf-place">${icon}${esc(gr.place)}</div>` + fieldRows(gr.rows || []); });
    h += sec(intro.groupsTitle || '장소별 장비', g);
    if (intro.note) h += `<div class="nf-note">${md(intro.note)}</div>`;
    if (intro.checks && intro.checks.length) h += sec('점검할 때 보는 것', ul(intro.checks));
    body.innerHTML = h;
    card.appendChild(body);

    const toggle = header.querySelector('.fac-intro-toggle');
    header.addEventListener('click', () => {
      const willOpen = body.classList.contains('hidden');
      body.classList.toggle('hidden', !willOpen);
      toggle.classList.toggle('open', willOpen);
    });

    return card;
  }
})();
