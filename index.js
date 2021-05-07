import express from 'express';
import path from 'path';

const PORT = 8080;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('public', 'views'));

app.use(express.static('public'));
app.use(express.static('public/assets'));

app.get(/^\/(index)?$/, (req, res) => {
  res.render('pages/index')
});

app.get(/^\/(about|hire\-a\-lawyer)$/, (req, res) => {
  const { 0: pageName } = req.params;
  
  res.render(`pages/${pageName}`);
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));