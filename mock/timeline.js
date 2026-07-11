// すべてのアニメを一時停止し、外部（Puppeteer）からmsシークできるようにする。
// ?play=1 で通常再生（人間のプレビュー用）。
(() => {
  const play = new URLSearchParams(location.search).get('play') === '1';
  let anims = [];
  const collect = () => { anims = document.getAnimations(); };
  window.__ready = new Promise((res) => {
    addEventListener('load', () => requestAnimationFrame(() => {
      collect();
      if (!play) anims.forEach(a => a.pause());
      res();
    }));
  });
  window.__duration = () => {
    if (typeof window.SCENE_DURATION === 'number') return window.SCENE_DURATION;
    return Math.max(0, ...anims.map(a => {
      const t = a.effect.getComputedTiming();
      return t.delay + (t.iterations === Infinity ? 0 : t.duration * t.iterations);
    }));
  };
  window.__seek = async (ms) => {
    collect();
    anims.forEach(a => { a.pause(); a.currentTime = ms; });
    await new Promise(requestAnimationFrame);
  };
})();
