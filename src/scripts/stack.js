export function mountStack(root) {
  const techs = [...root.querySelectorAll('[data-tech]')];
  const layers = [...root.querySelectorAll('[data-layer]')];
  const pills = [...root.querySelectorAll('[data-project]')];
  const count = root.querySelector('[data-stack-count]');
  const word = document.documentElement.lang === 'en' ? 'technologies' : 'tecnologías';
  let selected = null;

  const highlight = (slug) => {
    const pill = pills.find((p) => p.dataset.project === slug);
    const color = pill ? getComputedStyle(pill).getPropertyValue('--dot') : '';
    let matches = 0;
    techs.forEach((t) => {
      const used = !!slug && t.dataset.used.split(' ').includes(slug);
      if (used) matches++;
      t.classList.toggle('dim', !!slug && !used);
      t.classList.toggle('match', used);
      t.style.setProperty('--match', color);
    });
    layers.forEach((l) => {
      const any = !slug || l.querySelector('.match');
      l.classList.toggle('faded', !any);
    });
    count.textContent = slug ? `${matches} ${word}` : '';
  };

  techs.forEach((t) => {
    t.addEventListener('click', () => {
      const on = !t.classList.contains('on');
      techs.forEach((x) => x.classList.remove('on'));
      t.classList.toggle('on', on);
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-tech]')) techs.forEach((x) => x.classList.remove('on'));
  });

  pills.forEach((p) => {
    p.addEventListener('mouseenter', () => { if (!selected) highlight(p.dataset.project); });
    p.addEventListener('mouseleave', () => { if (!selected) highlight(null); });
    p.addEventListener('click', () => {
      selected = selected === p.dataset.project ? null : p.dataset.project;
      pills.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.project === selected)));
      highlight(selected);
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('anim');
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    root.classList.add('in');
    observer.disconnect();
  }, { threshold: 0.15 });
  observer.observe(root.querySelector('.layers'));
}
