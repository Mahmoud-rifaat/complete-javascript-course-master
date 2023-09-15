'use strict';

const game = {
    team1: 'Bayern Munich',
    team2: 'Borrussia Dortmund',
    players: [
        [
            'Neuer',
            'Pavard',
            'Martinez',
            'Alaba',
            'Davies',
            'Kimmich',
            'Goretzka',
            'Coman',
            'Muller',
            'Gnarby',
            'Lewandowski',
        ],
        [
            'Burki',
            'Schulz',
            'Hummels',
            'Akanji',
            'Hakimi',
            'Weigl',
            'Witsel',
            'Hazard',
            'Brandt',
            'Sancho',
            'Gotze',
        ],
    ],
    score: '4:0',
    scored: ['Lewandowski', 'Gnarby', 'Lewandowski',
    'Hummels'],
    date: 'Nov 9th, 2037',
    odds: {
        team1: 1.33,
        x: 3.25,
        team2: 6.5,
    },
};


//Challange 1:
console.log('*** Challange 1***');
//1.  player arrays
const [players1, players2] = game.players;

//2. Bayern Munich (team 1)
const [gk, ...fieldPlayers] = players1;

//3. allPlayers array
const allPlayers = [...players1, ...players2];

//4.
const players1Final = [...players1, 'Thiago', 'Coutinho', 'Perisic'];

//5. 
let {team1, x, team2} = game.odds;
console.log(team1, x, team2);

//6. function printGoals
function printGoals(...args){
    for(const arg of args)
        console.log(arg);
    console.log(args.length);
}
printGoals('Davies', 'Muller', 'Lewandowski', 'Kimmich');
printGoals(...game.scored);


//7. the team with the lower odd:
team1 < team2 && console.log('Team1 is more likely to win');
team1 > team2 && console.log('Team2 is more likely to win');


//Challange 2:
console.log("*** Challange 2 ***");

//1. goals with name of player.
for(const [goalNumber, player] of game.scored.entries()){
    console.log(`Goal ${goalNumber + 1}: ${player}`);
}

//2. Average odd.
let sum = 0;
for(const odd of Object.values(game.odds)){
    sum += odd;
}
console.log(`The average odd is: ${sum / game.odds.length}`);

//3. The odds with team names.
for(const key of Object.keys(game.odds)){
    console.log(`Odd of  ${game[key] ? ('victory ' + game[key]): 'draw'}: ${game.odds[key]}`);
}

//4. creating scorers obj:
const scorers = {};

for(const scorer of game.scored){
    scorers[scorer]++ || (scorers[scorer] = 1);
}

console.log(scorers);

// Coding Challenge #3

const gameEvents = new Map([
    [17, '⚽️ GOAL'],
    [36, '🔁 Substitution'],
    [47, '⚽️ GOAL'],
    [61, '🔁 Substitution'],
    [64, '🔶 Yellow card'],
    [69, '🔴 Red card'],
    [70, '🔁 Substitution'],
    [72, '🔁 Substitution'],
    [76, '⚽️ GOAL'],
    [80, '⚽️ GOAL'],
    [92, '🔶 Yellow card'],
  ]);
/* 
Let's continue with our football betting app! This time, we have a map with a log of the events that happened during the game. The values are the events themselves, and the keys are the minutes in which each event happened (a football game has 90 minutes plus some extra time).

1. Create an array 'events' of the different game events that happened (no duplicates)
2. After the game has finished, it was found that the yellow card from minute 64 was unfair. So remove this event from the game events log.
3. Print the following string to the console: "An event happened, on average, every 9 minutes" (keep in mind that a game has 90 minutes)
4. Loop over the events and log them to the console, marking whether it's in the first half or second half (after 45 min) of the game, like this:
      [FIRST HALF] 17: ⚽️ GOAL

GOOD LUCK 😀
*/

//1. array of events with no duplicates:
const arr = new Set(gameEvents.values());
console.log(arr);

//2. remove yellow card at minute 64 from game log:
gameEvents.delete(64);
console.log(gameEvents);

//3.whatever..

//4.
for(const [min, event] of gameEvents.entries()){
    let eventStr = (min <= 45) ? '[FIRST HALF]' : '[SECOND HALF]';
    eventStr += ` ${min}: ${event}`;
    console.log(eventStr);
}

  

