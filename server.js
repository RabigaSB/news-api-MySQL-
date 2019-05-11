const express = require('express');
const app = express();
const PORT = 8000;
const news = require('./app/news');
const comments = require('./app/comments');

const cors = require('cors');


const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use('/news', news());
app.use('/comments', comments());



app.listen(PORT, () => {
    console.log(`Server running on ${PORT} port`);
});
