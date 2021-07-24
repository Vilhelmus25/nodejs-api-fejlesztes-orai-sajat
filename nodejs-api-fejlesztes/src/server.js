// Ide jönnek azok a dolgok, amik közösen vannak a tesztelés és a futtatás során.
const express = require('express');
const app = express();      // ez egy express fv, ami létrehozza az alkalmazásunkat.
// require('dotenv').config();
const config = require('config');
const logger = require('./config/logger');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const mongoose = require('mongoose');               // mongoose importálása
mongoose.Promise = global.Promise;


// Authentication.
const authenticateJwt = require('./auth/authenticate');
const adminOnly = require('./auth/adminOnly');
const authHandler = require('./auth/authHandler');

const swaggerDocument = YAML.load('./docs/swagger.yaml');

const { username, password, host } = config.get('database');
mongoose
    //.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`, {    // ezt a mongoose odlalról másoltam ki amit előtte autogeneráltattam; Itt volt egy <password> rész, ami helyett bemásoltam a fenti jelszót, ez fontos!
    //.connect(`mongodb+srv://${username}:${password}@${host}`, {    // ezt a mongoose odlalról másoltam ki amit előtte autogeneráltattam; Itt volt egy <password> rész, ami helyett bemásoltam a fenti jelszót, ez fontos!
    .connect(`mongodb+srv://${host}`, {    // ezt a mongoose odlalról másoltam ki amit előtte autogeneráltattam; Itt volt egy <password> rész, ami helyett bemásoltam a fenti jelszót, ez fontos!
        // Ez volt a default.jsonben a host-nál:
        //"host": "nodejsapicluster.nzbyf.mongodb.net/JestDB?retryWrites=true&w=majority"
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info('MongoDB connection has been established successfully.'))
    .catch(err => {
        logger.error(err);
        process.exit();
    });

app.use(morgan('combined', { stream: logger.stream }));

//app.use('/images', express.static('images'));       // statikus állományok elérésére, például képek elérésére így használjuk, ez az express csomag része; az images a gyökérmappában lévőt jelenti
app.use(express.static('public'));                  // az url-be nem kell a publicot beírni
app.use(bodyParser.json());         // így használjuk a bodyparsert

// Router.
//app.post('/login', require('./auth/login'));
app.post('/login', authHandler.login);
app.post('/refresh', authHandler.refresh);
app.post('/logout', authHandler.logout);
//app.use('/person', require('./controllers/person/person.routes'));
app.use('/person', authenticateJwt, require('./controllers/person/person.routes'));   // így teszem előbbre az authentikációt, és ha az oké, akkor hívja meg a routes-t
//app.use('/post', require('./controllers/post/post.routes'));
app.use('/post', authenticateJwt, adminOnly, require('./controllers/post/post.routes'));    // a post-ot csak az veheti igyénybe, aki bejelentkezett és admin is!
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));       // ez készít egy szép színes szagos dokumentációt

app.use((err, req, res, next) => {          // ez a hiba le kezelése, akkor amikor ha mégis meghívodna
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message                // le is kezeltem és vissza is küldtem a választ
    });
});

module.exports = app;