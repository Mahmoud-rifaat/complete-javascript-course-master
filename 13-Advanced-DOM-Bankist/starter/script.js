'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.getElementById('section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault(); //To prevent the default behavior of navigating(jumping) to the top of the page.
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling:

btnScrollTo.addEventListener('click', function(e){

  // Getting the coordinates
  const s1coords = section1.getBoundingClientRect(); //returns some coords of the element relative to the viewport.

  /*
  //(Old School way)
  // Smooth scrolling
  window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: 'smooth'
  });
  */

  //(New way)
  section1.scrollIntoView({behavior: 'smooth'});
});

///////////////////////////////////////
// Page navigation using "Event Delegation"
// 1. Add event listener to a common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  
  // Matching strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function(e){
  e.preventDefault();
  // Using event Delegation
  const clicked = e.target.closest('.operations__tab');

  if(!clicked) return; // Guard clause

  // Remove active classes
  tabs.forEach(function(tab){
    tab.classList.remove('operations__tab--active');
  tabsContent.forEach((content => content.classList.remove('operations__content--active')));
    
  // Activate tab
  clicked.classList.add('operations__tab--active');
  });

  // Active content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


// Menu fade animation
// side note: "mouseenter" doesn't bubble, while "mouseover" does.

const handleHover = function(opacity){
  return function(e){
    if(e.target.classList.contains('nav__link')){
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');
  
      siblings.forEach((el) => {
        if(el !== link)
          el.style.opacity = opacity;
    });
      logo.style.opacity = opacity;
    }
  }
}

// Passing "arguments" to callback functions using closures.
nav.addEventListener('mouseover', handleHover(0.5));
nav.addEventListener('mouseout', handleHover(1));

// Sticky navigation

/*
// bad practice for performance(using the "scroll" event).
const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function(e){
  if(this.window.scrollY > initialCoords.top)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
});
*/

// Sticky navigation: using Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(function(entries){
  const entry = entries[0];
  if(!entry.isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
},
{
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);


// Reveal Sections
const allSections = document.querySelectorAll('.section');
/*allSections.forEach(section => section.classList.add('section--hidden'));*/

const revealSection = function(entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(section => sectionObserver.observe(section));


// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer){
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //we do that so the blur filtered only when loading is finished.
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  //rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));


// Slider
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right')
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

const createDots = function(){
  slides.forEach(
    (_, index) => dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${index}"></button>`));
};

createDots();

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(
    dot => dot.classList.remove('dots__dot--active')
    );

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

const goToSlide = function(curSlide){
  slides.forEach(
    (slide, index) => slide.style.transform = `translateX(${100 * (index - curSlide)}%)`
    );  
}

goToSlide(0);
activateDot(0);

const nextSlide = function(){
  curSlide = (curSlide + 1) % maxSlide;

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function(){
  curSlide = (curSlide + maxSlide - 1) % maxSlide;

  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight')
    nextSlide();

  if(e.key === 'ArrowLeft')
    prevSlide();
});

dotContainer.addEventListener('click' , function(e){
  if(e.target.classList.contains('dots__dot')){
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
//LECTURES:

/*
//Selecting Elements:
console.log(document.documentElement);
console.log(document.head); 
console.log(document.body); //For these two special elements we don't need to write any selector, otherwise we need to us a selector on the element

const header = document.querySelector('.header');
//querySelectorAll() returns a ***'Node list'*** 
const allSections = document.querySelectorAll('.section'); 
console.log(allSections);

document.getElementById('section--1');
//getElementsByTagName() returns an ***'HTMLCollection'***
//Also called a 'live collection', that means if the DOM changes, the live collection is immediately updated automatically.
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

//Returns an ***'HTMLCollection'***
console.log(document.getElementsByClassName('btn'));


//Creating and Inserting elements:
//.insertAdjacentHTML to directly inserting elements in the DOM.

//Creating elements from scratch:
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

//Inserting elements into DOM
header.prepend(message);
header.append(message); //Removing the last presence of the element, BECAUSE an element can't live in more than two places at the same time.

//To create multiple copies of the same element node.
//header.append(message.cloneNode(true));

header.before(message);
header.after(message);

//Deleting Elements:
document.querySelector('.btn--close--cookie').addEventListener('click', function(){
  //new way:
  message.remove();
  //old way:
  //message.parentElement.removeChild(message); //DOM traversal.
});


//Styles:
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//IMP NOTE: you can only display properties that are "inline" or properties we have set using the "style" property, not the properties that are hidden inside a class.
console.log(message.style.height);
console.log(message.style.backgroundColor);
//But there is a way for getting the "computed styles":
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

//CSS Custom properties "CSS Variables":
document.documentElement.style.setProperty('--color-primary', 'orange');

// Attributes:

// reading attributes:
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.classList);
//Note: non-standard properties can't be accessed on element objects directly.
//but we can read it using the following method:
console.log(logo.getAttribute('designer'));

// setting attributes:
logo.alt = "This is an alternative text on the logo img";
logo.setAttribute('designer', 'Refaat');
console.log(logo.getAttribute('designer'));
//for href and src attributes:
console.log(logo.src); //gets the full url;
console.log(logo.getAttribute('src')); //gets the relative url.

// Data attributes:
console.log(logo.dataset.versionNumber); //data-version-number.

// Classes:
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use
logo.className = 'whatever';


// Adding and removing Event Listeners

const h1 = document.querySelector('h1');
const alertH1 = function(e){
  alert('Event Triggered!');

  //This doesn't have to be here! It can be anywhere.
  h1.removeEventListener('mouseenter', alertH1);
}

h1.addEventListener('mouseenter', alertH1);



// Event Propagation:

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);  

const randomColor = () => 
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // stopping propagation
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('LINKS', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function(e){
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

// Page navigation & event delegation:
const navLinks = document.querySelectorAll('.nav__link'); //Node list
navLinks.forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    const id = this.getAttribute('href') //we didn't use this.href bcs we only need the relative url.
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  });
  //But attaching this function to every button will affect the performance, so we use "Event Delegation".

  //We attach our event handler on a common parent element to all the buttons.
});


// DOM Traversing

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //Nodelist
console.log(h1.children); //HTMLCollection
h1.firstElementChild.style.color = 'White';
h1.lastElementChild.style.color = 'orangered';

// going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)' //closest parent element.

h1.closest('h1').style.background = 'var(--gradient-primary)' //closest parent element.

//Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.previousSibling);
console.log(h1.nextSibling);
//we can only access the exact siblings of an element using these methods! If we want to get all siblings of an element we use the following trick.
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if(el !== h1)
    el.style.transform = 'scale(0.5)';
});



// Intersection Observer API

const obsCallback = function(entries, observer){
  entries.forEach(entry => {
    console.log(entry);
  })
};
const obsOptions = {
  root: null, //the element that we want our target element to intersect. (null = entire viewport)
  threshold: [0, 0.2], //the percentage of intersection at which the observer callback will be called
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);

*/

// DOM content loaded event:
document.addEventListener('DOMContentLoaded', function(e){
  console.log(e);
});

// Load event:
window.addEventListener('load', function(e){
  console.log(e);
});

window.addEventListener('beforeunload', function(e){
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});