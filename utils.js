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

