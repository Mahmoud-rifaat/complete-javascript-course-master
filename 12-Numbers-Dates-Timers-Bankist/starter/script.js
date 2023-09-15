'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Mahmoud Refaat',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-06-09T17:01:17.194Z',
    '2023-06-11T23:36:17.929Z',
    '2023-06-12T10:51:36.790Z',
  ],
  currency: 'EGP',
  locale: 'ar-SY', // de-DE or pt-PT
};

const account2 = {
  owner: 'jonas schmedtman',
  movements: [3000, 700, -250, 700, -3210, -1000, 850, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-06-09T18:49:59.371Z',
    '2023-06-11T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account3 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.3,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-06-09T18:49:59.371Z',
    '2023-06-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
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

///////////////////////////////////////////////////
//Functions

const formatMovementDate = function(date, locale){
  //a separate function to calculate the days difference between two days.
  const calcDaysPassed = (date1, date2) => 
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;

  /*
  //date formatting manually
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
  */

  //internationalization for date format:
  return new Intl.DateTimeFormat(locale).format(date);
}

//internationalization for currency format:
const formatCurrency = (value, locale, currency) => 
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);


const displayMovements = function(account, sort = false){
  containerMovements.innerHTML = '';

  const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;

  movs.forEach(function(mov, i){
    const mov_type = mov > 0 ? 'deposit' : 'withdrawal';
    
    const movDate = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(movDate, account.locale);

    const formattedMov = formatCurrency(mov, account.locale, account.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${mov_type}">${i + 1} ${mov_type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;

      containerMovements.insertAdjacentHTML('afterbegin', html);  
  });
  
}

const calcDisplayBalance = function(account){
  account.balance = account.movements.reduce((accum, mov) => accum + mov);

  const formattedBalance = formatCurrency(account.balance, account.locale, account.currency);

  labelBalance.textContent = `${formattedBalance}`;
}

const calcDisplaySummary = function(account){
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, account.locale, account.currency);

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(Math.abs(outcomes), account.locale, account.currency);

  const interests = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest);
  labelSumInterest.textContent = formatCurrency(interests, account.locale, account.currency);
}


const createUserNames = function(accs){
  accs.forEach((acc) => {
    acc.userName = acc.owner.toLowerCase()
    .split(' ')
    .reduce((accum, curr) => accum + curr[0], '');
  });
}
createUserNames(accounts);

//Update UI function:
const updateUI = function(account){
  //Display Movements
  displayMovements(account);

  //Display Balance
  calcDisplayBalance(account);

  //Display Summary
  calcDisplaySummary(account);
}

//A function to set a logout timer
const startLogOutTimer = function(){
  const tick = function(){
    //In each call, print the remaining time to UI
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;

    //When 0 second, stop timer and log out user
    if(time === 0){
      clearInterval(timer);
      currentAccount = null;
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //decrement time by 1 sec
    --time;
  }
  //Set time to 5 minutes
  let time = 300;
  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}


let currentAccount, timer;

//Event handlers

btnLogin.addEventListener('click', function(e){
  //Prevent form from submitting.
  e.preventDefault();
  
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);

  //if the credentials are correct:
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    //Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }
    //const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now); //creates a new formatter then uses it
    
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value ='';
    inputLoginPin.blur(); //makes the field loses its focus.
    
    //Timer
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const recipientAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if(amount > 0 &&
    currentAccount.balance >= amount &&
    recipientAcc &&
    recipientAcc.userName !== currentAccount.userName){
      //Doing the transfer:
      currentAccount.movements.push(-amount);
      recipientAcc.movements.push(amount);
      //Adding transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      recipientAcc.movementsDates.push(new Date().toISOString());
      //Updating the UI:
      updateUI(currentAccount);
    }

    //Reset the timer:
    clearInterval(timer);
    timer = startLogOutTimer();
});

btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    setTimeout(function(){
      //Doing the loan
      currentAccount.movements.push(amount);
      //Adding loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      //Update UI
      updateUI(currentAccount);
    }, 2500);
  }

  //Reset the timer:
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  const userName = inputCloseUsername.value;
  const userPin = Number(inputClosePin.value);

  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();

  if(userName === currentAccount.userName &&
  userPin === currentAccount.pin){
    const accIndex = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    //Delete account from accounts array:
    accounts.splice(accIndex, 1);
    //Logging out:
    //Display sign in UI and a login message
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }

});

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
//In javascript numbers are represented internally as floating point numbers
console.log(23 === 23.0);
//Base 10 (0 to 9). 1/10 = 0.1 , 3/10 = 3.33333333
console.log(0.1 + 0.2);   //0.3333333333333334
console.log(0.1 + 0.2 === 0.3); //some error in js that we have to accept!

//Conversion
console.log(Number('23'));
//OR
console.log(+'23');

//Parsing
console.log(Number.parseInt('30px')); //30
console.log(Number.parseInt('e23')); // NAN
console.log(parseFloat('  2.5rem '));

//IsFinite function is the best way to check whether a value is a number

//Random number generation
//traditional
console.log(Math.trunc(Math.random() * 6 + 1));
//Best practice for range generation
const randomInt = (min, max) => Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(3,7));

//Remainder operator:
labelBalance.addEventListener('click', function(){
  [...document.querySelectorAll('.movements__row')].forEach(function(row, i){
    if(i % 2 === 0){
      row.style.backgroundColor = 'blue';
      console.log('ok');
    }
  });
});


//Big int
console.log(1888888888888888888888888888888888n);
console.log(BigInt(1888888888888888888888888888888888));
//You cannot mix Big int numbers with normal numbers!

//Dates
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2023, 5, 12, 7, 21, 53));


//Operations on dates:

//using number function on dates converts dates to milliseconds:
const future = new Date(2037, 10, 19, 15, 23);
console.log(Number(future));
console.log(+future);

const calcDaysPassed = (date1, date2) => 
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 14),
new Date(2037, 3, 4)
);
console.log(days1);


//Internationalizing numbers:
const num = 3884764.23;

const options = {
  style: 'currency',
  currency: 'USD'
}

console.log('US: ', new Intl.NumberFormat('en-Us', options).format(num));
console.log('Germany: ',new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria: ',new Intl.NumberFormat('ar-EG', options).format(num));


//Timers:
//setTimeout:
const ingredients = ['olives', 'spinach'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is you pizza with ${ing1} and ${ing2} 🍕`)
  , 3000, ...ingredients);
console.log('Waiting...');

//Clearing the timeout:
if(ingredients.includes('spinach')) clearTimeout(pizzaTimer);

//setInterval
setInterval(function(){
  const now = new Date();
  console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
}, 1000);
*/