# Sichao Li Academic Portfolio

This repository contains two content profiles powered by one React, Three.js,
and Vite website engine:

- `profiles/sichao/`: the personal site and default GitHub Pages build.
- `profiles/template/`: a generic starter profile for reuse.

The shared code lives in `demo-3d/`, `demo/`, and `site/`. Content changes do
not require editing the 3D scene implementation.

The personal profile is marked `public`; the starter is marked `template` so it
cannot pass the release check until its placeholder identity is replaced.

## Edit The Personal Site

Start with [`profiles/sichao/README.md`](./profiles/sichao/README.md).

- Edit identity, affiliations, profile links, and asset assignments in
  `profiles/sichao/config.js`.
- Edit the concise 3D-gallery text in `profiles/sichao/sections.js`.
- Edit detailed content in `profiles/sichao/pages/<category>/index.html`.
- Keep personal images in `public/assets/` and declare non-imported assets in
  the profile configuration.

## Preview Both Versions

Requirements: Node.js 20 or newer.

```bash
npm ci
npm run dev
```

The default command opens Sichao's site. To inspect the reusable starter:

```bash
npm run dev:template
```

Vite prints the local URL, normally <http://127.0.0.1:5173/>.

## Commands

| Command                    | Purpose                                         |
| -------------------------- | ----------------------------------------------- |
| `npm run dev`              | Run Sichao's site locally                       |
| `npm run dev:template`     | Run the reusable starter locally                |
| `npm run check`            | Validate formatting and both content profiles   |
| `npm run build`            | Build the personal site into `demo-3d/dist/`    |
| `npm run build:template`   | Build the starter into `demo-3d/dist-template/` |
| `npm run build:all`        | Build both profiles                             |
| `npm run check:release`    | Validate the personal profile for publication   |
| `npm run preview`          | Preview the personal production build           |
| `npm run preview:template` | Preview the starter production build            |

## Project Structure

```text
profiles/
  sichao/                    Personal identity, gallery copy, and pages
  template/                  Generic starter profile and reuse guide
site/templates/              Shared static-page and metadata renderers
site/config/                 Shared profile configuration utilities
demo-3d/src/                 Shared React and Three.js gallery
demo-3d/build/               Profile-aware Vite integration and checks
demo/                        Shared detailed-page CSS and navigation behavior
public/assets/               Personal and sample visual assets
```

## Deployment

The GitHub Actions workflow checks both profiles and deploys only the personal
build in `demo-3d/dist/`. Set `siteUrl` in `profiles/sichao/config.js`, choose
**GitHub Actions** as the repository's Pages source, and push to `main`.

The production output is static HTML, CSS, JavaScript, and images. GitHub Pages
supports the complete 3D version without a server-side runtime.

The workflow validates both profiles, performs the stricter personal release
check, builds both variants, and uploads only `demo-3d/dist/`. Production builds
also include `sitemap.xml`, `robots.txt`, and `.nojekyll`.

## Public Release Checklist

1. Confirm `siteUrl`, email, affiliation, and profile links in
   `profiles/sichao/config.js`.
2. Add a redacted public PDF CV and update `cvAsset` and `cvHref`, or retain the
   web CV fallback.
3. Review dated news, funding claims, service records, and publication links.
4. Run `npm run check && npm run check:release && npm run build:all`.
5. Preview the production build with `npm run preview`.
6. In GitHub, select **Settings > Pages > Source > GitHub Actions**, then push
   `main`.

## Licensing

The source code, reusable template content, brand mark, and generic gallery
imagery use the MIT License. Sichao Li's personal content, likeness, profile
images, and notebook cover are excluded from reuse; see `LICENSE`.
