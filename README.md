# Profile Website

A single-page personal portfolio built with **React + Vite** and plain CSS (CSS variables, no UI framework).

## Sections

- Hero / intro
- About + quick facts
- Skills grid
- Projects grid
- Contact form (mailto) + socials
- Sticky navbar with dark/light theme toggle (preference saved to `localStorage`)
- Mobile-responsive (collapsible nav)

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Customising your content

All copy lives in one file: [src/data/profile.js](src/data/profile.js).

Edit the `profile` object to change your name, title, bio, skills, projects, socials, and contact email. The components read from it, so you do not need to touch JSX for content changes.

## File map

- [index.html](index.html) — Vite entry HTML
- [src/main.jsx](src/main.jsx) — React bootstrap
- [src/App.jsx](src/App.jsx) — page composition + theme state
- [src/data/profile.js](src/data/profile.js) — **edit this** for your content
- [src/components/](src/components/) — Navbar, Hero, About, Skills, Projects, Contact, Footer
- [src/styles/index.css](src/styles/index.css) — all styles (CSS variables, theme tokens, layout, components, responsive)

## Note

The original `app.js` and `style.css` (a Tic-Tac-Toe demo) are no longer referenced by the new `index.html`. You can safely delete them.
