export function solve1(lines) {
    // make sure there is a null at the end so that we will complete the current elf
    lines = [...lines.map(line => line === "" ? null : +line), null];

    let maxElfCalories = 0;
    let thisElfCalories = 0;
    lines.forEach((line) => {
        if(line) {
            thisElfCalories += line;
        } else {
            if (maxElfCalories < thisElfCalories) {
                maxElfCalories = thisElfCalories;
            }
            thisElfCalories = 0;
        }
    });
    
    return maxElfCalories;
}

export function solve2(lines) {
    lines = [...lines.map(line => line === "" ? null : +line), null];

    let elfCalories = [];
    let thisElfCalories = 0;
    lines.forEach((line) => {
        if(line) {
            thisElfCalories += line;
        } else {
            elfCalories.push(thisElfCalories);
            thisElfCalories = 0;
        }
    });

    elfCalories = elfCalories.sort((a,b) => b - a);
    const top3 = elfCalories.slice(0,3);
    const sum = top3.reduce((prev, curr) => prev + curr, 0);
    return sum;
}
