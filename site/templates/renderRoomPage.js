import { pageUrl } from "./renderMetadata.js";

const ROOM_HEADER_MARKER = "<!-- @site-header -->";
const ROOM_SWITCHER_MARKER = "<!-- @site-switcher -->";
const ROOM_FOOTER_MARKER = "<!-- @site-footer -->";
const SITE_PROFILES_MARKER = "<!-- @site-profiles -->";
const SITE_STRUCTURED_DATA_MARKER = "<!-- @site-structured-data -->";

export const roomTemplateMarkers = Object.freeze([
  ROOM_HEADER_MARKER,
  ROOM_SWITCHER_MARKER,
  ROOM_FOOTER_MARKER,
]);

export const contactTemplateMarkers = Object.freeze([SITE_PROFILES_MARKER]);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderSiteTokens(html, { siteConfig }) {
  const siteUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const tokens = {
    "{{site.brandAsset}}": siteConfig.brandAsset,
    "{{site.cvHref}}": siteConfig.cvHref,
    "{{site.description}}": siteConfig.description,
    "{{site.email}}": siteConfig.email,
    "{{site.faculty}}": siteConfig.faculty,
    "{{site.institution}}": siteConfig.institution,
    "{{site.locale}}": siteConfig.locale,
    "{{site.location}}": siteConfig.location,
    "{{site.name}}": siteConfig.name,
    "{{site.portfolioTitle}}": siteConfig.portfolioTitle,
    "{{site.recognition}}": siteConfig.recognition,
    "{{site.role}}": siteConfig.role,
    "{{site.roomBackgroundAsset}}": siteConfig.roomBackgroundAsset,
    "{{site.school}}": siteConfig.school,
    "{{site.siteUrl}}": `${siteUrl}/`,
    "{{site.socialImageAlt}}": siteConfig.socialImageAlt,
    "{{site.socialImageHeight}}": siteConfig.socialImageHeight,
    "{{site.socialImageUrl}}": `${siteUrl}/public/${siteConfig.socialImageAsset}`,
    "{{site.socialImageWidth}}": siteConfig.socialImageWidth,
    "{{site.tagline}}": siteConfig.tagline,
  };

  return Object.entries(tokens).reduce(
    (output, [token, value]) => output.replaceAll(token, escapeHtml(value)),
    html,
  );
}

function renderStructuredData({ siteConfig }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: `${siteConfig.siteUrl.replace(/\/$/, "")}/`,
    jobTitle: siteConfig.role,
    email: `mailto:${siteConfig.email}`,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.institution,
    },
    sameAs: siteConfig.profiles.map(({ href }) => href),
  };
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

export function renderSiteDocument(html, profile) {
  const output = renderSiteTokens(html, profile);
  return output.replace(
    SITE_STRUCTURED_DATA_MARKER,
    renderStructuredData(profile),
  );
}

function renderPageTokens(html, pageId, profile) {
  const { categoryById, roomFigures, siteConfig } = profile;
  const figure = roomFigures[pageId];
  if (!figure) return html;

  const standalonePages = {
    contact: { code: "C08", label: "Contact" },
    cv: { code: "CV", label: "Curriculum Vitae" },
  };
  const page = categoryById[pageId] ?? standalonePages[pageId];
  const tokens = {
    "{{page.figureAlt}}": `Cartoon figure of ${siteConfig.name} ${figure.action}`,
    "{{page.figureAsset}}": figure.asset,
    "{{page.code}}": page.code,
    "{{page.label}}": page.label,
  };

  return Object.entries(tokens).reduce(
    (output, [token, value]) => output.replaceAll(token, escapeHtml(value)),
    html,
  );
}

function renderHeader(pageId, { siteConfig }) {
  const primaryLinks =
    pageId === "research"
      ? [{ href: "../about/", label: "About" }]
      : pageId === "about"
        ? [{ href: "../research/", label: "Research" }]
        : pageId === "cv"
          ? [{ href: "../about/", label: "About" }]
          : [
              { href: "../research/", label: "Research" },
              { href: "../about/", label: "About" },
            ];

  return `<header class="room-header">
  <a class="room-brand" href="../../" data-room-navigation>
    <img
      src="../../public/${escapeHtml(siteConfig.brandAsset)}"
      alt=""
      width="38"
      height="38"
    />
    <span>${escapeHtml(siteConfig.name)}</span>
  </a>
  <nav class="room-header-nav" aria-label="Room navigation">
    ${primaryLinks
      .map(
        ({ href, label }) =>
          `<a href="${href}" data-room-navigation>${label}</a>`,
      )
      .join("\n    ")}
    <a class="back-to-wing" href="../../" data-room-navigation>
      <span aria-hidden="true">&larr;</span> Home
    </a>
  </nav>
</header>`;
}

function renderProfiles({ siteConfig }) {
  const profiles = [
    {
      href: `mailto:${siteConfig.email}`,
      label: "Email",
      title: siteConfig.email,
      meta: siteConfig.institution,
    },
    ...siteConfig.profiles,
  ];
  const links = profiles
    .map(({ href, label, meta, title }) => {
      const external = href.startsWith("http");
      return `<a href="${escapeHtml(href)}"${
        external ? ' target="_blank" rel="noopener noreferrer"' : ""
      }>
  <span>${escapeHtml(label)}</span>
  <strong>${escapeHtml(title)}</strong>
  <small>${escapeHtml(meta)}</small>
</a>`;
    })
    .join("\n  ");

  return `<div class="research-work-list" aria-label="Contact and profile links">
  ${links}
</div>`;
}

function renderSwitcher(pageId, { portfolioCategories }) {
  const links = portfolioCategories
    .map((category) => {
      const current = category.id === pageId;
      const attributes = current
        ? 'aria-current="page"'
        : "data-room-navigation";
      return `<a href="../${category.path}/" ${attributes}><span>${escapeHtml(category.label)}</span><span>${escapeHtml(category.code)}</span></a>`;
    })
    .join("\n      ");

  return `<section class="room-switcher" aria-labelledby="room-switcher-title">
  <div class="room-switcher-shell">
    <p class="room-switcher-label" id="room-switcher-title">
      Academic portfolio
    </p>
    <nav aria-label="Academic categories">
      ${links}
    </nav>
  </div>
</section>`;
}

function renderFooter(pageId, { getCategory, siteConfig }) {
  const standaloneLabels = { contact: "Contact", cv: "Curriculum Vitae" };
  const label = standaloneLabels[pageId] ?? getCategory(pageId).label;
  return `<footer class="room-footer">
  <div class="room-footer-shell">
    <p>${escapeHtml(label)} / ${escapeHtml(siteConfig.name)}</p>
    <a href="mailto:${escapeHtml(siteConfig.email)}">${escapeHtml(siteConfig.email)}</a>
  </div>
</footer>`;
}

function renderPageMetadata(html, pageId, profile) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  const description = html.match(
    /<meta\s+name="description"\s+content="([^"]*)"\s*\/>/,
  )?.[1];
  if (!title || !description) return html;

  const canonical = escapeHtml(pageUrl(profile, pageId));
  const imageUrl = escapeHtml(
    `${profile.siteConfig.siteUrl.replace(/\/$/, "")}/public/${profile.siteConfig.socialImageAsset}`,
  );
  const metadata = `    <meta name="author" content="${escapeHtml(profile.siteConfig.name)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="profile" />
    <meta property="og:locale" content="${escapeHtml(profile.siteConfig.locale)}" />
    <meta property="og:site_name" content="${escapeHtml(profile.siteConfig.portfolioTitle)}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:alt" content="${escapeHtml(profile.siteConfig.socialImageAlt)}" />
    <meta property="og:image:width" content="${escapeHtml(profile.siteConfig.socialImageWidth)}" />
    <meta property="og:image:height" content="${escapeHtml(profile.siteConfig.socialImageHeight)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
`;
  return html.replace("  </head>", `${metadata}  </head>`);
}

export function renderRoomPage(html, { pageId, profile } = {}) {
  let output = renderSiteTokens(html, profile);
  output = renderPageTokens(output, pageId, profile);
  if (output.includes(SITE_PROFILES_MARKER)) {
    output = output.replace(SITE_PROFILES_MARKER, renderProfiles(profile));
  }
  if (!pageId) return output;

  if (output.includes(ROOM_HEADER_MARKER)) {
    output = output.replace(ROOM_HEADER_MARKER, renderHeader(pageId, profile));
  }
  if (output.includes(ROOM_SWITCHER_MARKER)) {
    output = output.replace(
      ROOM_SWITCHER_MARKER,
      renderSwitcher(pageId, profile),
    );
  }
  if (output.includes(ROOM_FOOTER_MARKER)) {
    output = output.replace(ROOM_FOOTER_MARKER, renderFooter(pageId, profile));
  }

  return renderPageMetadata(output, pageId, profile);
}
