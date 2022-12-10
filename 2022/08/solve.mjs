function parseInput(lines) {
  return lines.map((l) =>
    l.split("").map((c) => ({ height: +c, scenicScore: 1 }))
  );
}

export function solve2(lines) {
  const grid = parseInput(lines);

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const tree = row[j];
      let isBlocked = false;
      let treesSeen = 0;
      const keepGoing = () => tree.scenicScore > 0 && !isBlocked;

      // look left - decreasing j
      for (let x = j - 1; keepGoing() && x >= 0; x--) {
        const neighbor = row[x];
        treesSeen++;
        if (neighbor.height >= tree.height) {
          isBlocked = true;
        }
      }
      tree.scenicScore *= treesSeen;
      isBlocked = false;
      treesSeen = 0;

      // look right - increasing j
      for (let x = j + 1; keepGoing() && x < row.length; x++) {
        const neighbor = row[x];
        treesSeen++;
        if (neighbor.height >= tree.height) {
          isBlocked = true;
        }
      }
      tree.scenicScore *= treesSeen;
      isBlocked = false;
      treesSeen = 0;

      // look up - decreasing i
      for (let y = i - 1; keepGoing() && y >= 0; y--) {
        const neighbor = grid[y][j];
        treesSeen++;
        if (neighbor.height >= tree.height) {
          isBlocked = true;
        }
      }
      tree.scenicScore *= treesSeen;
      isBlocked = false;
      treesSeen = 0;

      // look down - increasing i
      for (let y = i + 1; keepGoing() && y < grid.length; y++) {
        const neighbor = grid[y][j];
        treesSeen++;
        if (neighbor.height >= tree.height) {
          isBlocked = true;
        }
      }
      tree.scenicScore *= treesSeen;
      isBlocked = false;
      treesSeen = 0;
    }
  }

  const biggest = grid
    .flat()
    .map((tree) => tree.scenicScore)
    .reduce((biggest, current) => Math.max(biggest, current), 0);
  return biggest;
}

export function solve1(lines) {
  const grid = parseInput(lines);
  // console.log(grid);

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    for (let j = 0; j < row.length; j++) {
      const tree = row[j];
      let isBlocked = false;
      // look left - decreasing j
      for (let x = j - 1; !tree.isSeen && !isBlocked && x >= 0; x--) {
        const neighbor = row[x];
        if (neighbor.height >= tree.height) {
          isBlocked = true;
        }
      }
      if (!isBlocked) {
        tree.isSeen = true;
      } else {
        isBlocked = false;
      }
      // look right - increasing j
      for (let x = j + 1; !tree.isSeen && !isBlocked && x < row.length; x++) {
        const neighbor = row[x];
        if (neighbor.height >= tree.height) {
          isBlocked = true;
        }
      }
      if (!isBlocked) {
        tree.isSeen = true;
      } else {
        isBlocked = false;
      }
      // look up - decreasing i
      for (let y = i - 1; !tree.isSeen && !isBlocked && y >= 0; y--) {
        const neighbor = grid[y][j];
        if (neighbor.height >= tree.height) {
          isBlocked = true;
        }
      }
      if (!isBlocked) {
        tree.isSeen = true;
      } else {
        isBlocked = false;
      }
      // look down - increasing i
      for (let y = i + 1; !tree.isSeen && !isBlocked && y < grid.length; y++) {
        const neighbor = grid[y][j];
        if (neighbor.height >= tree.height) {
          isBlocked = true;
        }
      }
      if (!isBlocked) {
        tree.isSeen = true;
      } else {
        isBlocked = false;
      }
    }
  }

  // sum up all visible trees in the grid
  const visibleTreeCount = grid.reduce(
    (sum, row) =>
      sum + row.reduce((sum, tree) => sum + (tree.isSeen ? 1 : 0), 0),
    0
  );
  return visibleTreeCount;
}
