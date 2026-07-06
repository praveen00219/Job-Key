/**
 * Static prerender for the public job pages (roadmap Decision #1).
 * Run after `vite build` + `vite build --ssr src/prerender.tsx --outDir dist-ssr`:
 * renders each /jobs/:slug route to static HTML inside the built index.html
 * shell and writes dist/jobs/<slug>/index.html. The SPA hydrates over it.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const template = readFileSync(resolve(root, "dist/index.html"), "utf-8");

const { render, getPrerenderRoutes } = await import(pathToFileURL(resolve(root, "dist-ssr/prerender.js")).href);

for (const route of getPrerenderRoutes()) {
  const appHtml = render(route.path);
  const html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${route.description}$2`);

  const outDir = resolve(root, "dist", route.path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  console.log(`prerendered ${route.path}`);
}
