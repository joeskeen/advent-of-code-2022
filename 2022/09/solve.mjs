function parseInput(lines) {
  return lines.map((l) => {
    const parts = l.split(" ");
    return {
      direction: parts[0],
      distance: +parts[1],
    };
  });
}

export function solve1(lines) {
  const commands = parseInput(lines);
  const visitedPositions = []; // like a Record<string, true>
  let headPosition = new Point(0, 0);
  let tailPosition = headPosition;
  visitedPositions.push(tailPosition.toString());

  commands.forEach((command) => {
    for (
      let remainingMoves = command.distance;
      remainingMoves > 0;
      remainingMoves--
    ) {
      switch (command.direction) {
        case "R":
          headPosition = headPosition.right();
          break;
        case "L":
          headPosition = headPosition.left();
          break;
        case "U":
          headPosition = headPosition.up();
          break;
        case "D":
          headPosition = headPosition.down();
          break;
        default:
          throw `invalid command ${command.direction}`;
      }

      // check if we need to move the tail
      const dX = headPosition.x - tailPosition.x;
      const dY = headPosition.y - tailPosition.y;
      if ((Math.abs(dX) > 1 || Math.abs(dY) > 1) && dX !== 0 && dY !== 0) {
        if (dX > 0) {
          tailPosition = tailPosition.right();
        } else {
          tailPosition = tailPosition.left();
        }
        if (dY > 0) {
          tailPosition = tailPosition.up();
        } else {
          tailPosition = tailPosition.down();
        }
      } else if (Math.abs(dX) > 1) {
        // move the tail in the X direction
        if (dX > 0) {
          tailPosition = tailPosition.right();
        } else {
          tailPosition = tailPosition.left();
        }
      } else if (Math.abs(dY) > 1) {
        // move the tail in the Y direction
        if (dY > 0) {
          tailPosition = tailPosition.up();
        } else {
          tailPosition = tailPosition.down();
        }
      }

      visitedPositions.push(tailPosition.toString());
    }
  });

  return new Set(visitedPositions).size;
}

class Point {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return `(${this.x},${this.y})`;
  }
  left() {
    return new Point(this.x - 1, this.y);
  }
  right() {
    return new Point(this.x + 1, this.y);
  }
  up() {
    return new Point(this.x, this.y + 1);
  }
  down() {
    return new Point(this.x, this.y - 1);
  }
}

export function solve2(lines) {
  const commands = parseInput(lines);
  const ropeLength = 10;
  const rope = [];
  const startPosition = new Point(0, 0);
  for (let i = 0; i < ropeLength; i++) {
    rope.push({
      knot: i,
      position: startPosition,
      visitedPositions: [startPosition.toString()],
    });
  }
  const head = rope[0];
  const tail = rope[rope.length - 1];
  commands.forEach((command) => {
    for (
      let remainingMoves = command.distance;
      remainingMoves > 0;
      remainingMoves--
    ) {
      switch (command.direction) {
        case "R":
          head.position = head.position.right();
          break;
        case "L":
          head.position = head.position.left();
          break;
        case "U":
          head.position = head.position.up();
          break;
        case "D":
          head.position = head.position.down();
          break;
        default:
          throw `invalid command ${command.direction}`;
      }
      head.visitedPositions.push(head.position.toString());

      for (let i = 1; i < rope.length; i++) {
        const knot = rope[i];
        const previousKnot = rope[i - 1];

        // check if we need to move the tail
        const dX = previousKnot.position.x - knot.position.x;
        const dY = previousKnot.position.y - knot.position.y;
        if ((Math.abs(dX) > 1 || Math.abs(dY) > 1) && dX !== 0 && dY !== 0) {
          if (dX > 0) {
            knot.position = knot.position.right();
          } else {
            knot.position = knot.position.left();
          }
          if (dY > 0) {
            knot.position = knot.position.up();
          } else {
            knot.position = knot.position.down();
          }
        } else if (Math.abs(dX) > 1) {
          // move the tail in the X direction
          if (dX > 0) {
            knot.position = knot.position.right();
          } else {
            knot.position = knot.position.left();
          }
        } else if (Math.abs(dY) > 1) {
          // move the tail in the Y direction
          if (dY > 0) {
            knot.position = knot.position.up();
          } else {
            knot.position = knot.position.down();
          }
        }

        knot.visitedPositions.push(knot.position.toString());
      }
    }
  });
  const tailPositions = new Set(tail.visitedPositions);
  return tailPositions.size;
}
