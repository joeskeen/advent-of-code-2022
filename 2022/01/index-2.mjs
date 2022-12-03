import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString();

const lines = input.split(/\r?\n/g).map(line => line === "" ? null : +line);

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
elfCalories.sort((a,b) => b - a);
const top3 = elfCalories.slice(0,3);
const sum = top3.reduce((prev, curr) => prev + curr, 0);
console.log(sum);
