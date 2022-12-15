function parseInput(lines) {
  const data = [];
  for (const line of lines) {
    const pattern =
      /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/g;
    const match = pattern.exec(line);
    const info = {
      sensor: new Point(+match[1], +match[2]),
      beacon: new Point(+match[3], +match[4]),
    };
    data.push(info);
  }
  return data;
}

class Point {
  static fromString(str) {
    const parts = str.split(",");
    return new Point(+parts[0], +parts[1]);
  }
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceFrom(otherPoint) {
    return Math.abs(this.x - otherPoint.x) + Math.abs(this.y - otherPoint.y);
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

export function solve1(lines) {
  const data = parseInput(lines);
  let targetRow;
  if (data[0].sensor.x < 1000) {
    targetRow = 10;
  } else {
    targetRow = 2000000;
  }

  const grid = {};
  let impossibleCount = 0;
  const impossibleRanges = [];
  data.forEach((d) => {
    grid[d.beacon.toString()] = "B";
    grid[d.sensor.toString()] = "S";

    // calculate distance
    const distance = d.sensor.distanceFrom(d.beacon);
    const maxY = d.sensor.y + distance;
    const minY = d.sensor.y - distance;
    if (maxY < targetRow || minY > targetRow) {
      return;
    }

    // console.log(`searching within ${distance} of ${d.sensor}`);

    const dy = Math.abs(targetRow - d.sensor.y);
    const dx = distance - dy;
    impossibleRanges.push({ min: d.sensor.x - dx, max: d.sensor.x + dx });
  });
  // console.log("done populating", impossibleRanges, impossibleRanges.length);

  for (let i = impossibleRanges.length - 1; i >= 0; i--) {
    const range = impossibleRanges[i];
    const overlapping = impossibleRanges.find((r) => {
      const isSame = r === range;
      const overlapsStart = r.min <= range.min && r.max >= range.min;
      const overlapsEnd = r.min <= range.max && r.max >= range.max;

      return !isSame && (overlapsStart || overlapsEnd);
    });
    if (!overlapping) {
      continue;
    }
    // console.log(
    //   `Range ${JSON.stringify(range)} overlaps ${JSON.stringify(
    //     overlapping
    //   )}, consolidating`
    // );

    // make sure entire range is represented by the overlapping one
    overlapping.min = Math.min(range.min, overlapping.min);
    overlapping.max = Math.max(range.max, overlapping.max);

    // remove `range` from list as it is now redundant
    impossibleRanges.splice(i, 1);
  }
  // console.log(impossibleRanges, impossibleRanges.length);
  const sum = impossibleRanges.reduce((prev, curr) => {
    return prev + (curr.max - curr.min);
  }, 0);
  return sum;
}

export function solve2(lines) {
  const data = parseInput(lines);
  let maxN;
  if (data[0].sensor.x < 1000) {
    maxN = 20;
  } else {
    maxN = 4000000;
  }

  for (let targetRow = 0; targetRow < maxN; targetRow++) {
    if (targetRow % 100000 === 0) {
      // console.log(`targetRow = ${targetRow}`);
    }
    const grid = {};
    const impossibleRanges = [];
    data.forEach((d) => {
      grid[d.beacon.toString()] = "B";
      grid[d.sensor.toString()] = "S";

      // calculate distance
      const distance = d.sensor.distanceFrom(d.beacon);
      const maxY = d.sensor.y + distance;
      const minY = d.sensor.y - distance;
      if (maxY < targetRow || minY > targetRow) {
        return;
      }

      const dy = Math.abs(targetRow - d.sensor.y);
      const dx = distance - dy;
      impossibleRanges.push({ min: d.sensor.x - dx, max: d.sensor.x + dx });
    });

    for (let i = impossibleRanges.length - 1; i >= 0; i--) {
      const range = impossibleRanges[i];
      const overlapping = impossibleRanges.find((r) => {
        const isSame = r === range;
        const overlapsStart = r.min <= range.min && r.max >= range.min;
        const overlapsEnd = r.min <= range.max && r.max >= range.max;

        return !isSame && (overlapsStart || overlapsEnd);
      });
      if (!overlapping) {
        continue;
      }

      // make sure entire range is represented by the overlapping one
      overlapping.min = Math.min(range.min, overlapping.min);
      overlapping.max = Math.max(range.max, overlapping.max);

      // remove `range` from list as it is now redundant
      impossibleRanges.splice(i, 1);
    }
    
    if (impossibleRanges.length > 1) {
      impossibleRanges.sort((a,b) => a.min - b.min);
      const y = targetRow;
      const x = impossibleRanges[0].max + 1;
      const tuningFrequency = x * 4000000 + y;
      // console.log({impossibleRanges, targetRow, x, y, tuningFrequency});
      return tuningFrequency;
    }
  }
}
