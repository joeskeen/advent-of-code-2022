export function solve1(lines) {
    const options = {
        A: 'ROCK',
        B: 'PAPER',
        C: 'SCISSORS',
        X: 'ROCK',
        Y: 'PAPER',
        Z: 'SCISSORS'
    };
    const scores = {
        // shapes
        ROCK: 1,
        PAPER: 2,
        SCISSORS: 3,
        // outcomes
        LOSE: 0,
        DRAW: 3,
        WIN: 6
    }
    // parse the input into opponent move and your move
        // split the line by space
        // map the first character
        // map the second character
    const moves = lines.map(l => l.split(' ')).map(l => ({ 
        opponenet: options[l[0]], 
        you: options[l[1]]
    }))
    
    // score starts at 0
    let score = 0;
    // walk through each of the rounds
    moves.forEach(m => {
        // simulate the result
        let outcome; // WIN or LOSE or DRAW
        if (m.opponenet === m.you) {
            outcome = 'DRAW';
        } else if (
            (m.opponenet === 'ROCK' && m.you === 'PAPER') ||
            (m.opponenet === 'PAPER' && m.you === 'SCISSORS') ||
            (m.opponenet === 'SCISSORS' && m.you === 'ROCK')
        ) {
            outcome = 'WIN';
        } else {
            outcome = 'LOSE';
        }
        
        // update the score
        const roundScore = scores[m.you] + scores[outcome];
        score += roundScore;
    });

    return score;
}

export function solve2(lines) {
    const options = {
        A: 'ROCK',
        B: 'PAPER',
        C: 'SCISSORS'
    };
    const desiredOutcome = {
        X: 'LOSE',
        Y: 'DRAW',
        Z: 'WIN'
    }
    const scores = {
        // shapes
        ROCK: 1,
        PAPER: 2,
        SCISSORS: 3,
        // outcomes
        LOSE: 0,
        DRAW: 3,
        WIN: 6
    }
    // parse the input into opponent move and your move
        // split the line by space
        // map the first character
        // map the second character
    const rounds = lines.map(l => l.split(' ')).map(l => ({ 
        opponenet: options[l[0]], 
        outcome: desiredOutcome[l[1]]
    }));
    
    // score starts at 0
    let score = 0;
    // walk through each of the rounds
    rounds.forEach(m => {
        // simulate the result
        let shape; // ROCK or PAPER or SCISSORS
        if (
            (m.opponenet === 'ROCK' && m.outcome === 'DRAW') ||
            (m.opponenet === 'PAPER' && m.outcome === 'LOSE') ||
            (m.opponenet === 'SCISSORS' && m.outcome === 'WIN')
        ) {
            shape = 'ROCK';
        } else if (
            (m.opponenet === 'ROCK' && m.outcome === 'WIN') ||
            (m.opponenet === 'PAPER' && m.outcome === 'DRAW') ||
            (m.opponenet === 'SCISSORS' && m.outcome === 'LOSE')
        ) {
            shape = 'PAPER';
        } else {
            shape = 'SCISSORS';
        }
        
        
        // update the score
        const roundScore = scores[shape] + scores[m.outcome];
        score += roundScore;
        // console.log({
        //     shape,
        //     shapeScore: scores[shape],
        //     outcomeScore: scores[m.outcome],
        //     roundScore,
        //     score
        // });
    });

    return score;
}
