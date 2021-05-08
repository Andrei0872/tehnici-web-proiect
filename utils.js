import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readDirectory = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const rename = promisify(fs.rename);

export const resizeGalleryImages = async (widthForEachImage, imgDirectory, onImgResized) => {
  const resizeImage = (width, imgPath, newImagPath) =>
    sharp(imgPath)
      .resize(width, width)
      .webp()
      .toFile(newImagPath);
  
  const images = await readDirectory(imgDirectory);

  await Promise.all(
    images.map(img => {
      const imgPath = `${imgDirectory}/${img}`;
      
      let newImgPath = `${imgDirectory}/temp-${img}`;
      const lastDotIdx = newImgPath.lastIndexOf('.');
      newImgPath = newImgPath.slice(0, lastDotIdx) + '.' + 'webp';

      return resizeImage(widthForEachImage, imgPath, newImgPath)
        .then(data => onImgResized && onImgResized({ imgData: data, imgPath, newImgPath }))
        .catch(console.error);
    })
  );

  console.log('All images have been resized successfully');
};

export const existsFileBasedOnCondition = async (directory, conditionFn) => {
  const records = await readDirectory(directory);

  return !!records.find(conditionFn);
};

export const getCurrentSeason = () => {
  const monthsSeasonsTable = [
    { months: [12, 1, 2], season: 'winter', },
    { months: [3, 4, 5], season: 'spring', },
    { months: [6, 7, 8], season: 'summer', },
    { months: [9, 10, 11], season: 'fall', },
  ];
  
  const now = new Date();
  const month = now.getMonth() + 1;

  return monthsSeasonsTable.find(({ months }) => months.includes(month)).season;
}

export const fetchGalleryImages = async directory => {
  const galleryMetadata = JSON.parse(await readFile(directory, 'utf8'));
  const crtSeason = getCurrentSeason();

  const images = galleryMetadata.images
    // Filter out based on season
    .filter(({ season }) => season === crtSeason)
    .map(img => ({
      ...img,
      filePath: path.join(galleryMetadata.galleryPath, img.filePath),
      filePathSmallerImg: path.join(galleryMetadata.galleryPath, img.filePathSmallerImg),
    }));
  
  // Maximum 10 images
  return images.length > 10 ? images.slice(0, 10) : images;
};

export const checkSmallerImagesAreGenerated = async directory => {
  // Generate smaller images on the fly(doing it only once)
  const areFilesAlreadyGenerated = await existsFileBasedOnCondition(directory, fileName => /\-min/.exec(fileName));
  if (!areFilesAlreadyGenerated) {
    resizeGalleryImages(300, directory, ({ newImgPath }) => {
      const lastDotPos = newImgPath.lastIndexOf('.');
      const smallerImagePath = (newImgPath.slice(0, lastDotPos) + '-min.' + newImgPath.slice(lastDotPos + 1)).replace('temp-', '');

      rename(newImgPath, smallerImagePath);
    })
  }
};