function parseInput(lines) {
  const data = lines
    .map((line) => {
      const pattern =
        /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ((?:\w+(?:, )?)+)$/;
      const match = pattern.exec(line);
      return {
        valve: match[1],
        flowRate: +match[2],
        tunnels: match[3]
          .split(", ")
          .map((valve) => ({ neighbor: valve, cost: 1 })),
      };
    })
    .reduce((prev, curr) => {
      prev[curr.valve] = curr;
      return prev;
    }, {});
  Object.keys(data).forEach((valveName) => {
    const valve = data[valveName];
    valve.tunnels = valve.tunnels.map((n) => ({
      ...n,
      neighbor: data[n.neighbor],
    }));
  });
  Object.keys(data).forEach((valveName) => {
    const node = data[valveName];
    if (node.flowRate === 0 && node.tunnels.length === 2) {
      // remove this node, connect its neighbors with added cost
      const tunnelA = node.tunnels[0];
      const tunnelB = node.tunnels[1];

      tunnelA.neighbor.tunnels = tunnelA.neighbor.tunnels.filter(
        (t) => t.neighbor !== node
      );
      tunnelA.neighbor.tunnels.push({
        cost: tunnelA.cost + tunnelB.cost,
        neighbor: tunnelB.neighbor,
      });

      tunnelB.neighbor.tunnels = tunnelB.neighbor.tunnels.filter(
        (t) => t.neighbor !== node
      );
      tunnelB.neighbor.tunnels.push({
        cost: tunnelB.cost + tunnelB.cost,
        neighbor: tunnelA.neighbor,
      });

      delete data[valveName];
    }
  });
  return data;
}

function getBestFlow(startNode, timeRemaining, openedValves, previousNodes) {
  if (timeRemaining <= 0) {
    return {
      description: `out of time`,
      flowAchieved: [{ amount: 0 }],
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
  options.sort(
    (a, b) =>
      b.flowAchieved.reduce((prev, curr) => prev + curr.amount, 0) -
      a.flowAchieved.reduce((prev, curr) => prev + curr.amount, 0)
  );

  if (
    options.find((o) =>
      o.openedValves.join(",").startsWith("DD,BB,JJ,HH,EE,CC")
    )
  ) {
    console.log(
      JSON.stringify(
        options
          .filter((o) => o.flowAchieved.length > 1)
          .map((o) => ({ ...o, nowIn: o.nowIn.valve })),
        null,
        2
      )
    );
    console.log(
      options.find((o) =>
        o.openedValves.join(",").startsWith("DD,BB,JJ,HH,EE,CC")
      )
    );
  }

  return options[0];

  function openAndMove() {
    const result = open();
    const nextResult = move(result.timeRemaining, result.openedValves);
    return {
      description: `open ${startNode.valve} and move to ${nextResult.nowIn.valve}`,
      flowAchieved: [...result.flowAchieved, ...nextResult.flowAchieved],
      nowIn: nextResult.nowIn,
      timeRemaining: nextResult.timeRemaining,
      openedValves: nextResult.openedValves,
      journey: [...nextResult.journey, nextResult.nowIn.valve],
    };
  }

  function open() {
    let afterOpenTimeRemaining = timeRemaining - 1;
    const valvesOpenedNow = [...openedValves, startNode.valve];
    const flow = {
      valve: startNode.valve,
      rate: startNode.flowRate,
      timeOpen: afterOpenTimeRemaining,
      amount: startNode.flowRate * afterOpenTimeRemaining,
    };
    return {
      description: `open ${startNode.valve}`,
      flowAchieved: [flow],
      nowIn: startNode,
      timeRemaining: afterOpenTimeRemaining,
      openedValves: valvesOpenedNow,
      journey: [...previousNodes, startNode.valve],
    };
  }

  function move(timeRemaining, openedValves) {
    const nextOptions = startNode.tunnels
      .filter((r) => {
        const previousTrips = previousNodes.filter(
          (n) => n === r.neighbor.valve
        ).length;
        const neighborCount = r.neighbor.tunnels.length;
        return previousTrips < neighborCount;
      })
      .map((t) =>
        getBestFlow(t.neighbor, timeRemaining - t.cost, openedValves, [
          ...previousNodes,
          startNode.valve,
        ])
      )
      .sort(
        (a, b) =>
          b.flowAchieved.reduce((prev, curr) => prev + curr.amount, 0) -
          a.flowAchieved.reduce((prev, curr) => prev + curr.amount, 0)
      );

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
      flowAchieved: [{ amount: 0 }],
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

  const bestOption = getBestFlow(graph.AA, 30, openedValves, []);
  console.log(bestOption);
  return bestOption.flowAchieved.reduce((prev, curr) => prev + curr.amount, 0);

  // console.log(graph);
  // const mermaidMarkup = generateMermaid(graph);
  // console.log(mermaidMarkup);
  // import("fs").then((fs) => fs.writeFileSync("graph.mermaid", mermaidMarkup));
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
        .filter((t) => t.neighbor.valve.localeCompare(n.valve) > 0)
        .forEach((t) =>
          mermaidLines.push(`\t${n.valve} ---|${t.cost}| ${t.neighbor.valve}`)
        );
    });
  return mermaidLines.join("\n");
}

export function solve2(lines) {}
