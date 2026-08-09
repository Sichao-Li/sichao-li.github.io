function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function absoluteUrl(siteConfig, path = "") {
  return `${siteConfig.siteUrl.replace(/\/$/, "")}/${path}`;
}

export function pageUrl({ categoryById, siteConfig }, pageId) {
  const path = categoryById[pageId]?.path ?? pageId;
  return absoluteUrl(siteConfig, `demo/${path}/`);
}

export function renderSitemap({ portfolioCategories, siteConfig }) {
  const urls = [
    absoluteUrl(siteConfig),
    ...portfolioCategories.map(({ path }) =>
      absoluteUrl(siteConfig, `demo/${path}/`),
    ),
    absoluteUrl(siteConfig, "demo/contact/"),
    absoluteUrl(siteConfig, "demo/cv/"),
  ];

  const entries = urls
    .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

export function renderRobots({ siteConfig }) {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl(siteConfig, "sitemap.xml")}
`;
}
