import express from 'express';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { init } from './db/index.js'

const rename = promisify(fs.rename);
const rm = promisify(fs.rm);

import { resizeGalleryImages, getCurrentSeason, existsFileBasedOnCondition, fetchGalleryImagesWithSeasonFilter, checkSmallerImagesAreGenerated, fetchGalleryImages } from './utils.js';

/**
 * @typedef {Object} CustomError
 * @property {string} message - The error message
 * @property {number} code - The error code
 */

const dbClient = await init();
if (!dbClient) {
  console.log('Could not connected to the database, ending now.');
  process.exit(1);
}

const fetchMainCategories = async () => {
  const { rows: mainCategories } = await dbClient.query("select distinct(specialization) from lawyer");

  return mainCategories.map(({ specialization }) => specialization);
};

const PORT = 8080;
const GALLERY_FILE_NAME = 'gallery.json';
const GALLERY_METADATA_PATH = path.resolve('public/data/gallery.json');
const GALLERY_IMAGES_DIRECTORY_PATH = path.resolve('public/assets/images/gallery');

const SHOULD_RESIZE_IMAGES = false;

const app = express();

// Using this to generate smaller images for the `lawyer` table.
// In order to keep things simple, we'll keep the original images and use
// the ones with the `temp-` prefix in the app.
// resizeGalleryImages(100, path.resolve('public/assets/images/lawyers'))

// Making sure all the images are of the same size
SHOULD_RESIZE_IMAGES && resizeGalleryImages(400, GALLERY_IMAGES_DIRECTORY_PATH, async ({ imgPath, newImgPath }) => {
  try {
    const oldPath = imgPath;
    
    const lastDotIdx = imgPath.lastIndexOf('.');
    imgPath = imgPath.slice(0, lastDotIdx) + '.' + 'webp';

    await Promise.all([rename(newImgPath, imgPath), !oldPath.includes('webp') && rm(oldPath)]);
  } catch (err) {
    console.log(`Error occurred while renaming ${newImgPath} to ${imgPath}: ${err.message}`);
  }
});

app.set('view engine', 'ejs');
app.set('views', path.resolve('public', 'views'));

app.use((req, res, next) => {
  const err = req.path.includes(GALLERY_FILE_NAME) 
    ? { message: 'Forbidden', code: 403 }
    : undefined;

  next(err);
});

app.use(express.static('public'));
app.use(express.static('public/assets'));

app.get(/^\/(index)?$/, async (req, res) => {
  const ipAddr = req.headers['x-forwarded-for'] || '127.0.0.1';
  
  await checkSmallerImagesAreGenerated(GALLERY_IMAGES_DIRECTORY_PATH);
  
  const images = await fetchGalleryImagesWithSeasonFilter(GALLERY_METADATA_PATH);

  const mainCategories = await fetchMainCategories();

  res.render('pages/index', { 
    ipAddr,
    images,
    mainCategories,
  });
});

app.get(/^\/(about|hire\-a\-lawyer|gallery)$/, async (req, res) => {
  const { 0: pageName } = req.params;
  
  const mainCategories = await fetchMainCategories();

  if (pageName !== 'gallery') {
    return res.render(`pages/${pageName}`, { mainCategories });
  }

  await checkSmallerImagesAreGenerated(GALLERY_IMAGES_DIRECTORY_PATH);

  const images = await fetchGalleryImagesWithSeasonFilter(GALLERY_METADATA_PATH);

  res.render('pages/gallery', { images, isPartial: false, mainCategories });
});

app.get('/lawyers', async (req, res) => {
  const { main_cat: specialization = null } = req.query;

  const queryArgs = [];
  const queryStr = `
    select *
    from lawyer
    ${specialization ? ' where specialization = $1' : ''}
  `;
  queryArgs.push(queryStr);

  specialization !== null && (queryArgs.push([specialization]));

  // TODO: Promise.all
  const { rows: lawyers } = await dbClient.query(...queryArgs);
  const mainCategories = await fetchMainCategories();
  
  const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsOfTheYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  res.render('pages/lawyers', { 
    mainCategories,
    lawyers: lawyers.map(l => {
      const crtDate = new Date(l.started_at);
      
      return {
        ...l,
        started_at: `${daysOfTheWeek[crtDate.getDay()]}, ${crtDate.getDate()}-${monthsOfTheYear[crtDate.getMonth()]}-${crtDate.getFullYear()}`
      }
    }), 
  });
});

app.get('/api/images', async (req, res) => {
  const images = await fetchGalleryImages(GALLERY_METADATA_PATH);

  res.json({ images });
});

app.get('*', (req, res) => {
  res.render('pages/404');
});

app.use((/** @type {CustomError} */err, req, res, next) => {
  let renderedPage;

  switch (true) {
    case err.code === 403: {
      renderedPage = '403';
      break;
    }

    // Other cases here...
  }
  
  res.render(`pages/${renderedPage}`, { message: err.message });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));