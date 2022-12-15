import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve, dirname } from "path";
import { argv } from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let args = argv.slice(2);

const puzzle = {
  day: (args[0] ?? new Date().getDate().toString()).padStart(2, "0"),
  year: args[1] ?? new Date().getFullYear().toString(),
};
const puzzleDir = resolve(join(__dirname, puzzle.year, puzzle.day));
if (existsSync(puzzleDir)) {
  throw new Error(
    `The directory for puzzle ${puzzle.year}/${puzzle.day} already exists!`
  );
}

mkdirSync(puzzleDir);
writeFileSync(join(puzzleDir, "input.txt"), "");
writeFileSync(join(puzzleDir, "example.1.input.txt"), "");
writeFileSync(join(puzzleDir, "example.1.output.txt"), "");
writeFileSync(join(puzzleDir, "example.2.input.txt"), "");
writeFileSync(join(puzzleDir, "example.2.output.txt"), "");
writeFileSync(
  join(puzzleDir, "solve.mjs"),
  `export function solve1(lines) {}

export function solve2(lines) {}
`
);
