/*
Create app that:
- shows a grid of cars from a collection of cars
- users can filter the cars by make, model, price and year of manufacture

Each car should have data-make, data-model, data-price, data-year

Specs:
Display following for each car:
  - an image
  - make and model
  - price
  - year manufactured

Page should have filtering area that contains:
- A select box for car makes
  - populate the options by selecting all the unique makes from our car collection
- A select box for car models
- A select box for years
- A select box for price.
- A filter button
- When the user clicks the filter button, filter the cars so that the cars
  displayed all have the same price, model, make, and year as the selected values




*/

function walk(node, callback) {
  callback(node);
  for (let index = 0; index < node.childNodes.length; index += 1) {
    walk(node.childNodes[index], callback);
  }
}

const cars = [
  { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
  { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
  { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
  { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
  { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
  { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
];

$(function () {
  function optionIsDuplicate(value) {
    return $(`option[value=${value}]`).length > 0;
  }

  function filterCarDivs(make="All", model="All", price="Any", year="Any") {
    clearCarDivs();
    let carDivs = [...document.querySelectorAll('div.car')];
    let filteredCars = carDivs.filter(car => {
      let correctMake = car.dataset.make === make || make === 'All';
      let correctModel = car.dataset.model === model || model === 'All';
      let correctPrice = car.dataset.price === price || price === 'Any';
      let correctYear = car.dataset.year === year || year === 'Any';
      return correctMake && correctModel && correctPrice && correctYear
    });

    filteredCars.forEach(car => car.classList.remove('hidden'));
  }

  function clearCarDivs() {
    $('div.car').addClass('hidden');
  }

  // creates the options for the select elements.
  // Iterates through each type of filter (make, model, etc.) and adds the
  // carObj's value as an option to the select list if the value isn't a
  // duplicate
  function createSelectOptions(filterTypesArr, carObj) {
    filterTypesArr.forEach(type => {
      if (!optionIsDuplicate(carObj[type])) {
        let html = `<option value="${carObj[type]}">${carObj[type]}</option>`
        $(`select[name=${type}]`).append(html);
      }

      if (type === 'model') {
        let option = document.querySelector(`option[value=${carObj['model']}]`);
        option.dataset['make'] = carObj['make'];
      } else if (type === 'make') {
        let option = document.querySelector(`option[value=${carObj['make']}]`);
        if (option.dataset['model'] && option.dataset['model'] !== carObj['model']) {
          option.dataset['model'] += ', ' + carObj['model'];
        } else {
          option.dataset['model'] = carObj['model'];
        }
      }
    });
  }

  function initializePage(template, objArr, $location, filterTypes) {
    objArr.forEach(context => {
      $location.append(template(context));
      createSelectOptions(filterTypes, context);
    });
  }

  let carTemplate = Handlebars.compile($('#car').html());
  let $main = $('main');
  // filterTypes is an array of the data types we're going to filter, since
  // we want to be able to filter by every key found in cars except image
  filterTypes = Object.keys(cars[0]).filter(key => key !== 'image');
  initializePage(carTemplate, cars, $main, filterTypes);

  $('form').submit(e => {
    e.preventDefault();
    e.stopPropagation();
    let data = new FormData(e.currentTarget);
    data = [...data].map(arr => arr[1]);
    filterCarDivs(...data);
  });

  let $modelSelect = $('select[name="model"]');
  let $makeSelect = $('select[name="make"]');
  let $makeOptions = $('select[name="make"] option').clone()
  let $modelOptions = $('select[name="model"] option').clone()
  $modelSelect.change(e => {
    let modelName = e.target.value;
    $('select[name="make"] option').remove();
    let $makeOptionsToShow;
    if (modelName !== 'All') {
      $makeOptionsToShow = $makeOptions.filter((i, el) => {
        let optionModel = el.dataset.model;
        if (optionModel !== undefined) {
          return optionModel.split(', ').includes(modelName);
        } else {
          return true;
        }
      })
    } else {
      $makeOptionsToShow = $makeOptions;
    }
    $makeSelect.append($makeOptionsToShow);
  });

  $makeSelect.change(e => {
    let makeName = e.target.value;
    $('select[name="model"] option').remove();
    let $modelOptionsToShow;
    if (makeName !== 'All') {
      $modelOptionsToShow = $modelOptions.filter((i, el) => {
        let optionMake = el.dataset.make;
        if (optionMake !== undefined) {
          return optionMake === makeName;
        } else {
          return true;
        }
      })
    } else {
      $modelOptionsToShow = $modelOptions;
    }
    $modelSelect.append($modelOptionsToShow);
  });
})
