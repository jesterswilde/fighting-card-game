import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";

// Prettier deliberately preserves unbraced single-line statements. Require blocks
// separately so short guards stay readable after every formatting pass.
const root = resolve(import.meta.dir, "..");
const fix = process.argv.includes("--fix");
const files = ts.sys.readDirectory(
  root,
  [".ts", ".tsx", ".js", ".jsx"],
  [
    "**/node_modules/**",
    "**/dist/**",
    "serverBuild/**",
    ".git/**",
    ".agents/**",
    ".codex/**",
    "_cards_old/**",
    "_cards_old_v2/**",
    "vizdev/data.js",
    "vizdev/assets/**",
  ],
);
let failures = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const edits: Array<{ offset: number; text: string }> = [];
  const requireBlock = (statement: ts.Statement | undefined) => {
    if (!statement || ts.isBlock(statement)) {
      return;
    }
    const start = statement.getStart(source);
    if (!fix) {
      const { line } = source.getLineAndCharacterOfPosition(start);
      console.error(`${relative(root, file)}:${line + 1}: use a block for control-flow bodies`);
    }
    failures++;
    edits.push({ offset: start, text: "{\n" }, { offset: statement.end, text: "\n}" });
  };
  const visit = (node: ts.Node) => {
    if (ts.isIfStatement(node)) {
      requireBlock(node.thenStatement);
      if (node.elseStatement && !ts.isIfStatement(node.elseStatement)) {
        requireBlock(node.elseStatement);
      }
    } else if (
      ts.isForStatement(node) ||
      ts.isForInStatement(node) ||
      ts.isForOfStatement(node) ||
      ts.isWhileStatement(node) ||
      ts.isDoStatement(node)
    ) {
      requireBlock(node.statement);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (fix && edits.length) {
    let result = text;
    for (const edit of edits.sort((a, b) => b.offset - a.offset)) {
      result = result.slice(0, edit.offset) + edit.text + result.slice(edit.offset);
    }
    writeFileSync(file, result);
  }
}
if (failures && !fix) {
  process.exitCode = 1;
}
