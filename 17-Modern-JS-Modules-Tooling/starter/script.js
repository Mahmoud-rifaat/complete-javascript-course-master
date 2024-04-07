
import 'core-js/actual';
import cloneDeep from './node_modules/lodash-es/cloneDeep.js';
import 'regenerator-runtime/runtime.js' //Polifilling async functions 
// import cloneDeep from 'lodash-es';

class Car {
    constructor(name, speed) {
        this.name = name,
            this.speed = speed
    }

    showSpeed() {
        console.log(`${this.speed} KM/H`)
    }
}

let car1 = new Car('BMW', 200)


const state = {
    cart: [
        {
            product: 'bread',
            quantity: 5
        },
        {
            product: 'pizza',
            quantity: 6
        }
    ],
    user: {
        loggedIn: true
    }
}

const stateClone = Object.assign({}, state);
const stateClone2 = cloneDeep(state);
state.user.loggedIn = false;
console.log(stateClone);
console.log(stateClone2);


if (module.hot) {
    module.hot.accept();
}