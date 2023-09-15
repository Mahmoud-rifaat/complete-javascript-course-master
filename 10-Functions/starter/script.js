'use strict';

// const lufthansa = {
//     airline: 'Lufthansa',
//     iataCode: 'LH',
//     bookings: [],
//     /*book(flightNum, name){
//         console.log(`${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`);

//         this.bookings.push({flight: `${this.iataCode}${flightNum}`, name});
//     }*/
// };


// const book = function book(flightNum, name){
//     console.log(`${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`);

//     this.bookings.push({flight: `${this.iataCode}${flightNum}`, name});
// };

// //lufthansa.book(239, 'Mahmoud Refaat');
// book.call(lufthansa, 239, 'Mahmoud Refaat');


// const euroWings = {
//     airline: 'Eurowings',
//     iataCode: 'EW',
//     bookings: [],
// }

// book.call(euroWings, 555, 'Doma el ra2as');

const poll = {
    question: 'What is your favourite programming language?',
    options: ['0: JavaScript', '1: Python', '2: Rust', '3:C++'],
    answers: new Array(4).fill(0),
}

function registerNewAnswer (){
    let answer = prompt(`${this.question}\n${this.options.join('\n')}\n(write option number)`);

    if(answer >= 0 && answer <= poll.answers.length)
        this.answers[answer]++;
    else
        alert('Invalid number!');

    const displayResultsOnPoll = displayResults.bind(this);
    displayResultsOnPoll('string');
}


function displayResults(type = 'array'){
    if(type == 'array')
        console.log(this.answers);
    else if(type == 'string')
        console.log(`Poll results are ${this.answers[0]},${this.answers[1]},${this.answers[2]},${this.answers[3]}`);
}

document.querySelector('.poll').addEventListener('click', registerNewAnswer.bind(poll));
