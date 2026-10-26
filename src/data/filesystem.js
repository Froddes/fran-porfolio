import { links, person, projects, stack, homelab } from './profile.js';

const dir = (children) => ({ type: 'dir', children });
const file = (content) => ({ type: 'file', content: content.trim() + '\n' });
const download = (href) => ({ type: 'download', href });

const text = {
  es: {
    about: `
# ${person.name}

Estudiante de último curso de Ingeniería Informática – Tecnologías
Informáticas en la Universidad de Sevilla.

Desde ${person.since} desarrollo y despliego soluciones para clientes reales,
de la toma de requisitos al mantenimiento: frontend, backend con Node.js,
bases de datos, integración de APIs y modelos de lenguaje.

Mis proyectos corren en un servidor propio (ver ~/homelab).

Busco prácticas a partir de febrero de 2027.
Remoto, híbrido o presencial en Sevilla.
`,
    contact: `
email      ${links.email}
linkedin   ${links.linkedin}
github     ${links.github}
web        ${links.froddes}

Prueba:  open linkedin   ·   download cv
`,
    degree: `
# Grado en Ingeniería Informática – Tecnologías Informáticas
Universidad de Sevilla · 2020 – actualidad (último curso)

Asignaturas cercanas a lo que hago:
- Sistemas de Información Empresariales (Bonita BPM, Odoo, SuiteCRM)
- Planificación y Gestión de Proyectos Informáticos
- Seguridad en Sistemas Informáticos e Internet
`,
    thesis: `
# Trabajo Fin de Grado (en curso)
Dpto. de Ciencias de la Computación e Inteligencia Artificial

Parte de Cittawa (~/proyectos/cittawa) y añade una pieza de
ingeniería propia: un calendario y motor de disponibilidad con
feeds iCal que sustituya a Cal.com.
`,
    languages: `
español   nativo
inglés    intermedio
`,
    interests: `
- Motorsport, sobre todo F1 (de ahí Paddock Daily y Pitwall)
- Self-hosting y montar servicios en casa
- Automatizar todo lo que se repite más de dos veces
`,
    homelab: `
# Homelab

Raspberry Pi con Linux y Docker, gestionada con Portainer.
Expuesta con Cloudflare Tunnel: ningún puerto abierto en el router.
Los workflows de n8n se versionan con Git.

Ver los servicios:  cat ~/homelab/servicios.txt
`,
    services: homelab.services.map((s) => `${s.name.padEnd(12)}${s.es}`).join('\n') +
      `\n\nAPIs externas: ${homelab.external.join(', ')}`,
    project: (p) => `
# ${p.name}
${p.es.kind} · ${p.es.status}

${p.es.summary}

${p.es.points.map((x) => `- ${x}`).join('\n')}
`,
    readme: `
Hola. Esto es un sistema de archivos con todo sobre mí.

  ls            lista el directorio
  cd <dir>      entra en un directorio
  cat <fich>    muestra un fichero
  tree          estructura completa
  help          todos los comandos
`,
  },
  en: {
    about: `
# ${person.name}

Final-year Computer Engineering student at the University of Seville.

Since ${person.since} I’ve been building and shipping solutions for real
clients, from requirements to maintenance: frontend, Node.js backends,
databases, API and LLM integrations.

My projects run on my own server (see ~/homelab).

Looking for an internship from February 2027.
Remote, hybrid or on-site in Seville.
`,
    contact: `
email      ${links.email}
linkedin   ${links.linkedin}
github     ${links.github}
web        ${links.froddes}

Try:  open linkedin   ·   download cv
`,
    degree: `
# BSc Computer Engineering – Information Technologies
University of Seville · 2020 – present (final year)

Courses closest to what I do:
- Enterprise Information Systems (Bonita BPM, Odoo, SuiteCRM)
- IT Project Planning and Management
- Computer and Internet Security
`,
    thesis: `
# Final-year thesis (in progress)
Dept. of Computer Science and Artificial Intelligence

Builds on Cittawa (~/projects/cittawa) and adds a piece of my own
engineering: a calendar and availability engine with iCal feeds
to replace Cal.com.
`,
    languages: `
spanish   native
english   intermediate
`,
    interests: `
- Motorsport, F1 above all (hence Paddock Daily and Pitwall)
- Self-hosting and running services at home
- Automating anything I do more than twice
`,
    homelab: `
# Homelab

Raspberry Pi running Linux and Docker, managed with Portainer.
Exposed through Cloudflare Tunnel: no open ports on the router.
n8n workflows are versioned with Git.

See the services:  cat ~/homelab/services.txt
`,
    services: homelab.services.map((s) => `${s.name.padEnd(12)}${s.en}`).join('\n') +
      `\n\nExternal APIs: ${homelab.external.join(', ')}`,
    project: (p) => `
# ${p.name}
${p.en.kind} · ${p.en.status}

${p.en.summary}

${p.en.points.map((x) => `- ${x}`).join('\n')}
`,
    readme: `
Hi. This is a file system with everything about me.

  ls            list the directory
  cd <dir>      enter a directory
  cat <file>    print a file
  tree          full structure
  help          every command
`,
  },
};

const names = {
  es: { projects: 'proyectos', studies: 'estudios', degree: 'grado.md', thesis: 'tfg.md', languages: 'idiomas.txt', personal: 'personal', interests: 'intereses.txt', contact: 'contacto.txt', services: 'servicios.txt' },
  en: { projects: 'projects', studies: 'studies', degree: 'degree.md', thesis: 'thesis.md', languages: 'languages.txt', personal: 'personal', interests: 'interests.txt', contact: 'contact.txt', services: 'services.txt' },
};

export function buildFs(lang) {
  const t = text[lang];
  const n = names[lang];

  const projectDirs = Object.fromEntries(
    projects.map((p) => [
      p.slug,
      dir({
        'README.md': file(t.project(p)),
        'stack.txt': file(p.stack.join('\n')),
        'url.txt': file(p.url),
      }),
    ]),
  );

  const stackFiles = Object.fromEntries(
    stack.map((g) => [`${g.id}.txt`, file(`# ${g[lang]}\n\n${g.items.join('\n')}`)]),
  );

  return clean(dir({
    '.bashrc': file(`alias ll='ls -la'\nexport EDITOR=nvim\n# ${lang === 'es' ? 'si has llegado hasta aquí, hablemos' : 'if you made it here, let’s talk'}: ${links.email}`),
    'LEEME.txt': lang === 'es' ? file(t.readme) : undefined,
    'README.txt': lang === 'en' ? file(t.readme) : undefined,
    'about.md': file(t.about),
    [n.contact]: file(t.contact),
    'cv.pdf': download(links.cv),
    [n.projects]: dir(projectDirs),
    [n.studies]: dir({
      [n.degree]: file(t.degree),
      [n.thesis]: file(t.thesis),
      [n.languages]: file(t.languages),
    }),
    stack: dir(stackFiles),
    homelab: dir({
      'raspberry-pi.md': file(t.homelab),
      [n.services]: file(t.services),
    }),
    [n.personal]: dir({
      [n.interests]: file(t.interests),
    }),
  }));
}

function clean(node) {
  if (node.type !== 'dir') return node;
  const children = {};
  for (const [k, v] of Object.entries(node.children)) {
    if (v) children[k] = clean(v);
  }
  return { ...node, children };
}
