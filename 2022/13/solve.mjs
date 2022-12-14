function isInOrder(left, right) {
    for(let i = 0; i < left.length; i++) {
        let leftVal = left[i];
        let rightVal = right[i];

        // if the right list runs out first, they are not in order
        if (rightVal === undefined) {
            return false;
        }

        // if they are both numbers
        if (typeof leftVal === 'number' && typeof rightVal === 'number') {
            // if they are the same value, keep going
            if (leftVal === rightVal) {
                continue;
            } else {
                // otherwise the left needs to be smaller than the right
                return leftVal < rightVal;
            }
        } 
        
        // if we are dealing with arrays, we need to do a recursive call with the inner arrays
        let result;
        if (Array.isArray(leftVal) && Array.isArray(rightVal)) {
            result = isInOrder(leftVal, rightVal)
        } else if (Array.isArray(leftVal)) {
            // if right isn't an array, we wrap it in one
            result = isInOrder(leftVal, [rightVal])
        } else {
            // if left isn't an array, we wrap it in one
            result = isInOrder([leftVal], rightVal);
        }

        // undefined means keep going
        if (result === undefined) {
            continue;
        } else {
            // if the order is known return it
            return result;
        }
    }

    // if we have gotten this far and the lists are the same length, keep going
    if (left.length === right.length) {
        return undefined;
    } else {
        // otherwise the left list must be smaller
        return left.length < right.length;
    }
}

export function solve1(lines){
    const pairs = [];
    for(let i = 0; i < lines.length; i+=3) {
        const left = JSON.parse(lines[i]);
        const right = JSON.parse(lines[i + 1]);
        pairs.push({left, right});
    }
    
    let sum = 0;
    for(let i = 1; i <= pairs.length; i++) {
        const pair = pairs[i-1];
        const result = isInOrder(pair.left, pair.right);
        if (result) {
            sum += i;
        }
    }

    return sum;
}
export function solve2(lines){
    const input = lines.filter(l => l !== '').map(JSON.parse);
    const dividerA = [[2]];
    const dividerB = [[6]];

    const sorted = [...input, dividerA, dividerB].sort((a,b) => {
        // sort works by having you return an integer that tells it where a should be compared to b
        // if a is before, return -1
        // if b is before, return 1
        // if they are the same, return 0
        const result = isInOrder(a,b);
        if (result === undefined) {
            return 0;
        } else if (result) {
            return -1;
        } else {
            return 1;
        }
    });

    const indexA = sorted.indexOf(dividerA);
    const indexB = sorted.indexOf(dividerB);
    
    return (1 + indexA) * (1 + indexB);
}