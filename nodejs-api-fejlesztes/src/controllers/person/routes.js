const express = require('express');
const data = require('./data');
const createError = require('http-errors');
const { NotExtended } = require('http-errors');

const controller = express.Router();

controller.get('/', (req, res) => {
    res.json(data);
});

// Get one person
controller.get('/:id', (req, res, next) => {            // kell a next ahol használom!!!!
    const person = data.find(p => p.id === Number(req.params.id));
    if (!person) {
        return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
            new createError.BadRequest("Person is not found!")
        )
    }
    res.json(person);
});

// Create a new person
controller.post('/', (req, res, next) => {
    const { last_name, first_name, email } = req.body;
    if (!last_name || !first_name || !email) {
        return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
            new createError.BadRequest("Missing properties!")
        )
    }

    const newPerson = req.body;         // ez fogja a req.body tartalmazni az új person adatait. A req.body egy string lesz, ez nem jó, nekem objektum kell majd, ezért packages és a dependencies-be felveszem body-parser, majd npm i
    // // a ^jelenti azt hogy frissíthető, majd az index.js-ben kell egy bodyParser változó, amibe importáljuk a body-parsert.
    newPerson.id = data[data.length - 1].id + 1;
    data.push(newPerson);

    res.status(201);            // ez egy speciális státusz, amikor sikerült létrehozni az új erőforrást
    res.json(newPerson);
});

// Update a person
controller.put('/:id', (req, res, next) => {         // így kell, ez egy url változó lesz így, vigyázzunk itt put metódus kell, nem post
    const id = req.params.id;                   // ami a kettőspont után van az egy változó és ezt így érem el.
    const index = data.findIndex(p => p.id === Number(id))      // ez a Number konstruktorba tevés azért kell, hogy ne legyen gond a típusokkal, mert az url-ben stringként kapom, de a db-ben számként kezelem.
    const { first_name, last_name, email } = req.body;          // egy ojjektumba pakolom

    if (!last_name || !first_name || !email) {
        return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
            new createError.BadRequest("Missing properties!")
        )
    }
    data[index] = {
        id,
        //first_name: req.body                                  // így kellene, ha nem lenne a fenti objektum
        first_name,
        last_name,
        email
    }

    res.json(data[index]);
});

// Delete a person
controller.delete('/:id', (req, res, next) => {
    const index = data.findIndex(p => p.id === Number(req.params.id));
    if (index === -1) {         // a findIndex -1-el tér vissza ha nincs találata
        return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
            new createError.BadRequest("Person is not found!")
        )
    }
    data.splice(index, 1);
    res.json({});               // egy üres objektumot küldök vissza válaszként, de nem is lenne feltétlen szükségválaszra
});

module.exports = controller;
