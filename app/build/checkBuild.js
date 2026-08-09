import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const outputDirectories = process.argv
  .slice(2)
  .map((directory) => resolve(projectRoot, directory));
const pagePaths = [
  "research",
  "news",
  "funding",
  "collaborators",
  "teaching",
  "service",
  "about",
  "contact",
  "cv",
];
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function listFiles(directory, root = directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = resolve(directory, entry.name);
    return entry.isDirectory()
      ? listFiles(filePath, root)
      : [relative(root, filePath)];
  });
}

function resolveLocalReference(htmlPath, reference, outputDirectory) {
  const cleanReference = reference.split(/[?#]/)[0];
  if (!cleanReference || cleanReference.startsWith("#")) return null;
  if (/^(?:[a-z]+:|\/\/)/i.test(cleanReference)) return null;

  const target = cleanReference.startsWith("/")
    ? resolve(outputDirectory, `.${cleanReference}`)
    : resolve(dirname(htmlPath), cleanReference);
  return extname(target) || !existsSync(target)
    ? target
    : resolve(target, "index.html");
}

function checkHtml(filePath, outputDirectory) {
  const html = readFileSync(filePath, "utf8");
  const label = relative(outputDirectory, filePath);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);

  assert(!/\{\{(?:page|site)\./.test(html), `Unresolved token: ${label}`);
  assert(new Set(ids).size === ids.length, `Duplicate id: ${label}`);
  assert(
    (html.match(/<main\b/g) ?? []).length === 1,
    `Expected one main: ${label}`,
  );
  assert(
    (html.match(/<h1\b/g) ?? []).length === 1,
    `Expected one h1: ${label}`,
  );

  for (const match of html.matchAll(/<a\b([^>]*)target="_blank"([^>]*)>/g)) {
    const attributes = `${match[1]}${match[2]}`;
    assert(
      /rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(attributes),
      `Unsafe external link: ${label}`,
    );
  }

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const target = resolveLocalReference(filePath, match[1], outputDirectory);
    if (target) {
      assert(
        existsSync(target),
        `Broken local reference in ${label}: ${match[1]}`,
      );
    }
  }
}

function checkOutput(outputDirectory) {
  const outputLabel = relative(projectRoot, outputDirectory);
  assert(existsSync(outputDirectory), `Missing build output: ${outputLabel}`);
  if (!existsSync(outputDirectory)) return;

  const files = listFiles(outputDirectory);
  assert(
    !files.some(
      (filePath) =>
        filePath.split(sep).some((part) => part.startsWith(".")) &&
        filePath !== ".nojekyll",
    ),
    `Unexpected hidden file in ${outputLabel}`,
  );

  const expectedDemoFiles = new Set([
    "room.css",
    "room.js",
    ...pagePaths.map((pagePath) => `${pagePath}${sep}index.html`),
  ]);
  listFiles(resolve(outputDirectory, "demo")).forEach((filePath) => {
    assert(
      expectedDemoFiles.has(filePath),
      `Unexpected published page file: ${outputLabel}/demo/${filePath}`,
    );
  });

  [
    "index.html",
    "sitemap.xml",
    "robots.txt",
    ".nojekyll",
    ...pagePaths.map((pagePath) => `demo/${pagePath}/index.html`),
  ].forEach((filePath) => {
    assert(
      existsSync(resolve(outputDirectory, filePath)),
      `Missing ${outputLabel}/${filePath}`,
    );
  });

  files
    .filter((filePath) => extname(filePath) === ".html")
    .forEach((filePath) =>
      checkHtml(resolve(outputDirectory, filePath), outputDirectory),
    );

  const rootHtml = readFileSync(resolve(outputDirectory, "index.html"), "utf8");
  assert(
    rootHtml.includes("<noscript>"),
    `Missing no-JavaScript fallback: ${outputLabel}`,
  );
  const collaboratorHtml = readFileSync(
    resolve(outputDirectory, "demo/collaborators/index.html"),
    "utf8",
  );
  assert(
    !/<a\b[^>]*class="institution-record"/.test(collaboratorHtml),
    `Institution records must not be links: ${outputLabel}`,
  );

  files
    .filter((filePath) => /^assets\/.*\.js$/.test(filePath))
    .forEach((filePath) => {
      const size = statSync(resolve(outputDirectory, filePath)).size;
      assert(
        size < 1_250_000,
        `JavaScript bundle exceeds 1.25 MB: ${filePath}`,
      );
    });
}

assert(outputDirectories.length > 0, "No build output directories supplied");
outputDirectories.forEach(checkOutput);

if (errors.length) {
  console.error("Build audit failed:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Build audit passed for ${outputDirectories.length} output directories.`,
  );
}
