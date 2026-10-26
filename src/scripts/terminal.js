import { buildFs } from '../data/filesystem.js';
import { links, person, projects } from '../data/profile.js';

const t = {
  es: {
    notFound: (c) => `bash: ${c}: orden no encontrada`,
    noSuch: (cmd, p) => `${cmd}: no se puede acceder a '${p}': No existe el fichero o el directorio`,
    cdNoSuch: (p) => `bash: cd: ${p}: No existe el fichero o el directorio`,
    notDir: (p) => `bash: cd: ${p}: No es un directorio`,
    isDir: (cmd, p) => `${cmd}: ${p}: Es un directorio`,
    binary: (p) => `${p}: fichero binario. Prueba: download ${p.replace(/\.pdf$/, '')}`,
    missing: (cmd) => `${cmd}: falta un operando`,
    openUsage: 'uso: open <proyecto|linkedin|github|email|froddes|cv|url>',
    opening: (x) => `abriendo ${x}…`,
    downloading: (x) => `descargando ${x}…`,
    grepUsage: 'uso: grep [-i] <patrón> [ruta]',
    noMatches: 'sin coincidencias',
    sudo: `${person.user} no está en el archivo sudoers. Se informará de este incidente.`,
    rm: 'rm: buen intento. Este sistema de archivos es de solo lectura.',
    exit: 'logout\n\nNo te vayas todavía: prueba neofetch o cat about.md',
    editor: (e) => `${e}: aquí no hay nada que editar. Y para salir de vim: :q!`,
    langSwitch: 'cambiando a la versión en inglés…',
    motd: (d) => `Último inicio de sesión: ${d} en tty1\nEscribe help para ver los comandos.`,
    whoami: `${person.user}\n${person.name} · estudiante de Ingeniería Informática (US)\nDesarrollo full stack, automatización con IA e infraestructura.`,
    dirs: 'directorios',
    files: 'ficheros',
    help: [
      ['ls [-a] [-l] [ruta]', 'lista el contenido de un directorio'],
      ['cd [ruta]', 'cambia de directorio (~, .., rutas absolutas)'],
      ['pwd', 'muestra el directorio actual'],
      ['cat <fichero>', 'muestra un fichero'],
      ['head [-n N] <fichero>', 'primeras líneas de un fichero'],
      ['tree [ruta]', 'estructura en árbol'],
      ['grep [-i] <patrón> [ruta]', 'busca texto en los ficheros'],
      ['whoami', 'quién soy'],
      ['neofetch', 'ficha del sistema'],
      ['open <destino>', 'abre un proyecto o enlace (open cittawa, open linkedin)'],
      ['download cv', 'descarga mi CV en PDF'],
      ['history', 'comandos anteriores'],
      ['lang en', 'cambia a inglés'],
      ['clear', 'limpia la pantalla'],
    ],
    neo: {
      os: 'SO', host: 'Host', uptime: 'Uptime', shell: 'Shell', degree: 'Estudios', langs: 'Idiomas', stack: 'Stack', infra: 'Infra', status: 'Estado',
      degreeVal: 'Ing. Informática – TI (US), último curso',
      langsVal: 'español, inglés',
      statusVal: 'buscando prácticas · feb 2027',
      years: (n) => `${n} años desarrollando para clientes`,
    },
  },
  en: {
    notFound: (c) => `bash: ${c}: command not found`,
    noSuch: (cmd, p) => `${cmd}: cannot access '${p}': No such file or directory`,
    cdNoSuch: (p) => `bash: cd: ${p}: No such file or directory`,
    notDir: (p) => `bash: cd: ${p}: Not a directory`,
    isDir: (cmd, p) => `${cmd}: ${p}: Is a directory`,
    binary: (p) => `${p}: binary file. Try: download ${p.replace(/\.pdf$/, '')}`,
    missing: (cmd) => `${cmd}: missing operand`,
    openUsage: 'usage: open <project|linkedin|github|email|froddes|cv|url>',
    opening: (x) => `opening ${x}…`,
    downloading: (x) => `downloading ${x}…`,
    grepUsage: 'usage: grep [-i] <pattern> [path]',
    noMatches: 'no matches',
    sudo: `${person.user} is not in the sudoers file. This incident will be reported.`,
    rm: 'rm: nice try. This file system is read-only.',
    exit: 'logout\n\nDon’t leave yet: try neofetch or cat about.md',
    editor: (e) => `${e}: nothing to edit here. And to quit vim: :q!`,
    langSwitch: 'switching to the Spanish version…',
    motd: (d) => `Last login: ${d} on tty1\nType help to list the commands.`,
    whoami: `${person.user}\n${person.name} · Computer Engineering student (US)\nFull-stack development, AI automation and infrastructure.`,
    dirs: 'directories',
    files: 'files',
    help: [
      ['ls [-a] [-l] [path]', 'list directory contents'],
      ['cd [path]', 'change directory (~, .., absolute paths)'],
      ['pwd', 'print working directory'],
      ['cat <file>', 'print a file'],
      ['head [-n N] <file>', 'first lines of a file'],
      ['tree [path]', 'tree view'],
      ['grep [-i] <pattern> [path]', 'search text in files'],
      ['whoami', 'who I am'],
      ['neofetch', 'system info'],
      ['open <target>', 'open a project or link (open cittawa, open linkedin)'],
      ['download cv', 'download my CV as PDF'],
      ['history', 'previous commands'],
      ['lang es', 'switch to Spanish'],
      ['clear', 'clear the screen'],
    ],
    neo: {
      os: 'OS', host: 'Host', uptime: 'Uptime', shell: 'Shell', degree: 'Studies', langs: 'Languages', stack: 'Stack', infra: 'Infra', status: 'Status',
      degreeVal: 'Computer Eng. – IT (US), final year',
      langsVal: 'spanish, english',
      statusVal: 'looking for an internship · Feb 2027',
      years: (n) => `${n} years building for clients`,
    },
  },
};

const COMMANDS = ['help', 'ls', 'cd', 'pwd', 'cat', 'head', 'tree', 'grep', 'whoami', 'neofetch', 'open', 'download', 'history', 'clear', 'echo', 'date', 'lang', 'sudo', 'rm', 'exit', 'vim', 'nano'];

export function mountTerminal(root) {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
  const s = t[lang];
  const home = ['home', person.user];
  const fs = {
    type: 'dir',
    children: {
      home: { type: 'dir', children: { [person.user]: buildFs(lang) } },
      etc: {
        type: 'dir',
        children: {
          hostname: { type: 'file', content: `${person.host}\n` },
          'os-release': { type: 'file', content: 'NAME="Fran OS"\nVERSION="2027"\nID=fran\n' },
        },
      },
    },
  };

  const out = root.querySelector('[data-term-output]');
  const form = root.querySelector('[data-term-form]');
  const input = root.querySelector('[data-term-input]');
  const promptEl = root.querySelector('[data-term-prompt]');
  const screen = root.querySelector('[data-term-screen]');

  let cwd = [...home];
  const history = [];
  let histIdx = 0;

  const pathString = (segs) => {
    const abs = '/' + segs.join('/');
    const h = '/' + home.join('/');
    if (abs === h) return '~';
    if (abs.startsWith(h + '/')) return '~' + abs.slice(h.length);
    return abs;
  };

  const promptText = () => `${person.user}@${person.host}:${pathString(cwd)}$`;
  const renderPrompt = () => { promptEl.textContent = promptText(); };

  const getNode = (segs) => {
    let node = fs;
    for (const seg of segs) {
      if (node.type !== 'dir' || !node.children[seg]) return null;
      node = node.children[seg];
    }
    return node;
  };

  const resolve = (p = '') => {
    let segs;
    let rest = p;
    if (p === '~' || p.startsWith('~/')) { segs = [...home]; rest = p.slice(1); }
    else if (p.startsWith('/')) segs = [];
    else segs = [...cwd];
    for (const part of rest.split('/')) {
      if (!part || part === '.') continue;
      if (part === '..') segs.pop();
      else segs.push(part);
    }
    return segs;
  };

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  const print = (content, cls) => {
    const row = el('div', cls ? `t-line ${cls}` : 't-line');
    if (typeof content === 'string') row.textContent = content;
    else row.append(...content);
    out.append(row);
    return row;
  };

  const printBlock = (text, cls) => text.replace(/\n$/, '').split('\n').forEach((l) => print(l, cls));

  const printDoc = (text) => {
    for (const l of text.replace(/\n$/, '').split('\n')) {
      if (l.startsWith('# ')) print(l, 't-title');
      else if (l.startsWith('- ')) print([el('span', 't-accent', '• '), document.createTextNode(l.slice(2))]);
      else print(l || ' ');
    }
  };

  const nameSpan = (name, node) => {
    if (node.type === 'dir') return el('span', 't-dir', name === '.' || name === '..' ? name : name + '/');
    if (node.type === 'download') return el('span', 't-dl', name);
    return el('span', 't-file', name);
  };

  const scroll = () => { screen.scrollTop = screen.scrollHeight; };

  const echo = (cmd) => print([el('span', 't-prompt', promptText() + ' '), document.createTextNode(cmd)]);

  const visibleEntries = (node, all) =>
    Object.entries(node.children)
      .filter(([k]) => all || !k.startsWith('.'))
      .sort(([a, x], [b, y]) => (x.type === 'dir') === (y.type === 'dir') ? a.localeCompare(b) : x.type === 'dir' ? -1 : 1);

  const sizeOf = (node) => node.type === 'dir' ? 4096 : node.type === 'download' ? 48213 : new Blob([node.content]).size;

  const cmds = {
    help() {
      const w = Math.max(...s.help.map(([c]) => c.length)) + 3;
      s.help.forEach(([c, d]) => print([el('span', 't-accent', c.padEnd(w)), document.createTextNode(d)]));
    },

    ls(args) {
      const flags = args.filter((a) => a.startsWith('-')).join('');
      const target = args.find((a) => !a.startsWith('-')) ?? '';
      const node = getNode(resolve(target));
      if (!node) return print(s.noSuch('ls', target), 't-err');
      if (node.type !== 'dir') return print([nameSpan(target.split('/').pop(), node)]);
      const entries = visibleEntries(node, flags.includes('a'));
      if (flags.includes('a')) entries.unshift(['.', node], ['..', getNode(resolve(target + '/..'))]);
      if (flags.includes('l')) {
        print(`total ${entries.length}`);
        for (const [k, v] of entries) {
          const perm = v.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
          print([document.createTextNode(`${perm}  ${person.user} ${person.user}  ${String(sizeOf(v)).padStart(5)}  `), nameSpan(k, v)]);
        }
        return;
      }
      const row = [];
      entries.forEach(([k, v], i) => {
        row.push(nameSpan(k, v));
        if (i < entries.length - 1) row.push(document.createTextNode('   '));
      });
      if (row.length) print(row, 't-wrap');
    },

    cd(args) {
      const target = args[0] ?? '~';
      const segs = resolve(target);
      const node = getNode(segs);
      if (!node) return print(s.cdNoSuch(target), 't-err');
      if (node.type !== 'dir') return print(s.notDir(target), 't-err');
      cwd = segs;
    },

    pwd() { print('/' + cwd.join('/')); },

    cat(args) {
      if (!args.length) return print(s.missing('cat'), 't-err');
      for (const a of args) {
        const node = getNode(resolve(a));
        if (!node) print(s.noSuch('cat', a), 't-err');
        else if (node.type === 'dir') print(s.isDir('cat', a), 't-err');
        else if (node.type === 'download') print(s.binary(a.split('/').pop()), 't-muted');
        else printDoc(node.content);
      }
    },

    head(args) {
      let n = 10;
      const i = args.indexOf('-n');
      if (i !== -1) { n = parseInt(args[i + 1], 10) || 10; args.splice(i, 2); }
      const a = args[0];
      if (!a) return print(s.missing('head'), 't-err');
      const node = getNode(resolve(a));
      if (!node) return print(s.noSuch('head', a), 't-err');
      if (node.type === 'dir') return print(s.isDir('head', a), 't-err');
      if (node.type === 'download') return print(s.binary(a), 't-muted');
      printDoc(node.content.split('\n').slice(0, n).join('\n'));
    },

    tree(args) {
      const target = args[0] ?? '';
      const node = getNode(resolve(target));
      if (!node) return print(s.noSuch('tree', target), 't-err');
      if (node.type !== 'dir') return print([nameSpan(target, node)]);
      let dirs = 0;
      let files = 0;
      print([el('span', 't-dir', target || '.')]);
      const walk = (n, prefix) => {
        const entries = visibleEntries(n, false);
        entries.forEach(([k, v], i) => {
          const last = i === entries.length - 1;
          print([el('span', 't-muted', prefix + (last ? '└── ' : '├── ')), nameSpan(k, v)]);
          if (v.type === 'dir') { dirs++; walk(v, prefix + (last ? '    ' : '│   ')); }
          else files++;
        });
      };
      walk(node, '');
      print(` `);
      print(`${dirs} ${s.dirs}, ${files} ${s.files}`, 't-muted');
    },

    grep(args) {
      const ci = args.includes('-i');
      const rest = args.filter((a) => a !== '-i');
      const [pattern, target = ''] = rest;
      if (!pattern) return print(s.grepUsage, 't-err');
      const start = resolve(target);
      const node = getNode(start);
      if (!node) return print(s.noSuch('grep', target), 't-err');
      const needle = ci ? pattern.toLowerCase() : pattern;
      let hits = 0;
      const search = (n, segs) => {
        if (n.type === 'dir') {
          for (const [k, v] of visibleEntries(n, false)) search(v, [...segs, k]);
          return;
        }
        if (n.type !== 'file') return;
        for (const line of n.content.split('\n')) {
          const hay = ci ? line.toLowerCase() : line;
          const at = hay.indexOf(needle);
          if (at === -1) continue;
          hits++;
          const rel = pathString(segs).replace(/^~\//, '');
          print([
            el('span', 't-dl', rel),
            el('span', 't-muted', ':'),
            document.createTextNode(line.slice(0, at)),
            el('mark', 't-mark', line.slice(at, at + pattern.length)),
            document.createTextNode(line.slice(at + pattern.length)),
          ]);
        }
      };
      search(node, start);
      if (!hits) print(s.noMatches, 't-muted');
    },

    whoami() { printBlock(s.whoami); },

    neofetch() {
      const n = s.neo;
      const years = new Date().getFullYear() - person.since;
      const label = (k, v) => [el('span', 't-accent', k + ': '), document.createTextNode(v)];
      const info = [
        [el('span', 't-accent', `${person.user}@${person.host}`)],
        [el('span', 't-muted', '-'.repeat(person.user.length + person.host.length + 1))],
        label(n.os, 'Fran OS 2027 (x86_64 & arm64)'),
        label(n.host, lang === 'es' ? 'Sevilla, España' : 'Seville, Spain'),
        label(n.uptime, n.years(years)),
        label(n.shell, 'bash · node ' + (lang === 'es' ? 'y n8n' : 'and n8n')),
        label(n.degree, n.degreeVal),
        label(n.stack, 'Node.js, Astro, PostgreSQL, n8n'),
        label(n.infra, 'Raspberry Pi, Docker, Cloudflare Tunnel'),
        label(n.langs, n.langsVal),
        label(n.status, n.statusVal),
      ];
      const logo = el('img', 't-neo-logo');
      logo.src = '/froddes-logo.png';
      logo.alt = 'Froddes';
      const lines = el('div', 't-neo-info');
      info.forEach((parts) => {
        const row = el('div');
        row.append(...parts);
        lines.append(row);
      });
      const swatches = el('div', 't-neo-colors');
      ['#33d6dd', '#7ee7ec', '#f2f5f7', '#8a96a3', '#ff6b6b', '#ffd166'].forEach((c) => {
        const sw = el('span', 't-swatch');
        sw.style.background = c;
        swatches.append(sw);
      });
      lines.append(swatches);
      const block = el('div', 't-neo');
      block.append(logo, lines);
      out.append(block);
      logo.addEventListener('load', scroll);
    },

    open(args) {
      const target = (args[0] ?? '').toLowerCase();
      if (!target) return print(s.openUsage, 't-err');
      const project = projects.find((p) => p.slug === target || p.slug.startsWith(target));
      const map = { linkedin: links.linkedin, github: links.github, froddes: links.froddes, web: links.froddes, email: `mailto:${links.email}`, mail: `mailto:${links.email}`, cv: links.cv };
      let url = project?.url ?? map[target];
      if (!url && /^https?:\/\//.test(args[0])) url = args[0];
      if (!url) {
        const node = getNode(resolve(args[0]));
        if (node?.type === 'dir' && node.children['url.txt']) url = node.children['url.txt'].content.trim();
        else if (node?.type === 'file' && /^https?:\/\//.test(node.content.trim())) url = node.content.trim();
      }
      if (!url) return print(s.openUsage, 't-err');
      print(s.opening(url.replace(/^mailto:/, '')), 't-muted');
      if (url.startsWith('mailto:')) window.location.href = url;
      else window.open(url, '_blank', 'noopener');
    },

    download(args) {
      const target = (args[0] ?? 'cv').replace(/\.pdf$/, '');
      if (target !== 'cv') {
        const node = getNode(resolve(args[0]));
        if (node?.type !== 'download') return print(s.noSuch('download', args[0]), 't-err');
      }
      print(s.downloading('cv.pdf'), 't-muted');
      const a = document.createElement('a');
      a.href = links.cv;
      a.download = '';
      document.body.append(a);
      a.click();
      a.remove();
    },

    history() { history.forEach((h, i) => print(`${String(i + 1).padStart(4)}  ${h}`)); },

    clear() { out.replaceChildren(); },

    echo(args) { print(args.join(' ')); },

    date() { print(new Date().toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'full', timeStyle: 'medium' })); },

    lang(args) {
      const to = args[0];
      if (to === lang || (to !== 'es' && to !== 'en')) return print(lang === 'es' ? 'uso: lang en' : 'usage: lang es', 't-muted');
      print(s.langSwitch, 't-muted');
      setTimeout(() => { window.location.href = to === 'en' ? '/en/#terminal' : '/#terminal'; }, 400);
    },

    sudo() { print(s.sudo, 't-err'); },
    rm() { print(s.rm, 't-err'); },
    exit() { printBlock(s.exit, 't-muted'); },
    vim() { print(s.editor('vim'), 't-muted'); },
    nano() { print(s.editor('nano'), 't-muted'); },
  };

  const tokenize = (line) => (line.match(/"[^"]*"|'[^']*'|\S+/g) ?? []).map((x) => x.replace(/^["']|["']$/g, ''));

  const run = (raw, { silent = false } = {}) => {
    const line = raw.trim();
    if (!silent) echo(line);
    if (line) {
      history.push(line);
      histIdx = history.length;
      const [cmd, ...args] = tokenize(line);
      const fn = cmds[cmd.toLowerCase()];
      if (fn) fn(args);
      else print(s.notFound(cmd), 't-err');
    }
    renderPrompt();
    scroll();
  };

  const complete = () => {
    const value = input.value;
    const parts = value.split(/\s+/);
    const last = parts[parts.length - 1];
    let options;
    let base = '';
    if (parts.length === 1) {
      options = COMMANDS.filter((c) => c.startsWith(last));
    } else {
      const slash = last.lastIndexOf('/');
      base = slash === -1 ? '' : last.slice(0, slash + 1);
      const partial = last.slice(slash + 1);
      const node = getNode(resolve(base || '.'));
      if (!node || node.type !== 'dir') return;
      options = visibleEntries(node, partial.startsWith('.'))
        .filter(([k]) => k.startsWith(partial))
        .map(([k, v]) => k + (v.type === 'dir' ? '/' : ''));
    }
    if (!options.length) return;
    if (options.length === 1) {
      parts[parts.length - 1] = base + options[0] + (parts.length === 1 || !options[0].endsWith('/') ? ' ' : '');
      input.value = parts.join(' ');
      return;
    }
    const prefix = options.reduce((acc, o) => { let i = 0; while (i < acc.length && acc[i] === o[i]) i++; return acc.slice(0, i); });
    if (prefix.length > last.length - base.length) {
      parts[parts.length - 1] = base + prefix;
      input.value = parts.join(' ');
    } else {
      echo(value);
      print(options.join('   '), 't-wrap');
      scroll();
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); complete(); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
      else { histIdx = history.length; input.value = ''; }
    } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      cmds.clear();
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      echo(input.value + '^C');
      input.value = '';
      scroll();
    }
  });

  root.querySelector('[data-term-screen]').addEventListener('click', () => {
    if (!window.getSelection()?.toString()) input.focus({ preventScroll: true });
  });

  root.querySelectorAll('[data-cmd]').forEach((btn) =>
    btn.addEventListener('click', () => {
      run(btn.dataset.cmd);
      input.focus({ preventScroll: true });
    }),
  );

  const today = new Date().toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  printBlock(s.motd(today), 't-muted');
  print(' ');
  renderPrompt();
  run(lang === 'es' ? 'cat LEEME.txt' : 'cat README.txt');
  run('ls');
}
