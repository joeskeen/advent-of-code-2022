export function solve1(lines) {
    const input = lines[0].split('');
    for(let i = 4; i < input.length; i++) {
        const last4 = input.slice(i - 4, i);
        const duplicate = last4.find((value, index) => last4.indexOf(value) !== index);
        if (!duplicate) {
            return i;
        }
    }
}
export function solve2(lines) {
    const n = 14
    const input = lines[0].split('');
    for(let i = n; i < input.length; i++) {
        const lastN = input.slice(i - n, i);
        const duplicate = lastN.find((value, index) => lastN.indexOf(value) !== index);
        if (!duplicate) {
            return i;
        }
    }
}