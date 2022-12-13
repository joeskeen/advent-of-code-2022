function parseInput(lines) {
  const monkeys = [];
  for (let i = 0; i < lines.length; i += 7) {
    const startingItems = lines[i + 1]
      .split(": ")[1]
      .split(", ")
      .map((n) => +n);
    const expression = lines[i + 2].split(" = ")[1];
    const operation = (old) => eval?.(expression.replace(/old/g, old));
    const testDivisibleBy = +lines[i + 3].split(" by ")[1];
    const ifTrue = +lines[i + 4].split(" monkey ")[1];
    const ifFalse = +lines[i + 5].split(" monkey ")[1];

    monkeys.push({
      startingItems,
      testDivisibleBy,
      operation,
      ifTrue,
      ifFalse,
      inspectionCount: 0,
    });
  }
  return monkeys;
}

export function solve1(lines) {
  const monkeys = parseInput(lines);

  const rounds = 20;
  for (let i = 0; i < rounds; i++) {
    monkeys.forEach((monkey) => {
      monkey.startingItems.slice().forEach((item) => {
        const worryLevel = item;
        const newWorryLevel = monkey.operation(worryLevel);
        const afterBored = Math.floor(newWorryLevel / 3);
        const isDivisible = afterBored % monkey.testDivisibleBy === 0;
        const newMonkeyNumber = isDivisible ? monkey.ifTrue : monkey.ifFalse;
        monkey.startingItems = monkey.startingItems.slice(1);
        monkeys[newMonkeyNumber].startingItems.push(afterBored);
        monkey.inspectionCount++;
      });
    });
  }

  return (
    monkeys
      // I only care about the inspectionCount, so transform this array into array of those
      .map((m) => m.inspectionCount)
      // sort descending
      .sort((a, b) => b - a)
      // take first two items in the array
      .slice(0, 2)
      // reduce to single value by multiplying them together (1 is the starting value for the multiplication)
      .reduce((prev, curr) => prev * curr, 1)
  );
}
export function solve2(lines) {
  const monkeys = parseInput(lines);

  const worryReducer = monkeys
    .map((m) => m.testDivisibleBy)
    .reduce((prev, curr) => prev * curr, 1);
  const rounds = 10000;
  const specialRounds = [
    1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
  ];

  for (let round = 1; round <= rounds; round++) {
    monkeys.forEach((monkey) => {
      monkey.startingItems.slice().forEach((item) => {
        let worryLevel = item;
        worryLevel = monkey.operation(worryLevel);
        worryLevel %= worryReducer;
        const isDivisible = worryLevel % monkey.testDivisibleBy === 0;
        const newMonkeyNumber = isDivisible ? monkey.ifTrue : monkey.ifFalse;
        monkey.startingItems = monkey.startingItems.slice(1);
        monkeys[newMonkeyNumber].startingItems.push(worryLevel);
        monkey.inspectionCount++;
      });
    });
    if (specialRounds.includes(round)) {
        console.log(round, monkeys.map(m => m.inspectionCount));
    }
  }

  return (
    monkeys
      // I only care about the inspectionCount, so transform this array into array of those
      .map((m) => m.inspectionCount)
      // sort descending
      .sort((a, b) => b - a)
      // take first two items in the array
      .slice(0, 2)
      // reduce to single value by multiplying them together (1 is the starting value for the multiplication)
      .reduce((prev, curr) => prev * curr, 1)
  );
}
