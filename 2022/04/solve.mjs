export function solve1(lines) {
  let completelyOverlapped = 0;

  lines.forEach((line) => {
    const pair = line.split(",");
    const assignments = pair.map((p) => {
      const numbers = p.split("-");
      return {
        min: +numbers[0],
        max: +numbers[1],
      };
    });
    
    const completelyOverlaps = 
      (assignments[0].min <= assignments[1].min && assignments[0].max >= assignments[1].max) ||
      (assignments[1].min <= assignments[0].min && assignments[1].max >= assignments[0].max)

    if (completelyOverlaps) {
      completelyOverlapped++;
    }
  });
  return completelyOverlapped;
}

export function solve2(lines) {
  let partiallyOverlapped = 0;

  lines.forEach((line) => {
    const pair = line.split(",");
    const assignments = pair.map((p) => {
      const numbers = p.split("-").map(n => +n);
      return {
        min: numbers[0],
        max: numbers[1],
      };
    });
    
    // First attempt: failed for cases when first assignment is completely contained within second
    // const partiallyOverlaps = (
    //   // is the min of assignment 2 within assignment 1
    //   (assignments[0].min <= assignments[1].min && assignments[0].max >= assignments[1].min) ||
    //   // is the max of assignment 2 within assignment 1
    //   (assignments[0].min <= assignments[1].max && assignments[0].max >= assignments[1].max)
    // );

    const partiallyOverlaps = (
      // is the min of assignment 2 within assignment 1
      (assignments[0].min <= assignments[1].min && assignments[0].max >= assignments[1].min) ||
      // is the min of assignment 1 within assignment 2
      (assignments[1].min <= assignments[0].min && assignments[1].max >= assignments[0].min)
    );

    if (partiallyOverlaps) {
      partiallyOverlapped++;
    }
  });

  return partiallyOverlapped;
}
