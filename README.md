# fran.froddes.com

Portfolio personal: proyectos, homelab, stack y un terminal con un sistema de archivos navegable.

**[fran.froddes.com](https://fran.froddes.com)** · Español por defecto, inglés en `/en/`.

## Stack

- [Astro](https://astro.build) en modo estático
- JavaScript sin dependencias para el terminal
- Inter y JetBrains Mono autoalojadas con Fontsource

## Estructura

```
src/
├── data/
│   ├── profile.js       contenido en es/en: proyectos, stack, homelab, textos
│   └── filesystem.js    sistema de archivos del terminal, generado a partir de profile.js
├── scripts/terminal.js  intérprete de comandos
├── components/          secciones de la página
└── pages/               / y /en/
public/cv/               CV descargable
```

Para cambiar contenido basta con editar `src/data/profile.js`: la web y el terminal se actualizan a la vez.

## Terminal

`help`, `ls [-a] [-l]`, `cd`, `pwd`, `cat`, `head [-n]`, `tree`, `grep [-i]`, `whoami`, `neofetch`, `open`, `download cv`, `history`, `lang`, `clear`… y alguno más.

Autocompletado con Tab, historial con ↑ ↓ y Ctrl+L para limpiar.
