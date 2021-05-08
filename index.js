import express from 'express';
import path from 'path';

/**
 * @typedef {Object} CustomError
 * @property {string} message - The error message
 * @property {number} code - The error code
 */

const PORT = 8080;
const GALLERY_FILE_NAME = 'gallery.json';

const app = express();

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

app.get(/^\/(index)?$/, (req, res) => {
  const ipAddr = req.headers['x-forwarded-for'] || '127.0.0.1';
  
  res.render('pages/index', { ipAddr });
});

app.get(/^\/(about|hire\-a\-lawyer)$/, (req, res) => {
  const { 0: pageName } = req.params;
  
  res.render(`pages/${pageName}`);
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