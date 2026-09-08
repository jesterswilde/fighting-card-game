# Fighting card game

Use **Bun 1.4.2 or newer** for installs, the server, browser builds, scripts, and tests. Install Bun from [bun.sh](https://bun.sh), then run from the repository root:

```sh
bun install --frozen-lockfile
bun run check
```

The root is a Bun workspace containing `game-client` and `cardMaker`. `bun.lock` is the single dependency lockfile. No global Parcel, Jest, nodemon, or TypeScript installation is needed.

## Development

Run these in separate terminals:

```sh
bun run dev          # Server, reloads source changes; port 8080
bun run dev:client   # Game client; port 1234
bun run dev:cards    # Card maker; port 3000
```

The browser builds use Bun's bundler plus Sass for the existing stylesheets. Source changes rebuild automatically; refresh the browser to see them. Set `PORT` to change a development server's port. Both browser applications currently call the game API at `http://localhost:8080`.

The server requires PostgreSQL. Existing local defaults are database `fight` on localhost with username `postgres` and password `password`; `DATABASE_URL` overrides them. Startup connects to the database before listening. The existing TypeORM schema synchronization remains enabled, so use a development database. HTTP smoke tests construct the app separately and never connect to PostgreSQL.

## Build and run

```sh
bun run build       # Builds both browser apps into their dist directories
bun start           # Runs server/index.ts directly; serves the built game client
```

Generated browser bundles are ignored by Git. There is no `serverBuild` compilation step. Auxiliary JavaScript scripts also run with Bun, e.g. `bun getCardNames.js`.

## TypeScript and tests

`bun run typecheck` checks the server, tooling, AI/tests, game client (including TSX), and card maker. Bun executes TypeScript directly; the separate TypeScript compiler catches type errors without emitting JavaScript. Strict null checking is enabled for the server and AI; the legacy server does not yet enable every strict flag. Dependency declaration files use `skipLibCheck`, while application source is checked.

VS Code is configured to use `node_modules/typescript/lib`. If prompted, select **Use Workspace Version**. Install the recommended Prettier VS Code extension to format on save. `bun run format` applies Prettier and expands control-flow bodies into blocks. `bun run format:check` verifies both without editing files; `bun run check` runs formatting, TypeScript checks, and tests. Prettier uses standard parentheses spacing, e.g. `if (condition)`, with the body on separate lines.

`bun test` runs the existing active engine/editor tests, AI tests, and a database-free HTTP smoke test. The historical commented-out engine tests remain inactive.

## AI and visual development

```sh
bun run ai:test
bun run ai:tournament server/ai/example-tournament.json /tmp/tournament-report.json
bun run vizdev:sync
bun run vizdev:check  # Requires Chromium
```

See [AI configuration and design](server/ai/README.md) and [visual style experiments](vizdev/README.md).
