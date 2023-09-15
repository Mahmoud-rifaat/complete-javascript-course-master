'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Mahmoud Refaat',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const mov_type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${mov_type}">${
      i + 1
    } ${mov_type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${Math.abs(mov)}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((accum, mov) => accum + mov);
  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interests = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest);
  labelSumInterest.textContent = `${interests.toFixed(2)}€`;
};

const createUserNames = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .reduce((accum, curr) => accum + curr[0], '');
  });
};
createUserNames(accounts);

//Update UI function:
const updateUI = function (account) {
  //Display Movements
  displayMovements(account);

  //Display Balance
  calcDisplayBalance(account);

  //Display Summary
  calcDisplaySummary(account);
};

//Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting.
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  //if the credentials are correct:
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //makes the field loses its focus.

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = inputTransferAmount.value;
  const recipientAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recipientAcc &&
    recipientAcc.userName !== currentAccount.userName
  ) {
    //Doing the transfer:
    currentAccount.movements.push(-amount);
    recipientAcc.movements.push(amount);
    //Updating the UI:
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Doing the loan
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const userName = inputCloseUsername.value;
  const userPin = Number(inputClosePin.value);

  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();

  if (userName === currentAccount.userName && userPin === currentAccount.pin) {
    const accIndex = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    //Delete account from accounts array:
    accounts.splice(accIndex, 1);
    //Logging out:
    //Display sign in UI and a login message
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let arr = [23, 11, 64];



//Coding Challenge #1
//Julia's data 
let data1_julia = [3, 5, 2, 12, 7]
//Kate's data 
let data1_kate = [4, 1, 15, 8, 3]


//Julia's data
let data2_julia = [9, 16, 6, 8, 3]
//Kate's data
let data2_kate = [10, 5, 6, 1, 4]

const checkDogs = function(dogsJulia, dogsKate){
  let correctedDogsJulia = dogsJulia.slice(1,-2);
  
  let correctedDogs = [...correctedDogsJulia, ...dogsKate];

  correctedDogs.forEach(function(dog, i){
    const text = dog >= 3 ? `an adult, and is ${dog} years old.` : 'still a puppy 🐕';
    console.log(`Dog number ${i + 1} is ${text}`);
  });
};


checkDogs(data1_julia, data1_kate);
console.log('-------------------------------');
checkDogs(data2_julia, data2_kate);



//Map method
const eurToUsd = 1.1;
const movementsUDS = account1.movements.map(mov => mov * eurToUsd);
console.log(account1.movements);
console.log(movementsUDS);


//filter method
const deposits = account1.movements.filter(function(mov){
  return mov > 0;
});

console.log(deposits);

const withdrawals = account1.movements.filter(mov => mov < 0);

console.log(withdrawals);



//reduce method
const movements = account1.movements;
const calcMaximum = function(movements){
  return movements.reduce((accum, curr) => curr > accum ? curr : accum);
};
console.log(calcMaximum(movements));


//Coding challenge #2

const calcAverageHumanAge = function(ages){
  const humanAges = ages.map(dogAge => dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4);

  const adultHumanAges = humanAges.filter(humanAge => humanAge >= 18);

  const averageHumanAge = adultHumanAges.reduce((sum, humanAge) => sum + humanAge, 0) / adultHumanAges.length;

  return averageHumanAge;
};

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

console.log(calcAverageHumanAge(data1));
console.log(calcAverageHumanAge(data2));


//Coding challenge #3
const calcAverageHumanAge = ages => ages
.map(dogAge => dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4)
.filter(humanAge => humanAge >= 18)
.reduce((sum, humanAge, i, ages) => sum + humanAge / ages.length, 0);

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

console.log(calcAverageHumanAge(data1));
console.log(calcAverageHumanAge(data2));


//array.find method

const firstWithdrawal = account1.movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
//using for of loop
let accountForOf;
for(let acc of accounts){
  if(acc.owner === 'Jessica Davis'){
    accountForOf = acc;
    break;
  } 
}
console.log(accountForOf);


//SOME: Conditional check(if theres any..)
console.log(account1.movements.some(mov => mov > 0));

//EVERY(IFF all is..)
console.log(account4.movements.every(mov => mov > 0));


//flat
const arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
console.log(arr.flat());

//flat with depth argument
const arr2 = [[[1, 2], 3], [4, [5, 6]], [7, 8, 9]];
console.log(arr2.flat(2));

//calculating the total balance for all accounts
const totalBalance = accounts
.map(acc => acc.movements)
.flat()
.reduce((accum, curr) => accum + curr);
console.log(totalBalance);

//flatMap
const totalBalance2 = accounts
.flatMap(acc => acc.movements)
.reduce((accum, curr) => accum + curr);
console.log(totalBalance2);


//empty arrays + fill method
const x = new Array(7); //create an empty array of 7 empty elements.
x.fill(1); //fills the array with ones.
x.fill(23, 2, 6);


//Array.from
const y = Array.from({length: 7}, () => 1);
console.log(y);

const z = Array.from({length: 7}, (_, i) => i + 1);
console.log(z);

const oneHundredDiceRolls = Array.from({length: 100}, a => Math.floor(Math.random() * 6) + 1);
console.log(oneHundredDiceRolls);



//creating an array from a nodeList along with using a mapping function:
//reading movements from the UI itself.
labelBalance.addEventListener('click', function(){
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), element => element.textContent.replace('€', ''));

  console.log(movementsUI);
});


//Array methods practice:

//1. how much been deposited in total in the bank?
const totalBankDeposits = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((accum, curr) => accum + curr, 0);
console.log(totalBankDeposits);

//2. How many deposits there have been into the bank with at least 1000 dollars:
const numDeposits1000 = accounts.flatMap(acc => acc.movements).reduce((count, curr) => curr >= 1000 ? count + 1 : count, 0);
console.log(numDeposits1000);

//3. Create a new object which contains the sum of the deposits and of the withdrawals:
const sumObject = accounts.flatMap(acc => acc.movements).reduce((sums, curr) => {
  //curr > 0 ? sums.deposits += curr : sums.withdrawals += curr;
  sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
  return sums;
}, {deposits: 0, withdrawals: 0});
console.log(sumObject);

//4. create a simple function to convert any string to Title Case.
const convertToTitleCase = function(str){
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  return str.toLowerCase().split(' ').map(word => exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)).join(' ');
}
console.log(convertToTitleCase('this is a nice title'));
console.log(convertToTitleCase('this is a LONG title but not too long'));
console.log(convertToTitleCase('and here is anoter title with an EXAMPLE'));
*/

//Coding challenge #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1.
dogs.forEach(dog => {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);

//2.
// function for checking how much a dog eats.
const dogEats = dog =>
  dog.curFood > dog.recommendedFood * 1.1
    ? 'too much'
    : dog.curFood < dog.recommendedFood * 0.9
    ? 'too little'
    : dog.curFood === dog.recommendedFood
    ? 'exactly'
    : 'okay';

const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(`Sarah\'s dog is eating ${dogEats(sarahsDog)}`);

//3.
const ownersEatTooMuch = dogs
  .filter(dog => dogEats(dog) === 'too much')
  .flatMap(dog => dog.owners);
const ownersEatTooLittle = dogs
  .filter(dog => dogEats(dog) === 'too little')
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

//4.
console.log(`${ownersEatTooMuch.flat().join(' and ')}'s dogs eat too much!`);
console.log(
  `${ownersEatTooLittle.flat().join(' and ')}'s dogs eat too little!`
);

//5.
console.log(dogs.some(dog => dogEats(dog) === 'exactly') ? 'true' : 'false');

//6.
console.log(dogs.some(dog => dogEats(dog) === 'okay') ? 'true' : 'false');

//7.
const dogsEatingOkay = dogs.filter(dog => dogEats(dog) === 'okay');
console.log(dogsEatingOkay);

//8.
const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);
