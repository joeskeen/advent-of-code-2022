function parseInput(lines) {
  const data = lines
    .map((line) => {
      const pattern =
        /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ((?:\w+(?:, )?)+)$/;
      const match = pattern.exec(line);
      return {
        valve: match[1],
        flowRate: +match[2],
        tunnels: match[3].split(", "),
      };
    })
    .reduce((prev, curr) => {
      prev[curr.valve] = curr;
      return prev;
    }, {});
  Object.keys(data).forEach((valveName) => {
    const valve = data[valveName];
    valve.tunnels = valve.tunnels.map((v) => data[v]);
  });
  return data;
}

function getBestFlow(startNode, timeRemaining, openedValves, previousNodes) {
  if (timeRemaining <= 0) {
    return {
      description: `out of time`,
      flowAchieved: 0,
      nowIn: startNode,
      timeRemaining: 0,
      openedValves: openedValves,
      journey: [...previousNodes, startNode.valve],
    };
  }

  // two options:
  // 1. open the valve in the current room then move
  // 2. don't open the valve in the current room then move
  // if you open the valve in the current room you waste 1 minute

  const options = [wait(timeRemaining), move(timeRemaining, openedValves)];
  if (startNode.flowRate > 0 && !openedValves.includes(startNode.valve)) {
    options.push(openAndMove());
  }
  options.sort((a, b) => b.flowAchieved - a.flowAchieved);

  return options[0];

  function openAndMove() {
    const result = open();
    const nextResult = move(result.timeRemaining, result.openedValves);
    return {
      description: `open ${startNode.valve} and move to ${nextResult.nowIn.valve}`,
      flowAchieved: result.flowAchieved + nextResult.flowAchieved,
      nowIn: nextResult.nowIn,
      timeRemaining: nextResult.timeRemaining,
      openedValves: nextResult.openedValves,
      journey: [...nextResult.journey, nextResult.nowIn.valve],
    };
  }

  function open() {
    let afterOpenTimeRemaining = timeRemaining - 1;
    const valvesOpenedNow = [...openedValves, startNode.valve];
    const flowAmount = startNode.flowRate * afterOpenTimeRemaining;
    return {
      description: `open ${startNode.valve}`,
      flowAchieved: flowAmount,
      nowIn: startNode,
      timeRemaining: afterOpenTimeRemaining,
      openedValves: valvesOpenedNow,
      journey: [...previousNodes, startNode.valve],
    };
  }

  function move(timeRemaining, openedValves) {
    let afterMoveTimeRemaining = timeRemaining - 1;
    const nextOptions = startNode.tunnels
      .filter((r) => {
        const previousTrips = previousNodes.filter((n) => n === r.valve).length;
        const neighborCount = r.tunnels.length;
        return previousTrips < neighborCount;
      })
      .map((t) =>
        getBestFlow(t, afterMoveTimeRemaining, openedValves, [
          ...previousNodes,
          startNode.valve,
        ])
      )
      .sort((a, b) => b.flowAchieved - a.flowAchieved);
    
    const bestOption = nextOptions[0];
    return bestOption
      ? {
          ...bestOption,
          journey: [...bestOption.journey, bestOption.nowIn.valve],
        }
      : wait(timeRemaining);
  }

  function wait(timeRemaining) {
    return {
      description: `wait in ${startNode.valve}`,
      flowAchieved: 0,
      nowIn: startNode,
      timeRemaining: timeRemaining - 1,
      openedValves: openedValves,
      journey: [...previousNodes, startNode.valve],
    };
  }
}

export function solve1(lines) {
  const graph = parseInput(lines);
  const openedValves = [];

  // const bestOption = getBestFlow(graph.AA, 30, openedValves, []);
  // console.log(bestOption);
  // return bestOption.flowAchieved;
  
  const mermaidMarkup = generateMermaid(graph);
  import('fs').then(fs=> fs.writeFileSync('graph.mermaid', mermaidMarkup));
}

function generateMermaid(graph) {
  const header = "flowchart LR";
  const mermaidLines = [header];
  Object.keys(graph)
    .sort((a, b) => a.localeCompare(b))
    .map((k) => graph[k])
    .forEach((n) => {
      mermaidLines.push(`\t${n.valve}(${n.valve}: ${n.flowRate})`);
      n.tunnels
        .filter((t) => t.valve.localeCompare(n.valve) > 0)
        .forEach((t) => mermaidLines.push(`\t${n.valve} --- ${t.valve}`));
    });
  return mermaidLines.join("\n");
}

export function solve2(lines) {}
