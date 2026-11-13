/**
 * Rebuilds the preview from a local checkout of the WP Table Builder monorepo.
 *
 *   pnpm build              build the free + Pro editors, then copy them here
 *   pnpm build --skip-build copy whatever is already in the monorepo's dist/ folders
 *
 * The monorepo path is asked for on the first run and saved in `.dir`.
 * Delete that file (or edit it) to point at a different checkout.
 *
 * What it writes:
 *   dist/                <- apps/wp-table-builder/dist
 *   pro/                 <- apps/wp-table-builder-pro/dist
 *   assets/              <- apps/wp-table-builder/assets (upsell patterns replaced
 *                           by the Pro patterns in assets/patterns/pro, no .php files)
 *   demo/patterns.json   <- the template list, as the plugin's REST API returns it with Pro active
 *   index.html           <- regenerated with the current hashed file names
 *   demo/boot.js         <- only the `version` string is updated
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR_FILE = join(ROOT, ".dir");
const skipBuild = process.argv.includes("--skip-build");

type ManifestChunk = { file: string; src?: string; isEntry?: boolean; imports?: string[] };
type Manifest = Record<string, ManifestChunk>;

const log = (msg: string) => console.log(`\x1b[36m›\x1b[0m ${msg}`);
const fail = (msg: string): never => {
  console.error(`\x1b[31m✗\x1b[0m ${msg}`);
  process.exit(1);
};

const expandHome = (p: string) => (p === "~" || p.startsWith("~/") ? join(homedir(), p.slice(1)) : p);
const isMonorepo = (dir: string) =>
  existsSync(join(dir, "apps/wp-table-builder")) && existsSync(join(dir, "apps/wp-table-builder-pro"));

async function sourceDir(): Promise<string> {
  if (existsSync(DIR_FILE)) {
    const saved = readFileSync(DIR_FILE, "utf8").trim();
    if (!isMonorepo(saved)) fail(`${saved} (from .dir) is not the WP Table Builder monorepo. Fix or delete .dir.`);
    return saved;
  }
  if (!process.stdin.isTTY) fail("No .dir file and no terminal to ask in. Write the monorepo path into .dir.");

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    for (;;) {
      const answer = (await rl.question("Path to the wp-table-builder monorepo: ")).trim();
      if (!answer) continue;
      const dir = resolve(expandHome(answer));
      if (isMonorepo(dir)) {
        writeFileSync(DIR_FILE, dir + "\n");
        log(`Saved to .dir`);
        return dir;
      }
      console.log(`  ${dir} has no apps/wp-table-builder and apps/wp-table-builder-pro. Try again.`);
    }
  } finally {
    rl.close();
  }
}

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8")) as T;

function entry(manifest: Manifest, src: string, where: string): ManifestChunk {
  const chunk = manifest[src];
  if (!chunk) fail(`${where} manifest has no entry for ${src}`);
  return chunk;
}

/** Every chunk an entry pulls in, directly or not, as output file paths. */
function preloads(manifest: Manifest, srcs: string[]): string[] {
  const seen = new Set<string>();
  const walk = (key: string) => {
    for (const dep of manifest[key]?.imports ?? []) {
      if (seen.has(dep)) continue;
      seen.add(dep);
      walk(dep);
    }
  };
  srcs.forEach(walk);
  return [...seen].map((k) => manifest[k].file).sort();
}

/** Mirrors TableGet::patterns (free dir) + WPTableBuilderPro::patterns (pro dir); PHP scandir sorts by bytes. */
function patternList(...dirs: string[]) {
  return dirs.flatMap((dir) =>
    readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map((f) => {
        const p = readJson<{ title: string; height: number; width: number }>(join(dir, f));
        return { name: basename(f, ".json"), title: p.title, height: p.height, width: p.width };
      }),
  );
}

function indexHtml(css: string[], preload: string[], scripts: string[]): string {
  const lines = [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="robots" content="noindex">',
    "<title>WP Table Builder editor preview</title>",
    ...css.map((href) => `<link rel="stylesheet" href="${href}">`),
    ...preload.map((href) => `<link rel="modulepreload" href="${href}">`),
    "<style>",
    "  html, body { margin: 0; min-height: 100%; background: #f0f0f1; }",
    "  #wpcontent { position: relative; padding: 0 20px; }",
    "</style>",
    "</head>",
    "<body>",
    "<noscript>This preview needs JavaScript.</noscript>",
    '<div id="wpcontent"><div id="wptb-app-root" class="wptb-app-root"></div></div>',
    '<script src="demo/boot.js"></script>',
    ...scripts.map((src) => `<script type="module" src="${src}"></script>`),
    "</body>",
    "</html>",
  ];
  return lines.join("\n") + "\n";
}

async function main() {
  const src = await sourceDir();
  const free = join(src, "apps/wp-table-builder");
  const pro = join(src, "apps/wp-table-builder-pro");

  if (skipBuild) {
    log("Skipping the monorepo build (--skip-build)");
  } else {
    log(`Building free + Pro in ${src}`);
    execSync("pnpm build2", { cwd: src, stdio: "inherit" });
  }

  const freeManifestPath = join(free, "dist/vite/manifest.json");
  const proManifestPath = join(pro, "dist/vite/manifest.json");
  for (const p of [freeManifestPath, proManifestPath]) {
    if (!existsSync(p)) fail(`${p} is missing. Run without --skip-build.`);
  }
  const freeManifest = readJson<Manifest>(freeManifestPath);
  const proManifest = readJson<Manifest>(proManifestPath);

  log("Copying dist/ and pro/");
  for (const [from, to] of [
    [join(free, "dist"), join(ROOT, "dist")],
    [join(pro, "dist"), join(ROOT, "pro")],
  ]) {
    rmSync(to, { recursive: true, force: true });
    cpSync(from, to, { recursive: true });
  }

  log("Copying assets/ (Pro patterns in place of upsells)");
  const assetsOut = join(ROOT, "assets");
  rmSync(assetsOut, { recursive: true, force: true });
  const upsells = join(free, "assets/patterns/upsells");
  cpSync(join(free, "assets"), assetsOut, {
    recursive: true,
    filter: (p) => p !== upsells && !p.startsWith(upsells + "/") && !p.endsWith(".php"),
  });
  cpSync(join(pro, "assets/patterns"), join(assetsOut, "patterns/pro"), {
    recursive: true,
    filter: (p) => !p.endsWith(".php"),
  });

  log("Writing demo/patterns.json");
  const patterns = patternList(join(assetsOut, "patterns/free"), join(assetsOut, "patterns/pro"));
  writeFileSync(join(ROOT, "demo/patterns.json"), JSON.stringify({ patterns }) + "\n");

  log("Writing index.html");
  const freeEntries = ["src/editor-common.ts", "src/index.tsx"];
  const proEntries = ["src/index.tsx"];
  const html = indexHtml(
    [
      "dist/" + entry(freeManifest, "src/editor.scss", "Free").file,
      "dist/" + entry(freeManifest, "src/styles.scss", "Free").file,
      "pro/" + entry(proManifest, "src/ai/style.scss", "Pro").file,
    ],
    [
      ...preloads(freeManifest, freeEntries).map((f) => "dist/" + f),
      ...preloads(proManifest, proEntries).map((f) => "pro/" + f),
    ],
    [
      // Order matters: editor-common sets up globals, Pro registers its hooks, then the editor mounts.
      "dist/" + entry(freeManifest, "src/editor-common.ts", "Free").file,
      "pro/" + entry(proManifest, "src/index.tsx", "Pro").file,
      "dist/" + entry(freeManifest, "src/index.tsx", "Free").file,
    ],
  );
  writeFileSync(join(ROOT, "index.html"), html);

  const version = readFileSync(join(free, "wp-table-builder.php"), "utf8").match(/^\s*\*\s*Version:\s*(\S+)/m)?.[1];
  if (version) {
    const bootPath = join(ROOT, "demo/boot.js");
    const boot = readFileSync(bootPath, "utf8");
    const updated = boot.replace(/(\bversion:\s*")[^"]*(")/, `$1${version}$2`);
    if (updated !== boot) {
      writeFileSync(bootPath, updated);
      log(`Set version ${version} in demo/boot.js`);
    }
  }

  log("Done. Review with `git status` / `git diff`.");
}

main().catch((err: unknown) => fail(err instanceof Error ? err.message : String(err)));
