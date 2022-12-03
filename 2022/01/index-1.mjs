import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString();

const lines = input.split(/\r?\n/g).map(line => line === "" ? null : +line);

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

console.log(maxElfCalories);
