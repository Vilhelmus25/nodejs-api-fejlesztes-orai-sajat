const express = require('express');
const app = express();      // ez egy express fv, ami létrehozza az alkalmazásunkat.
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./config/logger');

const port = 3000;

app.use(morgan('combined', { stream: logger.stream }));

app.use('/images', express.static('images'));       // statikus állományok elérésére, például képek elérésére így használjuk, ez az express csomag része; az images a gyökérmappában lévőt jelenti
app.use(express.static('public'));                  // az url-be nem kell a publicot beírni

app.use(bodyParser.json());         // így használjuk a bodyparsert
app.use('/person', require('./controllers/person/routes'));

app.use((err, req, res, next) => {          // ez a hiba le kezelése, akkor amikor ha mégis meghívodna
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message                // le is kezeltem és vissza is küldtem a választ
    });
})

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
