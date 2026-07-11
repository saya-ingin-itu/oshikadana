// 3×3ポケットのバインダーページを重ねて描画し、ページめくりをWAAPIで行う。
(() => {
  const POCKET = (cls) => cls === 'empty'
    ? '<div class="pkt empty">＋</div>'
    : `<div class="pkt"><div class="card ${cls}"><div class="deco"></div></div></div>`;

  window.mountBinder = (container, pages) => {
    container.classList.add('binder');
    container.innerHTML =
      '<div class="rings">' + '<i></i>'.repeat(6) + '</div>' +
      '<div class="stack">' +
      pages.map((p, i) =>
        `<div class="bpage" style="z-index:${pages.length - i}">
           <div class="sheet3x3">${p.map(POCKET).join('')}</div>
         </div>`).join('') +
      '</div>';
    const pageEls = [...container.querySelectorAll('.bpage')];
    const flip = (i, opts = {}) => {
      const el = pageEls[i];
      if (!el) return;
      el.style.transformOrigin = 'left center';
      el.animate(
        [{ transform: 'perspective(1200px) rotateY(0deg)' },
         { transform: 'perspective(1200px) rotateY(-165deg)' }],
        { delay: opts.at ?? 0, duration: opts.dur ?? 900,
          easing: 'cubic-bezier(.4,.1,.2,1)', fill: 'both' });
    };
    return { flip, pageEls };
  };

  window.enableInteractive = (binder) => {
    let next = 0;
    addEventListener('pointerdown', (e) => {
      if (e.clientX > innerWidth / 2) binder.flip(next++);
    });
  };
})();
