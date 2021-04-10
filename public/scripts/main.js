const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

window.addEventListener('load', () => {
  allowTransitionsAfterLoad();
  activateHamburgerListener();
});

function allowTransitionsAfterLoad () {
  const clsName = 'js-prevent-initial-transitions';
  const elems = [...$$(`.${clsName}`)];

  elems.forEach(e => e.classList.remove(clsName));
}

function activateHamburgerListener () {
  const hamburger = $('.js-hamburger');
  const navContainer = $('.js-nav');

  hamburger.addEventListener('click', () => {
    navContainer.classList.toggle('is-shown');
  });
}