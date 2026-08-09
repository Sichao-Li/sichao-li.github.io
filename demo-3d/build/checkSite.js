import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderSitemap } from "../../site/templates/renderMetadata.js";
import {
  contactTemplateMarkers,
  renderRoomPage,
  renderSiteDocument,
  renderSiteTokens,
  roomTemplateMarkers,
} from "../../site/templates/renderRoomPage.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const profileName = process.argv[2] || "sichao";
const releaseMode = process.argv.includes("--release");
const profileRoot = resolve(projectRoot, "profiles", profileName);
const profile = await import(pathToFileURL(resolve(profileRoot, "profile.js")));
const {
  deployedPublicAssets,
  galleryAssets,
  portfolioCategories,
  roomFigures,
  sections,
  siteConfig,
} = profile;
const sitemap = renderSitemap(profile);
const canonicalSiteUrl = siteConfig.siteUrl.replace(/\/$/, "");
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function assertNonEmpty(value, label) {
  assert(
    typeof value === "string" && value.trim().length > 0,
    `Missing site configuration: ${label}`,
  );
}

function assertWebUrl(value, label) {
  try {
    const url = new URL(value);
    assert(
      ["http:", "https:"].includes(url.protocol),
      `Invalid web URL for ${label}: ${value}`,
    );
  } catch {
    errors.push(`Invalid web URL for ${label}: ${value}`);
  }
}

function assertNoTemplateTokens(source, label) {
  assert(
    !source.match(/\{\{(?:page|site)\./),
    `Unresolved template token on ${label}`,
  );
}

function normalizeText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readPageSource(relativePath) {
  const pageMatch = relativePath.match(/^demo\/([^/]+)\/index\.html$/);
  const filePath = pageMatch
    ? resolve(profileRoot, "pages", pageMatch[1], "index.html")
    : resolve(projectRoot, relativePath);
  assert(existsSync(filePath), `Missing page: ${relativePath}`);
  return existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
}

function readPage(relativePath) {
  const source = readPageSource(relativePath);
  const pageId = relativePath.match(/^demo\/([^/]+)\/index\.html$/)?.[1];
  return renderRoomPage(source, { pageId, profile });
}

function listFiles(directory, root = directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = resolve(directory, entry.name);
    return entry.isDirectory()
      ? listFiles(filePath, root)
      : [relative(root, filePath)];
  });
}

function readSwitcherAnchors(html, pageName) {
  const switcher = html.match(
    /<nav aria-label="Academic categories">([\s\S]*?)<\/nav>/,
  )?.[1];
  assert(switcher, `Missing academic category switcher: ${pageName}`);
  if (!switcher) return [];

  return [...switcher.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/g)].map(
    ([, attributes, body]) => ({
      attributes,
      href: attributes.match(/href="([^"]+)"/)?.[1],
      text: normalizeText(body),
    }),
  );
}

const ids = sections.map(({ id }) => id);
const codes = sections.map(({ code }) => code);
const profileIds = siteConfig.profiles.map(({ id }) => id);
const categoryIds = portfolioCategories.map(({ id }) => id);
const categoryCodes = portfolioCategories.map(({ code }) => code);
const categoryPaths = portfolioCategories.map(({ path }) => path);
const sceneCategories = portfolioCategories.filter(
  ({ scene }) => scene !== false,
);
const sectionDepths = sections.map(({ z }) => z);

[
  "name",
  "role",
  "portfolioTitle",
  "tagline",
  "description",
  "institution",
  "location",
  "email",
  "siteUrl",
  "locale",
  "publicationStatus",
  "brandAsset",
  "roomBackgroundAsset",
  "socialImageAsset",
  "socialImageAlt",
].forEach((field) => assertNonEmpty(siteConfig[field], field));
assert(
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.email),
  `Invalid email address: ${siteConfig.email}`,
);
assertWebUrl(siteConfig.siteUrl, "siteUrl");
assert(
  Number.isInteger(siteConfig.socialImageWidth) &&
    siteConfig.socialImageWidth > 0,
  "socialImageWidth must be a positive integer",
);
assert(
  Number.isInteger(siteConfig.socialImageHeight) &&
    siteConfig.socialImageHeight > 0,
  "socialImageHeight must be a positive integer",
);
assert(
  ["public", "template", "draft"].includes(siteConfig.publicationStatus),
  `Invalid publicationStatus: ${siteConfig.publicationStatus}`,
);
assert(
  Array.isArray(siteConfig.additionalPublicAssets),
  "additionalPublicAssets must be an array",
);
siteConfig.profiles.forEach(({ href, id }) => assertWebUrl(href, id));
assert(
  [0, 3].includes(galleryAssets.characterFrames.length),
  "galleryAssets.characterFrames must be empty or contain three images",
);
assert(
  galleryAssets.researchCovers.length === 3,
  "galleryAssets.researchCovers must contain three images",
);
if (galleryAssets.homeNotebook) {
  assert(
    deployedPublicAssets.includes(galleryAssets.homeNotebook),
    "galleryAssets.homeNotebook must be included in deployedPublicAssets",
  );
}

assert(new Set(ids).size === ids.length, "Section IDs must be unique");
assert(new Set(codes).size === codes.length, "Section codes must be unique");
assert(
  new Set(sectionDepths).size === sectionDepths.length,
  "Section depths must be unique",
);
sections.slice(1).forEach((section, index) => {
  assert(
    section.z < sections[index].z,
    `Section depths must descend with navigation order: ${section.id}`,
  );
});
assert(
  new Set(profileIds).size === profileIds.length,
  "Profile IDs must be unique",
);
assert(
  new Set(categoryIds).size === categoryIds.length,
  "Category IDs must be unique",
);
assert(
  new Set(categoryCodes).size === categoryCodes.length,
  "Category codes must be unique",
);
assert(
  new Set(categoryPaths).size === categoryPaths.length,
  "Category paths must be unique",
);

assert(
  new Set(deployedPublicAssets).size === deployedPublicAssets.length,
  "Deployed public assets must be unique",
);
deployedPublicAssets.forEach((asset) => {
  assert(
    existsSync(resolve(projectRoot, "public", asset)),
    `Missing deployed public asset: ${asset}`,
  );
});

Object.entries(roomFigures).forEach(([pageId, figure]) => {
  assert(
    existsSync(resolve(projectRoot, "public", figure.asset)),
    `Missing room figure for ${pageId}: ${figure.asset}`,
  );
  assert(
    deployedPublicAssets.includes(figure.asset),
    `Room figure is not deployed for ${pageId}: ${figure.asset}`,
  );
});

sections.forEach((section) => {
  if (!section.entries?.length) {
    errors.push(`Section has no highlight entries: ${section.id}`);
  }

  if (!section.href?.startsWith("./")) return;
  const [route, hash] = section.href.slice(2).split("#");
  const relativePath = route.endsWith("/") ? `${route}index.html` : route;
  const html = readPage(relativePath);
  if (hash) {
    assert(
      html.includes(`id="${hash}"`),
      `Missing #${hash} target for section: ${section.id}`,
    );
  }
});

const sectionById = new Map(sections.map((section) => [section.id, section]));
sceneCategories.forEach((category) => {
  const section = sectionById.get(category.id);
  assert(section, `Missing 3D section for category: ${category.id}`);
  if (!section) return;

  assert(section.code === category.code, `Incorrect code for ${category.id}`);
  assert(
    section.label === category.label,
    `Incorrect label for ${category.id}`,
  );
  assert(
    section.accent === category.accent,
    `Incorrect accent for ${category.id}`,
  );
  assert(
    section.href === `./demo/${category.path}/`,
    `Incorrect 3D route for ${category.id}`,
  );
});

const roomPages = [
  ...portfolioCategories.map(({ id, path }) => ({ pageId: id, path })),
  { pageId: "contact", path: "contact" },
  { pageId: "cv", path: "cv" },
];
const allowedPageFiles = new Set(
  roomPages.map(({ path }) => `${path}${sep}index.html`),
);
listFiles(resolve(profileRoot, "pages")).forEach((filePath) => {
  assert(
    allowedPageFiles.has(filePath),
    `Unexpected file in profile pages: ${filePath}`,
  );
});

roomPages.forEach(({ pageId, path }) => {
  const relativePath = `demo/${path}/index.html`;
  const source = readPageSource(relativePath);
  roomTemplateMarkers.forEach((marker) => {
    assert(source.includes(marker), `Missing ${marker} on ${pageId}`);
  });

  const html = renderRoomPage(source, { pageId, profile });
  assertNoTemplateTokens(html, pageId);
  const canonicalUrl = `${canonicalSiteUrl}/demo/${path}/`;
  assert(
    html.includes(`rel="canonical" href="${canonicalUrl}"`),
    `Missing canonical URL on ${pageId}`,
  );
  assert(
    html.includes(`property="og:url" content="${canonicalUrl}"`),
    `Missing Open Graph URL on ${pageId}`,
  );
  assert(
    html.includes('name="twitter:card" content="summary_large_image"'),
    `Missing Twitter card metadata on ${pageId}`,
  );
  [...html.matchAll(/<a\b([^>]*)target="_blank"([^>]*)>/g)].forEach(
    ([, beforeTarget, afterTarget]) => {
      const attributes = `${beforeTarget}${afterTarget}`;
      assert(
        /rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(attributes),
        `External link is missing noopener/noreferrer on ${pageId}`,
      );
    },
  );
  if (roomFigures[pageId]) {
    assert(
      source.includes("{{page.figureAsset}}"),
      `Missing room figure slot on ${pageId}`,
    );
  }
  roomTemplateMarkers.forEach((marker) => {
    assert(!html.includes(marker), `Unrendered ${marker} on ${pageId}`);
  });
  const anchors = readSwitcherAnchors(html, pageId);

  portfolioCategories.forEach(({ id, label, code, path: categoryPath }) => {
    const expectedHref = `../${categoryPath}/`;
    const anchor = anchors.find(({ href }) => href === expectedHref);
    assert(anchor, `Missing ${label} switcher link on ${pageId}`);
    if (!anchor) return;

    assert(
      anchor.text === `${label} ${code}`,
      `Incorrect ${label} label/code on ${pageId}: "${anchor.text}"`,
    );
    assert(
      anchor.attributes.includes('aria-current="page"') === (id === pageId),
      `Incorrect current-page marker for ${label} on ${pageId}`,
    );
  });
});

roomPages.forEach(({ pageId, path }) => {
  assert(
    sitemap.includes(`<loc>${canonicalSiteUrl}/demo/${path}/</loc>`),
    `Missing sitemap entry: ${pageId}`,
  );
});

const appIndexSource = readPageSource("demo-3d/index.html");
assert(
  appIndexSource.includes("{{site.name}}"),
  "Root HTML must use site identity tokens",
);
const appIndex = renderSiteDocument(appIndexSource, profile);
assertNoTemplateTokens(appIndex, "root HTML");
assert(
  appIndex.includes(
    `<title>${siteConfig.name} | ${siteConfig.portfolioTitle}</title>`,
  ),
  "Root HTML title does not match site configuration",
);
assert(
  appIndex.includes(`rel="canonical" href="${canonicalSiteUrl}/"`),
  "Root HTML canonical URL does not match siteUrl",
);
assert(
  appIndex.includes('type="application/ld+json"'),
  "Root HTML is missing Person structured data",
);
assert(
  appIndex.includes('name="twitter:card" content="summary_large_image"'),
  "Root HTML is missing Twitter card metadata",
);
assert(
  /<noscript>[\s\S]*<main class="noscript-panel">[\s\S]*demo\/research\//.test(
    appIndex,
  ),
  "Root HTML is missing a usable no-JavaScript fallback",
);

const roomCssSource = readPageSource("demo/room.css");
assert(
  roomCssSource.includes("{{site.roomBackgroundAsset}}"),
  "Room CSS must use the configured background asset",
);
assertNoTemplateTokens(renderSiteTokens(roomCssSource, profile), "room CSS");

const contactPageSource = readPageSource("demo/contact/index.html");
contactTemplateMarkers.forEach((marker) => {
  assert(contactPageSource.includes(marker), `Missing ${marker} on contact`);
});

if (releaseMode) {
  assert(
    siteConfig.publicationStatus === "public",
    `Profile ${profileName} is not marked public`,
  );
  assert(
    !new URL(siteConfig.siteUrl).hostname.endsWith("example.com"),
    "Release siteUrl still uses example.com",
  );
  assert(
    !siteConfig.email.endsWith("@example.edu"),
    "Release email still uses the template address",
  );
}

if (errors.length) {
  console.error("Site integrity check failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Site integrity check passed for ${profileName} (${sections.length} sections, ${roomPages.length} room pages).`,
  );
}
