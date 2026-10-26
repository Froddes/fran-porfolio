const DURATION = 6500;
const RESUME_AFTER = 12000;

export function mountProjects(root) {
  const ring = root.querySelector('[data-ring]');
  const slices = [...root.querySelectorAll('[data-slice]')];
  const hubs = [...root.querySelectorAll('[data-hub]')];
  const panels = [...root.querySelectorAll('[data-panel]')];
  const picks = [...root.querySelectorAll('[data-pick]')];
  const progress = root.querySelector('[data-progress]');
  const counter = root.querySelector('[data-counter]');
  const total = slices.length;
  const stacked = window.matchMedia('(max-width: 900px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let current = 0;
  let rotation = 0;
  let timer = null;
  let resumeTimer = null;
  let hovering = false;
  let visible = false;
  let started = 0;
  let remaining = DURATION;

  const target = () => (stacked.matches ? 90 : 0);
  const centerOf = (i) => parseFloat(slices[i].dataset.center);
  const norm = (a) => ((a % 360) + 540) % 360 - 180;

  const rotateTo = (i, forward) => {
    const goal = target() - centerOf(i);
    let delta = norm(goal - rotation);
    if (forward && delta > 0) delta -= 360;
    rotation += delta;
    ring.style.transform = `rotate(${rotation}deg)`;
  };

  const restartProgress = () => {
    progress.classList.remove('run', 'paused');
    void progress.getBoundingClientRect();
    if (!reduced.matches) progress.classList.add('run');
  };

  const show = (i, { forward = false } = {}) => {
    current = (i + total) % total;
    const color = slices[current].getAttribute('fill');
    root.style.setProperty('--p-color', color);

    slices.forEach((s, k) => {
      s.classList.toggle('active', k === current);
      s.setAttribute('aria-pressed', String(k === current));
    });
    hubs.forEach((h, k) => h.classList.toggle('active', k === current));
    picks.forEach((b, k) => b.classList.toggle('active', k === current));
    panels.forEach((p, k) => {
      const on = k === current;
      p.classList.toggle('active', on);
      p.setAttribute('aria-hidden', String(!on));
      p.querySelectorAll('a').forEach((a) => { a.tabIndex = on ? 0 : -1; });
    });
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

    rotateTo(current, forward);
    restartProgress();
  };

  const stop = () => {
    clearTimeout(timer);
    timer = null;
  };

  const schedule = (ms = DURATION) => {
    stop();
    if (reduced.matches || hovering || !visible || document.hidden) return;
    started = performance.now();
    remaining = ms;
    timer = setTimeout(() => {
      show(current + 1, { forward: true });
      schedule();
    }, ms);
  };

  const pause = () => {
    if (!timer) return;
    remaining = Math.max(0, remaining - (performance.now() - started));
    stop();
    progress.classList.add('paused');
  };

  const resume = () => {
    if (timer || hovering || !visible || resumeTimer) return;
    progress.classList.remove('paused');
    schedule(remaining || DURATION);
  };

  const hold = () => {
    stop();
    clearTimeout(resumeTimer);
    progress.classList.add('paused');
    resumeTimer = setTimeout(() => {
      resumeTimer = null;
      restartProgress();
      progress.classList.add('paused');
      remaining = DURATION;
      resume();
    }, RESUME_AFTER);
  };

  const pick = (i) => {
    if (i === current) return;
    show(i);
    hold();
  };

  slices.forEach((s, i) => {
    s.addEventListener('click', () => pick(i));
    s.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick(current + 1); slices[current].focus(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(current - 1); slices[current].focus(); }
    });
  });
  picks.forEach((b, i) => b.addEventListener('click', () => pick(i)));

  const layout = root.querySelector('.layout');
  layout.addEventListener('mouseenter', () => { hovering = true; pause(); });
  layout.addEventListener('mouseleave', () => { hovering = false; resume(); });
  layout.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') hold(); });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resume();
    else pause();
  }, { threshold: 0.35 }).observe(layout);

  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : resume()));
  stacked.addEventListener('change', () => rotateTo(current, false));

  ring.style.transition = 'none';
  rotateTo(0, false);
  void ring.getBoundingClientRect();
  ring.style.transition = '';
  restartProgress();
  progress.classList.add('paused');
}
