const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const IMAGES_URL = 'http://localhost:8080/api/images';

window.addEventListener('load', () => {
  allowTransitionsAfterLoad();
  activateHamburgerListener();
  activateBannerAnimation();
  activateDynamicGallery();
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

  if (!banner) {
    return;
  }

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

async function activateDynamicGallery () {
  const galleryContainer = $('.js-dynamic-gallery');

  if (!galleryContainer) {
    return;
  }

  const getRandomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);

  const getRandomNrOfImages = async () => {
    const { images } = await fetch(IMAGES_URL).then(r => r.json());

    images.sort(() => Math.random() > 0.5 ? -1 : 1);

    let nrElements = getRandomBetween(5, 11);
    nrElements = nrElements % 2 === 0 ? nrElements + 1 : nrElements;

    return images.slice(0, nrElements);
  }

  const IMG_CLASS = 'dynamic-gallery__image';
  const ACTIVE_CLASS = 'is-active';
  const ANIMATION_DURATION_SECONDS = 2;

  const images = await getRandomNrOfImages();
  const imagesCount = images.length;

  // This is to prevent a white screen after the last image
  images.push(images[0]);

  const fragment = new DocumentFragment();

  images.forEach((img, imgIdx) => {
    const imgTag = document.createElement('img');
    imgTag.classList.add(IMG_CLASS);
    imgTag.src = img.filePath;

    imgTag.style.cssText = `
      animation-delay: ${imgIdx * ANIMATION_DURATION_SECONDS}s;
      z-index: ${-1 * imgIdx};
    `;

    fragment.appendChild(imgTag);
  });

  galleryContainer.classList.add(ACTIVE_CLASS);
  galleryContainer.appendChild(fragment);

  const forceReflow = () => document.body.offsetHeight;

  let endedTimes = imagesCount;
  galleryContainer.addEventListener('animationend', () => {
    if (--endedTimes === 0) {
      endedTimes = imagesCount;

      galleryContainer.classList.remove(ACTIVE_CLASS);
      forceReflow();
      galleryContainer.classList.add(ACTIVE_CLASS);
    }
  });
}