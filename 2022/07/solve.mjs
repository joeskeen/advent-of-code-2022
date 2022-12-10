function parseInput(lines) {
  const fileSystem = {};
  let navigationStack = [];
  const fullPath = () => navigationStack.join("/");

  lines.forEach((l) => {
    const parts = l.split(" ");
    const isCommand = parts[0] === "$";
    if (isCommand) {
      const command = parts[1];
      if (command === "cd") {
        const dir = parts[2];
        if (dir === "/") {
          navigationStack = [];
        } else if (dir === "..") {
          navigationStack.pop();
        } else {
          navigationStack.push(dir);
        }
        const newDir = fileSystem[fullPath()];
        if (!newDir) {
          fileSystem[fullPath()] = [];
        }
      }
    } else {
      // ls output is the only possible way to get here
      let entry;
      if (parts[0] === "dir") {
        entry = { name: parts[1], type: "dir" };
      } else {
        entry = { name: parts[1], type: "file", size: +parts[0] };
      }
      fileSystem[fullPath()].push(entry);
    }
  });

  return fileSystem;
}

function getDirSize(fileSystem, dir) {
  const dirContents = fileSystem[dir];
  //   console.log({ dir, dirContents });
  if (dirContents.directorySize) {
    return dirContents.directorySize;
  }
  const dirSize = dirContents
    .map((c) => {
      if (c.type === "file") {
        return c.size;
      } else {
        return getDirSize(fileSystem, `${dir}/${c.name}`.replace(/^\//, ""));
      }
    })
    .reduce((prev, curr) => prev + curr, 0);
  dirContents.directorySize = dirSize;
  return dirSize;
}

export function solve1(lines) {
  const fileSystem = parseInput(lines);
  getDirSize(fileSystem, "");
  console.log(
    Object.keys(fileSystem).map((dirname) => ({
      dirname,
      size: fileSystem[dirname].directorySize,
    }))
  );

  const limit = 100000;
  const total = Object.keys(fileSystem)
    .map((dirName) => fileSystem[dirName].directorySize)
    .filter((size) => size <= limit)
    .reduce((prev, curr) => prev + curr, 0);
  return total;
}
export function solve2(lines) {
  const fileSystem = parseInput(lines);
  getDirSize(fileSystem, "");
  const sizes = Object.keys(fileSystem)
    .map((dirname) => fileSystem[dirname].directorySize)
    .sort((a, b) => a - b);
  const capacity = 70000000;
  const needed = 30000000;
  const used = fileSystem[""].directorySize;
  const unused = capacity - used;
  const freeSpaceNeeded = needed - unused;
  const amountDeleted = sizes.find(s => s >= freeSpaceNeeded);
  console.log({capacity, needed, used, freeSpaceNeeded, amountDeleted, sizes: sizes.join(',')});

  return amountDeleted;
}
