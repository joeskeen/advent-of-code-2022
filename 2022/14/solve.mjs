function parseInput(lines) {
  return lines.map((l) =>
    l.split(/ -> /g).map((pointStr) => {
      const coordinates = pointStr.split(",").map((part) => +part);
      return {
        x: coordinates[0],
        y: coordinates[1],
      };
    })
  );
}

function pointToString(point) {
  return `${point.x},${point.y}`;
}

export function solve1(lines) {
  const rockSegments = parseInput(lines);

  // calculate cave boundaries
  const caveRocks = rockSegments.flat();
  const minX = caveRocks.reduce(
    (minX, curr) => Math.min(minX, curr.x),
    Infinity
  );
  const maxX = caveRocks.reduce(
    (maxX, curr) => Math.max(maxX, curr.x),
    -Infinity
  );
  const minY = caveRocks.reduce(
    (minY, curr) => Math.min(minY, curr.y),
    Infinity
  );
  const maxY = caveRocks.reduce(
    (maxY, curr) => Math.max(maxY, curr.y),
    -Infinity
  );
  console.log({ minX, minY, maxX, maxY });

  const cave = {};

  // populate rock walls in the cave
  rockSegments.forEach((segment) => {
    const corners = segment;
    corners.forEach((point) => (cave[pointToString(point)] = "#"));
    for (let i = 1; i < corners.length; i++) {
      const pair = [corners[i - 1], corners[i]];
      if (pair[0].x === pair[1].x) {
        pair.sort((a, b) => a.y - b.y);
        for (let j = pair[0].y; j < pair[1].y; j++) {
          const point = { x: pair[0].x, y: j };
          cave[pointToString(point)] = "#";
        }
      } else {
        pair.sort((a, b) => a.x - b.x);
        for (let j = pair[0].x; j < pair[1].x; j++) {
          const point = { x: j, y: pair[0].y };
          cave[pointToString(point)] = "#";
        }
      }
    }
  });

  // start sand drop simulation
  const sandOrigin = { x: 500, y: 0 };
  let amountOfSandDropped = 0;
  let sandDisappears = false;
  while (!sandDisappears) {
    // TODO: drop some sand
    let sandResting = false;
    let sandPosition = sandOrigin;
    console.log(`new sand particle: ${amountOfSandDropped + 1}`);
    while (!sandResting) {
      // is the sand out of bounds?
      if (
        sandPosition.x < minX ||
        sandPosition.x > maxX ||
        sandPosition.y > maxY
      ) {
        sandDisappears = true;
        break;
      }

      // sand moves down or diagonal
      const oneDown = { x: sandPosition.x, y: sandPosition.y + 1 };
      if (!cave[pointToString(oneDown)]) {
        sandPosition = oneDown;
        continue;
      }

      const diagonalLeft = { x: sandPosition.x - 1, y: sandPosition.y + 1 };
      if (!cave[pointToString(diagonalLeft)]) {
        sandPosition = diagonalLeft;
        continue;
      }

      const diagonalRight = { x: sandPosition.x + 1, y: sandPosition.y + 1 };
      if (!cave[pointToString(diagonalRight)]) {
        sandPosition = diagonalRight;
        continue;
      }

      // all three possible next positions are taken
      console.log(
        `particle ${amountOfSandDropped + 1} comes to rest at ${pointToString(
          sandPosition
        )}`
      );
      sandResting = true;
      cave[pointToString(sandPosition)] = "o";
      amountOfSandDropped++;
    }
  }

  return amountOfSandDropped;
}

export function solve2(lines) {
  const rockSegments = parseInput(lines);

  // calculate cave boundaries
  const caveRocks = rockSegments.flat();
  const minX = caveRocks.reduce(
    (minX, curr) => Math.min(minX, curr.x),
    Infinity
  );
  const maxX = caveRocks.reduce(
    (maxX, curr) => Math.max(maxX, curr.x),
    -Infinity
  );
  const minY = caveRocks.reduce(
    (minY, curr) => Math.min(minY, curr.y),
    Infinity
  );
  const maxY = caveRocks.reduce(
    (maxY, curr) => Math.max(maxY, curr.y),
    -Infinity
  );

  const floorY = maxY + 2;

  const cave = {};

  // populate rock walls in the cave
  rockSegments.forEach((segment) => {
    const corners = segment;
    corners.forEach((point) => (cave[pointToString(point)] = "#"));
    for (let i = 1; i < corners.length; i++) {
      const pair = [corners[i - 1], corners[i]];
      if (pair[0].x === pair[1].x) {
        pair.sort((a, b) => a.y - b.y);
        for (let j = pair[0].y; j < pair[1].y; j++) {
          const point = { x: pair[0].x, y: j };
          cave[pointToString(point)] = "#";
        }
      } else {
        pair.sort((a, b) => a.x - b.x);
        for (let j = pair[0].x; j < pair[1].x; j++) {
          const point = { x: j, y: pair[0].y };
          cave[pointToString(point)] = "#";
        }
      }
    }
  });

  // start sand drop simulation
  const sandOrigin = { x: 500, y: 0 };
  let amountOfSandDropped = 0;
  let sandIsAtOrigin = false;
  do {
    // TODO: drop some sand
    let sandResting = false;
    let sandPosition = sandOrigin;
    console.log(`new sand particle: ${amountOfSandDropped + 1}`);
    while (!sandResting) {
      // // is the sand out of bounds?
      // if (
      //   sandPosition.x < minX ||
      //   sandPosition.x > maxX ||
      //   sandPosition.y > maxY
      // ) {
      //   sandDisappears = true;
      //   break;
      // }

      // sand moves down or diagonal
      const oneDown = { x: sandPosition.x, y: sandPosition.y + 1 };
      if (!cave[pointToString(oneDown)] && oneDown.y !== floorY) {
        console.log(
          `particle ${amountOfSandDropped + 1} moves one down to ${pointToString(
            oneDown
          )}`
        );
        sandPosition = oneDown;
        continue;
      }

      const diagonalLeft = { x: sandPosition.x - 1, y: sandPosition.y + 1 };
      if (!cave[pointToString(diagonalLeft)] && oneDown.y !== floorY) {
        console.log(
          `particle ${amountOfSandDropped + 1} moves diagonal left to ${pointToString(
            diagonalLeft
          )}`
        );
        sandPosition = diagonalLeft;
        continue;
      }

      const diagonalRight = { x: sandPosition.x + 1, y: sandPosition.y + 1 };
      if (!cave[pointToString(diagonalRight)] && oneDown.y !== floorY) {
        console.log(
          `particle ${amountOfSandDropped + 1} moves diagonal right to ${pointToString(
            diagonalRight
          )}`
        );
        sandPosition = diagonalRight;
        continue;
      }

      // all three possible next positions are taken
      console.log(
        `particle ${amountOfSandDropped + 1} comes to rest at ${pointToString(
          sandPosition
        )}`
      );
      sandResting = true;
      cave[pointToString(sandPosition)] = "o";
      amountOfSandDropped++;

      if (sandPosition === sandOrigin) {
        sandIsAtOrigin = true;
        break;
      }
    }
  } while (!sandIsAtOrigin);

  return amountOfSandDropped;
}
