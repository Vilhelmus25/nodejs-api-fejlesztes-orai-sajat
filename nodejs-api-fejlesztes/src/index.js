const express = require('express');
const app = express();      // ez egy express fv, ami létrehozza az alkalmazásunkat.
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./config/logger');
const mongoose = require('mongoose');               // mongoose importálása
mongoose.Promise = global.Promise;                  // ez kell ahhoz, hogy promise-okkal tudjak dolgozni
// eWuw0XMwudlWUwqL                                 // ez a jelszó

const port = 3000;

// Database connection.
mongoose
    .connect('mongodb+srv://dbUser:eWuw0XMwudlWUwqL@nodejsapicluster.nzbyf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {    // ezt a mongoose odlalról másoltam ki amit előtte autogeneráltattam; Itt volt egy <password> rész, ami helyett bemásoltam a fenti jelszót, ez fontos!
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info('MongoDB connection has been established successfully.'))
    .catch(err => {
        logger.error(err);
        process.exit();
    });

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


// így teszteljük a post create-et a böngésző konzoljában:

// fetch('http://localhost:3000/person', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({first_name: 'Jack', last_name: 'London', email: 'jl@gmail.com'})
// }).then( r=> r.json() )
// .then( d => console.log(d) );