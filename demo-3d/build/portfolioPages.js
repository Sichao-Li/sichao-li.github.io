import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, resolve, sep } from "node:path";
import {
  renderRobots,
  renderSitemap,
} from "../../site/templates/renderMetadata.js";
import {
  renderRoomPage,
  renderSiteDocument,
  renderSiteTokens,
} from "../../site/templates/renderRoomPage.js";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function resolveRequest(pathname, route) {
  const relativePath = pathname.slice(route.prefix.length) || "/";
  let filePath = resolve(route.source, `.${relativePath}`);
  if (
    filePath !== route.source &&
    !filePath.startsWith(`${route.source}${sep}`)
  ) {
    return null;
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = resolve(filePath, "index.html");
  }
  return existsSync(filePath) && statSync(filePath).isFile() ? filePath : null;
}

function getRoomPageId(filePath, pagesRoot) {
  const relativePath = filePath.slice(pagesRoot.length + 1).split(sep);
  return relativePath.length === 2 && relativePath[1] === "index.html"
    ? relativePath[0]
    : undefined;
}

function renderSourceFile(filePath, pagesRoot, profile) {
  const source = readFileSync(filePath, "utf8");
  return extname(filePath) === ".html"
    ? renderRoomPage(source, {
        pageId: getRoomPageId(filePath, pagesRoot),
        profile,
      })
    : renderSiteTokens(source, profile);
}

function renderPagesDirectory(directory, pagesRoot, profile) {
  readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const filePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      renderPagesDirectory(filePath, pagesRoot, profile);
    } else if (
      entry.isFile() &&
      [".css", ".html"].includes(extname(entry.name))
    ) {
      writeFileSync(filePath, renderSourceFile(filePath, pagesRoot, profile));
    }
  });
}

export function profileSitePages({
  outputDirectory,
  profile,
  profileRoot,
  projectRoot,
}) {
  const pagesSource = resolve(profileRoot, "pages");
  const sharedPagesSource = resolve(projectRoot, "demo");
  const publicSource = resolve(projectRoot, "public");
  const sharedPageAssets = new Map([
    ["/demo/room.css", resolve(sharedPagesSource, "room.css")],
    ["/demo/room.js", resolve(sharedPagesSource, "room.js")],
  ]);
  const staticRoutes = [
    { prefix: "/demo", source: pagesSource },
    { prefix: "/public", source: publicSource },
  ];

  return {
    name: "profile-site-pages",
    transformIndexHtml(html) {
      return renderSiteDocument(html, profile);
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent(request.url.split("?")[0]);
        if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
          response.statusCode = 200;
          response.setHeader(
            "Content-Type",
            pathname === "/sitemap.xml"
              ? "application/xml; charset=utf-8"
              : "text/plain; charset=utf-8",
          );
          response.end(
            pathname === "/sitemap.xml"
              ? renderSitemap(profile)
              : renderRobots(profile),
          );
          return;
        }

        const sharedPageAsset = sharedPageAssets.get(pathname);
        if (sharedPageAsset) {
          response.statusCode = 200;
          response.setHeader(
            "Content-Type",
            contentTypes[extname(sharedPageAsset)],
          );
          response.end(
            extname(sharedPageAsset) === ".css"
              ? renderSiteTokens(readFileSync(sharedPageAsset, "utf8"), profile)
              : readFileSync(sharedPageAsset),
          );
          return;
        }

        const route = staticRoutes.find(
          ({ prefix }) =>
            pathname === prefix || pathname.startsWith(`${prefix}/`),
        );
        if (!route) return next();

        const filePath = resolveRequest(pathname, route);
        if (!filePath) return next();

        response.statusCode = 200;
        response.setHeader(
          "Content-Type",
          contentTypes[extname(filePath)] || "application/octet-stream",
        );
        if (
          [".css", ".html"].includes(extname(filePath)) &&
          route.source === pagesSource
        ) {
          response.end(renderSourceFile(filePath, pagesSource, profile));
          return;
        }

        response.end(readFileSync(filePath));
      });
    },
    closeBundle() {
      const output = resolve(projectRoot, "demo-3d", outputDirectory);
      const pagesOutput = resolve(output, "demo");
      cpSync(pagesSource, pagesOutput, { recursive: true });
      cpSync(
        resolve(sharedPagesSource, "room.css"),
        resolve(pagesOutput, "room.css"),
      );
      cpSync(
        resolve(sharedPagesSource, "room.js"),
        resolve(pagesOutput, "room.js"),
      );
      renderPagesDirectory(pagesOutput, pagesOutput, profile);
      writeFileSync(resolve(output, "sitemap.xml"), renderSitemap(profile));
      writeFileSync(resolve(output, "robots.txt"), renderRobots(profile));
      writeFileSync(resolve(output, ".nojekyll"), "");

      profile.deployedPublicAssets.forEach((relativePath) => {
        const destination = resolve(output, "public", relativePath);
        mkdirSync(dirname(destination), { recursive: true });
        cpSync(resolve(publicSource, relativePath), destination);
      });
    },
  };
}
