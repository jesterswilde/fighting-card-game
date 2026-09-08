// Refresh the standalone preview from the game's source data. No dependencies.
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const cards = fs
  .readdirSync(path.join(root, "cards"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(root, "cards", f), "utf8")))
  .sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(
  path.join(__dirname, "data.js"),
  "window.VIZDEV_CARDS = " + JSON.stringify(cards, null, 2) + ";\n",
);
const icons = [
  "grapple",
  "close",
  "far",
  "moving",
  "still",
  "standing",
  "prone",
  "balanced",
  "anticipating",
  "unbalanced",
  "not_anticipating",
  "damage",
  "closer",
  "further",
  "poise",
  "losePoise",
  "not_grapple",
  "not_close",
  "not_far",
  "bloodied",
];
fs.mkdirSync(path.join(__dirname, "assets"), { recursive: true });
for (const icon of icons) {
  fs.copyFileSync(
    path.join(root, "game-client/src/images", icon + ".png"),
    path.join(__dirname, "assets", icon + ".png"),
  );
}
console.log(`Updated ${cards.length} cards and ${icons.length} original icons.`);
