window.addEventListener('load', () => {
  setUpRangeFilter();
  setUpFiltersForm();
  setUpHobbyFilter();
  setUpSortingButtons();
});

function setUpRangeFilter () {
  const selectedValuePlaceholderEl = $('.js-lawyer-filter-range-placeholder');
  const rangeEl = $('.js-lawyer-filter-range');
  const rangeMinPlaceholderEl = $('.js-lawyer-filter-range-min');
  const rangeMaxPlaceholderEl = $('.js-lawyer-filter-range-max');

  rangeMinPlaceholderEl.innerText = rangeEl.min;
  rangeMaxPlaceholderEl.innerText = rangeEl.max;
  selectedValuePlaceholderEl.innerText = rangeEl.value;

  rangeEl.addEventListener('input', ev => {
    selectedValuePlaceholderEl.innerText = ev.target.value;
  });
}

function setUpFiltersForm () {
  const formEl = $('.js-lawyer-filters');
  const lawyerEls = $$('.js-lawyer');

  formEl.addEventListener('submit', ev => {
    ev.preventDefault();

    const formValues = new FormData(ev.target);

    const r = [...lawyerEls].forEach(el => {
      const lawyerDataEls = [...el.querySelectorAll('[class*=js-]')];
      el.style.display = 'block';

      
      const fulfilsFilters = lawyerDataEls.every(el => {
        const clsName = [...el.classList].find(c => c.includes('js-')).replace('js', 'lawyer');
        // console.log(clsName);
        // console.log(formValues.getAll(clsName));

        return filterStrategies[clsName](el.innerText, formValues.getAll(clsName))
      });

      if (!fulfilsFilters) {
        el.style.display = 'none';
      }
    });

    console.log(r);
  });

  $('.js-reset-form').addEventListener('click', () => {
    formEl.reset();
    $('.js-lawyer-filter-range-placeholder').innerText = $('.js-lawyer-filter-range').max;
  });
}

function setUpHobbyFilter () {
  const container = $('.js-filter-hobby');
  const [anyOption, ...hobbyOptions] = [...$$('[name=lawyer-hobby]')];

  container.addEventListener('change', ev => {
    if (ev.target.value === 'any') {
      
      hobbyOptions.forEach(el => (el.checked = false));
      return;
    }

    anyOption.checked = false;
  });
}

const singleMatch = (v, arr) => v.toLowerCase().includes(arr[0].toLowerCase());
const filterStrategies = {
  'lawyer-name': singleMatch,
  'lawyer-desc': (v, arr) => {
    const [values] = arr;
    
    if (!values.length) {
      return true;
    }
    
    const separateValues = values.match(/[\-\+]\w+/g);
    
    const plusWords = separateValues.filter(v => v.startsWith('+')).map(s => s.slice(1));
    const minusWords = separateValues.filter(v => v.startsWith('-')).map(s => s.slice(1));

    // At least one from `plusWords` and none from `minusWords`
    return plusWords.some(w => v.toLowerCase().includes(w))
      && !minusWords.some(w => v.toLowerCase().includes(w))
  },
  'lawyer-salary': (v, arr) => {
    if (arr[0] === 'any') {
      return true;
    }

    // Range
    return arr.some(rawString => {
      const [min, max] = rawString.split('-');

      return max ? +min <= +v && +v <= +max : +v >= +min.split('+')[0];
    })
  },
  'lawyer-works_for': (v, arr) => arr[0] === 'any' ? true : singleMatch(v, arr),
  'lawyer-hobby': (v, arr) => {
    // TODO: make `any` is unselected if some other option is selected
    if (arr[0] === "any") {
      return true;
    }

    return arr.some(selectedVal => v.toLowerCase().includes(selectedVal));
  },
  'lawyer-yrs_exp': (v, arr) => {
    return +v <= +arr[0];
  },
  'lawyer-city_name': (v, arr) => {
    if (arr[0] === 'all' || arr[0] === 'none') {
      return true;
    }

    return singleMatch(v, arr);
  },
};

let lawyersBeforeSort = null;

function setUpSortingButtons () {
  const sortAscBtn = $('.js-sort-asc');
  const sortDescBtn = $('.js-sort-desc');
  const resetSort = $('.js-reset-sort');

  sortAscBtn.addEventListener('click', () => sortLawyers());
  sortDescBtn.addEventListener('click', () => sortLawyers({ desc: true }));
  resetSort.addEventListener('click', () => {
    const lawyersContainer = $('.lawyers-container');
    
    const documentFragment = new DocumentFragment();
    lawyersBeforeSort.forEach(e => documentFragment.appendChild(e));

    lawyersContainer.appendChild(documentFragment);
  });
}

function sortLawyers ({ desc = false } = {}) {
  const isAsc = desc === false;
  
  const lawyerEls = [...$$('.js-lawyer')];

  lawyersBeforeSort = lawyersBeforeSort || [...lawyerEls];

  const lawyersContainer = $('.lawyers-container');

  // Removing the nodes first
  while (lawyersContainer.firstChild) {
    lawyersContainer.removeChild(lawyersContainer.firstChild);
  }

  // The criteria are: salary, then specialization
  lawyerEls.sort((l1, l2) => {
    const l1Salary = +l1.querySelector('.js-salary').innerText;
    const l2Salary = +l2.querySelector('.js-salary').innerText;

    if (l1Salary - l2Salary !== 0) {
      return l1Salary - l2Salary;
    }
    
    const l1Specialization = l1.querySelector('.specialization').innerText;
    const l2Specialization = l2.querySelector('.specialization').innerText;
    
    return l1Specialization.localeCompare(l2Specialization);
  });

  if (!isAsc) {
    lawyerEls.reverse();
  }
  
  const documentFragment = new DocumentFragment();
  lawyerEls.forEach(e => documentFragment.appendChild(e));

  lawyersContainer.appendChild(documentFragment);
}

function setUpComputation () {
  const formEl = $('.js-lawyer-filters');
  const lawyerEls = [...$$('.js-lawyer')];
  const computeBtn = $('.js-compute');

  let sum = 0;
  // computeBtn.addEventListener('click', () => {
  //   lawyerEls.forEach
  // });
}