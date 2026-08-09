# Reusable Academic Profile

This folder is the generic content profile for the shared portfolio engine. It
contains sample copy and generic gallery imagery, but no personal character or
likeness assets.

## Preview

From the repository root:

```bash
npm ci
npm run dev:template
```

Build the reusable version with `npm run build:template`. Its output is written
to `demo-3d/dist-template/` and is not deployed by the personal-site workflow.

## Customize

1. Replace the placeholder identity, affiliation, email, profile URLs, and
   canonical `siteUrl` in `config.js`.
2. Change `publicationStatus` from `template` to `public` only after every
   placeholder has been replaced.
3. Edit the concise home and gallery records in `sections.js`.
4. Replace the sample content in `pages/<category>/index.html`.
5. Add your images beneath `public/assets/` and update `galleryAssets`, optional
   `roomFigures`, and the three site-level asset fields in `config.js`.
6. Add a public PDF CV through `cvAsset` and `cvHref`, or keep the included web
   CV page.
7. Run `npm run check && npm run check:template-release && npm run build:template`.

## Content Files

| File or folder                   | Content                                      |
| -------------------------------- | -------------------------------------------- |
| `config.js`                      | Identity, routes, links, figures, and assets |
| `sections.js`                    | Text shown in the 3D gallery                 |
| `pages/about/index.html`         | Biography and profile overview               |
| `pages/research/index.html`      | Themes and selected work                     |
| `pages/news/index.html`          | Scrollable dated updates                     |
| `pages/funding/index.html`       | Awards, partnerships, and priorities         |
| `pages/collaborators/index.html` | Students and collaborators                   |
| `pages/teaching/index.html`      | Courses, supervision, and philosophy         |
| `pages/service/index.html`       | Academic and professional service            |
| `pages/contact/index.html`       | Contact-page introduction                    |
| `pages/cv/index.html`            | Web CV fallback                              |

## Required Page Slots

Each detailed page keeps these comments so the shared renderer can insert
consistent navigation and footer markup:

```html
<!-- @site-header -->
<!-- @site-switcher -->
<!-- @site-footer -->
```

The Contact page also keeps `<!-- @site-profiles -->`. Site identity uses
`{{site.*}}` tokens. To add page figures, define `roomFigures` and copy the
`room-character` figure slot from the personal profile pages.

## Assets

The starter intentionally omits a character. Add your own transparent images to
`roomFigures` and three compatible home frames to `galleryAssets.characterFrames`.
Keep full-body padding consistent so figures crop well across desktop and
mobile.

The MIT license covers the reusable code, starter copy, brand mark, and generic
gallery imagery. It excludes the personal profile, likeness assets, profile
images, and notebook cover used only by Sichao's profile.

Static assets declared by `brandAsset`, `roomBackgroundAsset`,
`socialImageAsset`, `cvAsset`, `galleryAssets`, `roomFigures`, and
`additionalPublicAssets` are copied automatically into the selected build.

## Categories

To add a category, update `portfolioCategories` and `sections`, create its page
folder, optionally add a `roomFigures` entry, and register a matching exhibit in
`demo-3d/src/GalleryScene.jsx`. The validation command reports missing routes,
assets, page slots, and 3D sections.
