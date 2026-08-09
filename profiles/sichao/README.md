# Editing Sichao's Live Site

This profile is the default development and production build.

## Content Map

- `config.js`: name, appointment, affiliation, location, public metadata,
  social profiles, routes, category labels, and asset assignments.
- `sections.js`: concise copy shown in the 3D gallery.
- `pages/about/index.html`: biography and academic profile.
- `pages/research/index.html`: research themes and selected publications.
- `pages/news/index.html`: dated updates in the scrollable notebook.
- `pages/funding/index.html`: applications, grants, credits, and travel support.
- `pages/collaborators/index.html`: students and other collaborators.
- `pages/teaching/index.html`: teaching portfolio and supervision.
- `pages/service/index.html`: academic and professional service.
- `pages/contact/index.html`: contact-page introduction; profile links come from
  `config.js`.
- `pages/cv/index.html`: web CV fallback. Set `cvAsset` and `cvHref` in
  `config.js` when a public PDF is ready.

## Preview

```bash
npm run dev
```

Open <http://127.0.0.1:5173/>. Run `npm run check` before deployment; it checks
both this profile and the reusable starter profile.

## Publish

Before pushing `main`, run:

```bash
npm run check
npm run check:release
npm run build:all
npm run preview
```

`publicationStatus` must remain `public`, and `siteUrl` must match the GitHub
Pages or custom-domain URL. The build generates canonical and social metadata,
Person structured data, `sitemap.xml`, `robots.txt`, and `.nojekyll`.

The About page currently uses the web CV fallback. Publish only a redacted PDF
that excludes private phone numbers, addresses, and referee details. Place that
file under `public/assets/`, declare it in `cvAsset`, and point `cvHref` to the
deployed PDF path.
