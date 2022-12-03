const isLowercase = (char) => char.toLowerCase() === char;
const lowercaseA = 1;
const lowercaseDifferential = 'a'.charCodeAt(0) - lowercaseA;
const uppercaseA = 27;
const uppercaseDifferential = 'A'.charCodeAt(0) - uppercaseA;
const getValue = (char) => {
    const charCode = char.charCodeAt(0);
    if (isLowercase(char)) {
        return charCode - lowercaseDifferential;
    } else {
        return charCode - uppercaseDifferential;
    }
}

export function solve1(lines) {
    let sum = 0;

    lines.forEach(line => {
        const chars = line.split('');
        const compartment1 = chars.slice(0, chars.length / 2);
        const compartment2 = chars.slice(chars.length / 2);
    
        const inBoth = compartment1.find(char => {
            return compartment2.includes(char);
        });
        const value = getValue(inBoth);
        sum += value;
    });

    return sum;
}

export function solve2(lines) {
    let total = 0;
    for (let i = 0; i < lines.length; i += 3) {
        const rucksacks = lines.slice(i, i + 3);
        const firstRucksackChars = rucksacks[0].split('');
        const sharedItem = firstRucksackChars.find((char) => {
            return rucksacks[1].includes(char) && rucksacks[2].includes(char);
        });
        total += getValue(sharedItem);
    }
    return total;
}
