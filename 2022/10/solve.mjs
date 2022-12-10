function parseInput(lines) {
  return lines.map((line) => {
    const parts = line.split(" ");
    return {
      operation: parts[0],
      param: +parts[1],
    };
  });
}

export function solve1(lines) {
  const commands = parseInput(lines);
  const specialCycles = [20, 60, 100, 140, 180, 220];
  let cycleNumber = 0;
  let x = 1;
  let sum = 0;
  const checkCycle = () => {
    if (specialCycles.includes(cycleNumber)) {
      const signalStrength = cycleNumber * x;
      sum += signalStrength;
    }
  };

  commands.forEach((command) => {
    cycleNumber++;
    checkCycle();
    if (command.operation === "addx") {
      cycleNumber++;
      checkCycle();
      x += command.param;
    }
  });

  return sum;
}

export function solve2(lines) {
    const commands = parseInput(lines);
    const specialCycles = [40,80,120,160,200,240];
    let cycleNumber = 0;
    let x = 1;

    const pixels = [];
    const isSpriteVisible = () => {
        const pixelNumber = cycleNumber - 1;
        const pixelColumn = pixelNumber % 40;
        const distance = Math.abs(pixelColumn - x);
        return distance < 2;
    }
    const drawPixel = () => {
        if (isSpriteVisible()) {
            pixels.push('#');
        } else {
            pixels.push('.');
        }
        if (specialCycles.includes(cycleNumber)) {
            pixels.push('\n');
        }
    };

    commands.forEach((command) => {
        cycleNumber++;
        drawPixel();
        if (command.operation === "addx") {
          cycleNumber++;
          drawPixel();
          x += command.param;
        }
      });

    return pixels.join('');
}
