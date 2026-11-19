# NEXORA Ultimate Edition

NEXORA is a local-first futuristic digital universe prototype built with React, TypeScript, Vite, Three.js, Dexie/IndexedDB, Zustand, and Framer Motion.

## Requirements
- Node.js 20 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## GitHub Pages deployment
1. Create a GitHub repository and upload this project.
2. In GitHub, open **Settings → Pages** and choose **GitHub Actions** as the build/deployment source.
3. Add the workflow below at `.github/workflows/deploy.yml`.
4. For a project URL such as `https://username.github.io/repository/`, set `VITE_BASE` to `/repository/` in the workflow.
5. For a custom domain pointed to the GitHub Pages site, use root base `/` and configure the domain in **Settings → Pages**. Add the required DNS records at your domain provider and enable HTTPS after DNS verification.

## Local-first data
- Small preferences and progress: `localStorage`.
- Structured collections: IndexedDB through Dexie.
- Backup/restore: JSON file through Settings.
- No remote database or application backend is configured.

Important: browser-local data is device/browser-specific. Clearing browser data, using private browsing, or changing devices can make it unavailable. Export backups regularly.

## Current prototype scope
Implemented: cinematic intro, responsive dashboard shell, theme switch, local profile name, XP/level progress, mission claiming, IndexedDB artifact archive, backup/restore, NOVA local guide, basic 3D planet scene.

Planned next: richer planet environments, artifact discovery gameplay, personal-space editor, offline service worker/PWA, additional mini-apps, accessibility and performance pass.

## Notes
- The Google Fonts import is optional network content. For a fully offline visual experience, bundle local font files or remove the import.
- Three-dimensional scene is interactive (orbit controls) but is currently a visual prototype, not a full character-based game.
- Never store passwords or sensitive secrets in localStorage/IndexedDB. Local-only profile names are not secure authentication.
