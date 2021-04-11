const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

window.addEventListener('load', () => {
  allowTransitionsAfterLoad();
  activateHamburgerListener();
  activateBannerAnimation();
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

function activateBannerAnimation () {
  const banner = $('.js-dull-banner');

  if (getComputedStyle(banner).display === 'none') {
    return;
  }

  const activeClassName = 'is-active';
  banner.classList.add(activeClassName);

  const handler = ev => {
    setTimeout(() => banner.classList.remove(activeClassName), 5000);

    banner.removeEventListener('animationend', handler);
  }

  banner.addEventListener('animationend', handler);
}