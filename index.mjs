import { readFileSync, readdirSync, existsSync } from "fs";
import { join, resolve } from "path";
import { argv } from "process";

let args = argv.slice(2);
// save real console.log so we can suppress/restore console logging at will
const realConsoleLog = console.log;

const puzzle = {
  day: (args[0] ?? new Date().getDate().toString()).padStart(2, "0"),
  year: args[1] ?? new Date().getFullYear().toString(),
};
const puzzleDir = resolve(join(".", puzzle.year, puzzle.day));
if (!existsSync(puzzleDir)) {
  throw new Error(
    `The directory for puzzle ${puzzle.year}/${puzzle.day} does not exist!`
  );
}

const files = readdirSync(puzzleDir);
const inputFile = "input.txt";
const solutionFile = "solve.mjs";
const solutionFilePath = join(puzzleDir, solutionFile);
console.log(solutionFilePath);
const { solve1, solve2 } = await import(solutionFilePath);
if (!solve1 || !solve2) {
  throw new Error(
    `could not find a solve1 and/or solve2 function in ${join(
      puzzle,
      solutionFile
    )}`
  );
}
const reduceExamples = (prev, curr) => {
  const parts = curr.split(".");
  const name = parts[0];
  const type = parts[2];
  let exampleEntry = prev.find((e) => e.name === name);
  if (!exampleEntry) {
    exampleEntry = { name };
    prev.push(exampleEntry);
  }
  exampleEntry[type] = curr;

  return prev;
};
const part1Files = files
  .filter((f) => f.includes(".1."))
  .reduce(reduceExamples, []);
const part2Files = files
  .filter((f) => f.includes(".2."))
  .reduce(reduceExamples, []);

run(part1Files, solve1);
run([{ input: inputFile }], solve1);
run(part2Files, solve2);
run([{ input: inputFile }], solve2);

function run(testCases, solve) {
  testCases.forEach((test) => {
    const isExample = !!test.output;
    const lines = readFile(join(puzzleDir, test.input));
    let result;

    // for the real puzzle input we don't want to console log EVERYTHING
    if (!isExample) {
      console.log = () => {};
    }
    result = solve(lines);
    console.log = realConsoleLog;
    const isMultiline = `${result}`.includes("\n");
    const wrapperChar = isMultiline ? "\n" : "";

    if (isExample) {
      const output = readFile(join(puzzleDir, test.output)).join("\n");
      if (result == output) {
        console.log(
          `output for ${test.input} is correct! (${wrapperChar}${result}${wrapperChar})`
        );
      } else {
        console.log(
          `output for ${test.input} is incorrect! (expected: ${wrapperChar}${output}${wrapperChar}, actual: ${wrapperChar}${result}${wrapperChar})`
        );
      }
    } else {
      console.log(`output for ${test.input} is ${wrapperChar}${result}${wrapperChar}`);
    }
  });
}

function readFile(name) {
  const contents = readFileSync(name).toString().trimEnd();
  const lines = contents.split(/\r?\n/g).map((line) => line.trimEnd());
  return lines;
}
