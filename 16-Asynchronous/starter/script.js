'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

function renderCountry(data, className = '') {
  const html = `
            <article class="country ${className}">
              <img class="country__img" src="${Object.values(data.flags)[0]}" />
              <div class="country__data">
                <h3 class="country__name">${Object.values(data.name)[0]}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${data.population}</p>
                <p class="country__row"><span>🗣️</span>${
                  Object.values(data.languages)[0]
                }</p>
                <p class="country__row"><span>💰</span>${
                  Object.values(data.currencies)[0].name
                }</p>
              </div>
            </article>
        `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}

function renderError(msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
}

///////////////////////////////////////

// const getCountryData = function(country){

//     const request = new XMLHttpRequest();
//     request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//     request.send();

//     let data = [];

//     request.addEventListener('load', function(){
//         [data] = JSON.parse(request.responseText);
//         console.log(data);

//         const html = `
//             <article class="country">
//               <img class="country__img" src="${Object.values(data.flags)[0]}" />
//               <div class="country__data">
//                 <h3 class="country__name">${Object.values(data.name)[0]}</h3>
//                 <h4 class="country__region">${data.region}</h4>
//                 <p class="country__row"><span>👫</span>${data.population}</p>
//                 <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]}</p>
//                 <p class="country__row"><span>💰</span>${Object.values(data.currencies)[0].name}</p>
//               </div>
//             </article>
//         `;

//         countriesContainer.insertAdjacentHTML('beforeend', html);
//         countriesContainer.style.opacity = 1;
//     });
// }

// getCountryData('egypt');
// getCountryData('america');
// getCountryData('portugal');

///////////////////////////////////////

// const getCountryAndNeighbor = function(country){

//     // AJAX call country 1
//     const request = new XMLHttpRequest();
//     request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//     request.send();

//     request.addEventListener('load', function(){
//         const [data] = JSON.parse(request.responseText);

//         // console.log(data);
//         // Render Country 1
//         renderCountry(data);

//         // Get neighbor country 2
//         const neighbor = data.borders?.[0];

//         if(!neighbor) return;

//         // AJAX call country 2
//         const request2 = new XMLHttpRequest();
//         request2.open('GET' , `https://restcountries.com/v3.1/alpha/${neighbor}`);
//         request2.send();

//         request2.addEventListener('load', function(){
//             const [data2] = JSON.parse(request2.responseText);

//             console.log(data2);

//             renderCountry(data2, 'neighbour');
//         })
//     });
// }

// getCountryAndNeighbor('america');

///////////////////////////////////////

// const request = fetch('https://restcountries.com/v3.1/name/egypt');
// console.log(request);

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data[0]);
//       renderCountry(data[0]);
//     });
// };

const getCountryData = function (country) {
  // country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw new Error(`Country not found! (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      renderCountry(data[0]);
      // const neighbor = data[0]?.borders[0];
      const neighbor = 'sdfasd';
      if (!neighbor) return;

      // country 2
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
    })
    .then(response => response.json())
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err =>
      renderError(`Something went wrong! ${err.message}. Try again!`)
    )
    .finally(() => {
      // Hide a loading spinner for example.
      // countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountryData('portugal');
});

// getCountryData('usa');
