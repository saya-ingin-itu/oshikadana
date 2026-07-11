// STORYBOARD宣言からWAAPIアニメを構築する。timeline.jsより先に読み込むこと。
(() => {
  addEventListener('DOMContentLoaded', () => {
    const steps = window.STORYBOARD || [];
    let end = 0;
    for (const s of steps) {
      const els = document.querySelectorAll(s.sel);
      if (!els.length) console.warn('STORYBOARD: no element for', s.sel);
      els.forEach(el => el.animate([s.from, s.to], {
        delay: s.at, duration: s.dur, easing: s.easing || 'ease-in-out', fill: s.fill || 'both',
      }));
      end = Math.max(end, s.at + s.dur);
    }
    window.SCENE_DURATION = window.SCENE_DURATION || end;
  });
})();
