# Sichao Li Academic Portfolio

Source for [sichao-li.github.io](https://sichao-li.github.io), an interactive
academic portfolio built with React, Three.js, and Vite.

This repository contains one personal content profile and one deployable site.
The reusable starter is maintained separately in the
`academic-portfolio-template` repository.

## Edit Content

- Edit identity, affiliations, profile links, and asset assignments in
  `profile/config.js`.
- Edit concise text shown in the 3D gallery in `profile/sections.js`.
- Edit detailed pages in `profile/pages/<category>/index.html`.
- Add declared images beneath `public/assets/`.

The detailed pages use `{{site.*}}` tokens and renderer markers. Keep the
existing `<!-- @site-* -->` comments when editing page HTML.

## Run Locally

Requirements: Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Vite prints the local URL, normally <http://127.0.0.1:5173/>.

## Commands

| Command                 | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Start the local development site        |
| `npm run check`         | Validate formatting, routes, and assets |
| `npm run check:release` | Validate public identity and metadata   |
| `npm run build`         | Build and audit the production site     |
| `npm run preview`       | Preview the production build locally    |

## Structure

```text
app/                      React, Three.js, Vite, and build tools
profile/                  Personal identity, gallery copy, and pages
site/                     Renderers, configuration, and room-page assets
public/assets/            Declared visual assets
.github/workflows/        GitHub Pages deployment
```

## Deployment

Pushes to `main` run validation, build the static site into `app/dist/`, and
deploy it through GitHub Pages. The complete 3D site runs without a server-side
runtime.

Before publishing content changes, run:

```bash
npm run check
npm run check:release
npm run build
```

## Licensing

The source code uses the MIT License. Personal content, likeness assets, and
institutional marks have separate restrictions described in
[`ASSET-LICENSE.md`](./ASSET-LICENSE.md).

## Acknowledgements

The interactive portfolio direction was inspired by
[ITom's portfolio](https://itomdev.com/). This project uses an original
implementation and content structure adapted for an academic profile. Generated
character and gallery assets were created with ChatGPT and then integrated and
optimised for the site.
