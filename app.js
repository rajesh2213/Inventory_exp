require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const indexRouter = require('./routes/index.js');
const genreRouter = require('./routes/genre.js');
const gameRouter = require('./routes/game.js');
const developerRouter = require('./routes/developer.js');

app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//const router = indexRouter();
const PORT = process.env.PORT;

app.use('/', indexRouter);
app.use('/genre', genreRouter);
app.use('/game', gameRouter);
app.use('/developer', developerRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})