function parseInput(lines) {
  let start;
  let end;
  const grid = lines.map((l, lNum) =>
    l.split("").map((c, cNum) => {
      let cell = {
        x: cNum,
        y: lNum,
      };
      if (c === "S") {
        cell.isStart = true;
        cell.height = 0;
        start = cell;
      } else if (c === "E") {
        cell.isEnd = true;
        cell.height = 25;
        end = cell;
      } else {
        cell.height = c.charCodeAt(0) - "a".charCodeAt(0);
      }
      return cell;
    })
  );
  grid.forEach((row) => {
    row.forEach((cell) => {
      cell.neighbors = [
        // above
        grid[cell.y - 1]?.[cell.x],
        // below
        grid[cell.y + 1]?.[cell.x],
        // left
        grid[cell.y][cell.x - 1],
        // right
        grid[cell.y][cell.x + 1],
      ].filter((c) => !!c);
      cell.distanceFromStart =
        Math.abs(cell.x - start.x) + Math.abs(cell.y - start.y);
      cell.distanceFromEnd =
        Math.abs(cell.x - end.x) + Math.abs(cell.y - end.y);
    });
  });
  return {grid, start, end};
}

function reconstructPath(cameFrom, current) {
  const totalPath = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current);
    totalPath.unshift(current); //not super efficient
  }
  return totalPath;
}

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function aStar(start, goal, h, d) {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  let openSet = [start];

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
  // to n currently known.
  const cameFrom = new Map();

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore = new Map(); // default value of Infinity
  gScore.set(start, 0);

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  const fScore = new Map(); // default value of Infinity
  fScore.set(start, h(start));

  // while openSet is not empty
  while (openSet.length) {
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    // Find the element in openSet that has the smallest value in the fScore map
    const current = openSet
      .map((n) => ({ node: n, fScore: (fScore.get(n) ?? Infinity) }))
      .sort((a, b) => a.fScore - b.fScore)[0].node;

    if (current === goal) return reconstructPath(cameFrom, current);

    openSet = openSet.filter((n) => n !== current);

    for (let neighbor of current.neighbors) {
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      const tentativeGScore = (gScore.get(current) ?? Infinity) + d(current, neighbor);
      if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) { // if the neighbor isn't in the collection, return Infinity
        // This path to neighbor is better than any previous one. Record it!
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + h(neighbor));
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // Open set is empty but goal was never reached
  throw new Error('path finding failed: Open set is empty but goal was never reached')
}

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function modifiedAStar(start, isGoal, h, d) {
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    let openSet = [start];
  
    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    const cameFrom = new Map();
  
    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    const gScore = new Map(); // default value of Infinity
    gScore.set(start, 0);
  
    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how cheap a path could be from start to finish if it goes through n.
    const fScore = new Map(); // default value of Infinity
    fScore.set(start, h(start));
  
    // while openSet is not empty
    while (openSet.length) {
      // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
      // Find the element in openSet that has the smallest value in the fScore map
      const current = openSet
        .map((n) => ({ node: n, fScore: (fScore.get(n) ?? Infinity) }))
        .sort((a, b) => a.fScore - b.fScore)[0].node;
  
      if (isGoal(current)) return reconstructPath(cameFrom, current);
  
      openSet = openSet.filter((n) => n !== current);
  
      for (let neighbor of current.neighbors) {
        // d(current,neighbor) is the weight of the edge from current to neighbor
        // tentative_gScore is the distance from start to the neighbor through current
        const tentativeGScore = (gScore.get(current) ?? Infinity) + d(current, neighbor);
        if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) { // if the neighbor isn't in the collection, return Infinity
          // This path to neighbor is better than any previous one. Record it!
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore + h(neighbor));
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
  
    // Open set is empty but goal was never reached
    throw new Error('path finding failed: Open set is empty but goal was never reached')
  }

export function solve1(lines) {
  const {grid, start, end} = parseInput(lines);
  const d = (current, neighbor) => {
    if (neighbor.height > current.height + 1) {
      return Infinity;
    } else {
      return 1;
    }
  };
  const h = (node) => node.distanceFromEnd;
  const path = aStar(start, end, h, d);
  return path.length - 1; // don't count the start position, only steps
}
export function solve2(lines) {
    const {grid, start, end} = parseInput(lines);
    const d = (current, neighbor) => {
      if (current.height > neighbor.height + 1) {
        return Infinity;
      } else {
        return 1;
      }
    };
    const h = (node) => node.distanceFromEnd;
    const isGoal = node => node.height === 0;
    const path = modifiedAStar(end, isGoal, h, d);
    console.log(path);
    return path.length - 1; // don't count the start position, only steps
}
