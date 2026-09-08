import fs from "node:fs";
import path from "node:path";
import { runTournament } from "./tournament";
(async () => {
  const file = process.argv[2];
  if (!file) {
    throw new Error("Usage: bun server/ai/run.ts <tournament.json> [report.json]");
  }
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  const folder = path.resolve(__dirname, "../../cards");
  const catalog = Object.fromEntries(
    fs
      .readdirSync(folder)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        const card = JSON.parse(fs.readFileSync(path.join(folder, f), "utf8"));
        return [card.name, card];
      }),
  );
  const report = await runTournament(
    config.personas,
    catalog,
    config.rounds ?? 1,
    config.seed ?? 1,
    config.maxTurns ?? 100,
  );
  if (process.argv[3]) {
    fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 2) + "\n");
  }
  console.log(JSON.stringify(report.standings, null, 2));
  console.log(
    `${report.matches.length} matches; ${report.matches.reduce((n, m) => n + m.turns, 0)} turns`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
