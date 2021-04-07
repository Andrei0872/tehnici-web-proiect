import express from 'express';

const PORT = 3002;
const app = express();

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));