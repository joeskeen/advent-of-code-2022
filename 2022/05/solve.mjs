function parseInput(lines) {
  const stacks = [];
  let lineIndex = 0;
  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    if (line.charAt(1) === "1") {
      break;
    }

    for (let i = 1; i < line.length; i += 4) {
      const stackIndex = Math.floor(i / 4) + 1;
      const char = line.charAt(i);
      if (char !== " ") {
        if (!stacks[stackIndex]) {
          stacks[stackIndex] = [];
        }
        stacks[stackIndex].push(char);
      }
    }
    lineIndex++;
  }
  stacks.forEach((s) => s.reverse());

  lineIndex += 2;
  const commands = [];
  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    const segments = line.split(" ");
    commands.push({
      amount: +segments[1],
      source: +segments[3],
      destination: +segments[5],
    });
    lineIndex++;
  }

  return {
    stacks,
    commands,
  };
}

export function solve1(lines) {
  const { stacks, commands } = parseInput(lines);

  commands.forEach((command) => {
    for (let i = 0; i < command.amount; i++) {
      const crate = stacks[command.source].pop();
      stacks[command.destination].push(crate);
    }
  });

  let answer = [];
  stacks.forEach((s) => {
    answer.push(s[s.length - 1]);
  });

  return answer.join("");
}

export function solve2(lines) {
  const { stacks, commands } = parseInput(lines);

  commands.forEach((command) => {
    const stagingArea = [];
    for (let i = 0; i < command.amount; i++) {
      const crate = stacks[command.source].pop();
      stagingArea.push(crate);
    }
    stagingArea
      .reverse()
      .forEach((crate) => stacks[command.destination].push(crate));
  });

  let answer = [];
  stacks.forEach((s) => {
    answer.push(s[s.length - 1]);
  });

  return answer.join("");
}
