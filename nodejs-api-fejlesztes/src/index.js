const express = require('express');
const app = express();      // ez egy express fv, ami létrehozza az alkalmazásunkat.
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json());         // így használjuk a bodyparsert
app.use('/person', require('./controllers/person/routes'))

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
