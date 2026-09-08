import { resolve, sep } from "node:path";
import { watch } from "node:fs";
import { compile } from "sass";

const [project, mode = "dev"] = process.argv.slice(2);
if (!["game-client", "cardMaker"].includes(project) || !["dev", "build"].includes(mode)) {
  throw new Error("Usage: bun scripts/frontend.ts <game-client|cardMaker> <dev|build>");
}
const root = resolve(import.meta.dir, "..", project);
const outdir = resolve(root, "dist");
async function build() {
  const result = await Bun.build({
    entrypoints: [resolve(root, "index.html")],
    outdir,
    target: "browser",
    minify: mode === "build",
    sourcemap: "linked",
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode === "build" ? "production" : "development"),
    },
    jsx: { runtime: "classic", factory: project === "game-client" ? "h" : "React.createElement" },
    ...(project === "game-client"
      ? { alias: { react: "preact-compat", "react-dom": "preact-compat" } }
      : {}),
    plugins: [
      {
        name: "sass",
        setup(builder) {
          builder.onLoad({ filter: /\.s[ac]ss$/ }, ({ path }) => ({
            contents: compile(path, {
              loadPaths: [resolve(root, "node_modules"), resolve(root, "../node_modules")],
              quietDeps: true,
            }).css,
            loader: "css",
            resolveDir: root,
          }));
        },
      },
    ],
  });
  if (!result.success) {
    throw new AggregateError(result.logs, "Frontend build failed");
  }
  console.log(`Built ${project}`);
}
await build();
if (mode === "dev") {
  const port = Number(process.env.PORT || (project === "game-client" ? 1234 : 3000));
  Bun.serve({
    port,
    async fetch(request) {
      const pathname = decodeURIComponent(new URL(request.url).pathname);
      const path = resolve(outdir, "." + pathname);
      if (path !== outdir && !path.startsWith(outdir + sep)) {
        return new Response("Not found", { status: 404 });
      }
      const file = Bun.file(pathname === "/" ? resolve(outdir, "index.html") : path);
      if (!(await file.exists())) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(file, { headers: { "Cache-Control": "no-store" } });
    },
  });
  let timer: ReturnType<typeof setTimeout>;
  let building = false,
    dirty = false;
  const rebuild = async () => {
    if (building) {
      dirty = true;
      return;
    }
    building = true;
    do {
      dirty = false;
      try {
        await build();
      } catch (error) {
        console.error(error);
      }
    } while (dirty);
    building = false;
  };
  watch(root, { recursive: true }, (_, filename) => {
    if (!filename || /^(dist|node_modules)(\/|\\)/.test(filename)) {
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(rebuild, 100);
  });
  console.log(`http://localhost:${port} — source changes rebuild; refresh your browser`);
}
