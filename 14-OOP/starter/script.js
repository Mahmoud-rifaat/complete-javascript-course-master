'use strict';


// Constructor function
/*
const Person = function(firstName, birthYear){
    // Instance properties
    this.firstName = firstName;
    this.birthYear = birthYear;
};

// What happens when we call a function with the "new" keyword:
// 1. New empty obj is created
// 2. function is called, this = the created obj 
// 3. obj is linked to prototype
// 4. function automatically returns that obj

const jonas = new Person('Jonas', 1991);
console.log(jonas);
console.log(jonas instanceof Person);

// Prototypes
console.log(Person.prototype);

Person.prototype.calcAge = function(){
    console.log(2037 - this.birthYear);
}


jonas.calcAge();

console.log(jonas.__proto__);
console.log(Person.prototype);
console.log(jonas.__proto__ === Person.prototype);
console.log(jonas.__proto__.__proto__ === Object.prototype);
*/
console.log(Function.prototype === Object.__proto__);

Object.prototype.c = 5;

console.log(Function.c);

function User(name, password, joinDate){
    this.name = name;
    this.password = password;
    this.joinDate = joinDate;
};

console.log(User.prototype);

const mainUser = new User('Mahmoud', 'Refaat', '3July');

User.prototype.login = function(){
    console.log(`${this.name} logged in`);
}

console.log(mainUser);
console.log(Object.getPrototypeOf(mainUser));


console.log(Object.getPrototypeOf({}));


// Coding Challenge #1

function Car(make, speed){
    this.make = make; 
    this.speed = speed;
}

Car.prototype.accelerate = function(){
    this.speed += 10;
    console.log(this.speed);
};

Car.prototype.brake = function(){
    this.speed -= 5;
    console.log(this.speed);
};

const car1 = new Car('BMW', 120);
const car2 = new Car('Mercedes', 95);
car1.accelerate();
car1.brake();
car2.accelerate();
car2.brake();
////////////////////////////////

// ES6 Classes:

class PersonCl{
    constructor(fullName, birthYear){
        this.fullName = fullName;
        this.birthYear = birthYear;
    }

    calcAge(){
        console.log(2037 - this.birthYear);
    }

    get age(){
        return 2037 - this.birthYear;
    }

    set fullName(name){
        if(name.includes(' ')) this._fullName = name;
        else alert('This is not a full name!');
    }

    get fullName(){
        return this._fullName;
    }

    static hey(){
        console.log('Hello there 👋');
    }
}

const jessica = new PersonCl('jessica Davis', 1996);
console.log(jessica);
console.log(jessica.age);
jessica.calcAge();

console.log(jessica.fullName);

// 1. Classes are NOT hoisted
// 2. Classes are first-class citizens
// 3. Classes are executed in strict mode

PersonCl.hey();


const PersonProto = {
    calcAge(){
        console.log(2037 - this.birthYear);
    }
};

const steven = Object.create(PersonProto);

///////////////////////////////

const Person = function(firstName, birthYear){
    this.firstName = firstName;
    this.birthYear = birthYear;
};

Person.prototype.calcAge = function(){
    console.log(2037 - this.birthYear);
};


const Student = function(firstName, birthYear, course){
    // //Instead of rewriting the initialization logic.. we call the parent's constructor, but with setting "this" to "this" of our context using call function for binding:
    // this.firstName = firstName;
    // this.birthYear = birthYear;
    Person.call(this, firstName, birthYear);
    this.course = course;
};

// Linking prototypes
Student.prototype = Object.create(Person.prototype);
// console.log("----------------", Student.prototype.__proto__.__proto__); //Right answer should be an object with our Student constructor, "introduce" function, and a reference to "Person" prototype, though chrome and edge mistake in that.
Student.prototype.constructor = Student;

Student.prototype.introduce = function(){
    console.log(`My name is ${this.firstName} and I study ${this.course}`);
}

const mike = new Student('mike', 2020, 'Computer Science');
mike.introduce();
mike.calcAge();

console.log(mike.__proto__);
console.log(mike.__proto__.__proto__);
console.log(mike.__proto__.__proto__.__proto__);



// Coding Challenge #3

function EV(make, speed, charge){
    Car.call(this, make, speed);
    this.charge = charge;
}

EV.prototype = Object.create(Car.prototype);
EV.prototype.constructor = EV;

EV.prototype.chargeBattery = function(chargeTo){
    this.charge = chargeTo;
};

EV.prototype.accelerate = function(){
    this.speed += 20;
    this.charge -= 1;
    console.log(`${this.make} going at ${this.speed} km/h, with a charge of ${this.charge}%`);
}

const t20 = new EV('T20', 180, 85);

console.log(t20);
console.log(t20.__proto__);
console.log(EV.prototype);
console.log(t20.__proto__.__proto__);
console.log(Car.prototype);

t20.chargeBattery(90);
console.log(t20.charge);
t20.brake();
t20.accelerate();
///////////////////////////////////////

class PersonCl2{
    constructor(fullName, birthYear){
        this.fullName = fullName;
        this.birthYear = birthYear;
    }

    calcAge(){
        console.log(2037 - this.birthYear);
    }

    get age(){
        return 2037 - this.birthYear;
    }

    set fullName(name){
        if(name.includes(' ')) this._fullName = name;
        else alert('This is not a full name!');
    }

    get fullName(){
        return this._fullName;
    }

    static hey(){
        console.log('Hello there 👋');
    }
}



class StudentCl extends PersonCl2{
    constructor(fullName, birthYear, course){
        // Always needs to happen first!
        super(fullName, birthYear); //constructor function of the parent class.
        this.course = course;
    }

    introduce(){
        console.log(`My name is ${this.fullName} and I study ${this.course}`);
    }

    //Function overloading
    calcAge(){
        console.log(`I'm ${2037 - this.birthYear} years old, but as a student I feel more like ${2037 - this.birthYear}`);
    }
}

const martha = new StudentCl('Martha Jones', 2012, 'Computer Science');

martha.introduce();
martha.calcAge();



class Account {
    // 1) Public fields (instances)
    locale = navigator.language;
  
    // 2) Private fields (instances)
    #movements = [];
    #pin;
  
    constructor(owner, currency, pin) {
      this.owner = owner;
      this.currency = currency;
      this.#pin = pin;
  
      // Protected property
      // this._movements = [];
      // this.locale = navigator.language;
  
      console.log(`Thanks for opening an account, ${owner}`);
    }
  
    // 3) Public methods
  
    // Public interface
    getMovements() {
      return this.#movements;
    }
  
    deposit(val) {
      this.#movements.push(val);
      return this;
    }
  
    withdraw(val) {
      this.deposit(-val);
      return this;
    }
  
    requestLoan(val) {
      // if (this._approveLoan(val)) {
      if (this.#approveLoan(val)) {
        this.deposit(val);
        console.log(`Loan approved`);
        return this;
      }
    }
  
    static helper() {
      console.log('Helper');
    }
  
    // 4) Private methods
    // _approveLoan(val) {
    #approveLoan(val) {
      return true;
    }
}


const acc1 = new Account('Refaat', 'EGP', 5555);

console.log(acc1);

acc1.deposit(250);
acc1.withdraw(140);
acc1.requestLoan(1000);
console.log(acc1.getMovements());


// Coding Challenge #2

class CarCl{

    constructor(make, speed){
        this.make = make; 
        this.speed = speed;
    }

    accelerate() {
        this.speed += 10;
        console.log(this.speed);
    }

    brake(){
        this.speed -= 5;
        console.log(this.speed);
        return this;
    }

    get speedUS(){
        return this.speed / 1.6;
    }

    set speedUS(speed){
        this.speed = speed * 1.6;
    }
};

const CAR1 = new CarCl('Ford', 120);
CAR1.accelerate();
CAR1.brake();
console.log(CAR1.speedUS);
CAR1.speedUS = 30;
console.log(CAR1.speedUS);
///////////////////////////////////

// Coding Challenge #4


class EVCl extends CarCl{

    // Private properties:
    #charge;


    constructor(make, speed, charge){
        super(make, speed);

        this.#charge = charge;
    }

    chargeBattery(chargeTo){
        this.#charge = chargeTo;
        return this;
    };

    accelerate(){
        this.speed += 20;
        this.#charge -= 1;
        console.log(`${this.make} going at ${this.speed} km/h, with a charge of ${this.#charge}%`);

        return this;
    }

};

const rivian = new EVCl('Rivian', 120, 23);

console.log(rivian);

rivian
    .accelerate()
    .accelerate()
    .accelerate()
    .brake()
    .chargeBattery(50)
    .accelerate();


console.log(rivian.speedUS);