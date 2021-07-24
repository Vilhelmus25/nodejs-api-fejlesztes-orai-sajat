const express = require('express');
//const data = require('./data');         // a mongoose-hoz már nem kell
const createError = require('http-errors');
// const Person = require('../../models/person.model');    // most innen jön az adat
// const logger = require('../../config/logger')

const personService = require('./person.service');

//const controller = express.Router();

// controller.get('/', async (req, res) => {                   // az async await a mongoose-sal jött be
//     // Person.find()
//     const people = await Person.find();
//     //.then(people => {
//     logger.debug(`Get all people, returning ${people.length} items.`);
//     res.json(people);
//     //})
// })

// mongoose get után

// controller.get('/', (req, res) => {
//     res.json(data);
// });

// // Get one person
// controller.get('/:id', async (req, res, next) => {            // kell a next ahol használom!!!!
//     const person = await Person.findById(req.params.id);
//     if (!person) {
//         return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
//             new createError.NotFound("Person is not found!")        // NotFound
//         );
//     }

//     // const person = data.find(p => p.id === Number(req.params.id));
//     // if (!person) {
//     //     return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
//     //         new createError.BadRequest("Person is not found!")
//     //     )
//     // }
//     res.json(person);
// });

// Create a new person
exports.create = (req, res, next) => {
    const { last_name, first_name, email } = req.body;
    if (!last_name || !first_name || !email) {
        return next(
            new createError.BadRequest("Missing properties!")
        )
    }

    const newPerson = new Person({
        firstName: first_name,
        lastName: last_name,
        email: email
    })

    return personService.create(newPerson)
        .then(cp => {
            res.status(201);
            res.json(cp);
        })
        .catch(err => next(new createError.InternalServerError(err.message)));
};

exports.findAll = (req, res, next) => {
    return personService.findAll()
        .then(people => {
            res.json(people);
        })
};

exports.findOne = (req, res, next) => {
    return personService.findOne(req.params.id)
        .then(person => {
            if (!person) {
                return next(new createError.NotFound("Person is not found"));
            }
            // res.json(person); 
            return res.json(person);
        })
};

exports.update = (req, res, next) => {
    const id = req.params.id;                   // ami a kettőspont után van az egy változó és ezt így érem el.
    // mongoose után nem kell
    // const index = data.findIndex(p => p.id === Number(id))      // ez a Number konstruktorba tevés azért kell, hogy ne legyen gond a típusokkal, mert az url-ben stringként kapom, de a db-ben számként kezelem.
    const { first_name, last_name, email } = req.body;          // egy ojjektumba pakolom

    if (!last_name || !first_name || !email) {
        return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
            new createError.BadRequest("Missing properties!")
        );
    }

    const update = {
        firstName: first_name,
        lastName: last_name,
        email: email
    };

    return personService.update(req.params.id, up)
        .then(person => {
            res.json(person);
        })
        .catch(err => {
            next(new createError.InternalServerError(err.message));
        });
};

exports.delete = (req, res, next) => {
    return personService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => {
            next(new createError.InternalServerError(err.message));
        })
}






// controller.post('/', (req, res, next) => {
//     const { last_name, first_name, email } = req.body;
//     if (!last_name || !first_name || !email) {
//         return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
//             new createError.BadRequest("Missing properties!")
//         )
//     }

//     //const newPerson = req.body;         // ez fogja a req.body tartalmazni az új person adatait. A req.body egy string lesz, ez nem jó, nekem objektum kell majd, ezért packages és a dependencies-be felveszem body-parser, majd npm i
//     // mongoose miatt ez lesz
//     const newPerson = new Person({
//         firstName: first_name,
//         lastName: last_name,
//         email: email
//     })
//     // // a ^jelenti azt hogy frissíthető, majd az index.js-ben kell egy bodyParser változó, amibe importáljuk a body-parsert.

//     // newPerson.id = data[data.length - 1].id + 1;             // mongoose miatt nem kellenek
//     // data.push(newPerson);
//     newPerson.save()
//         .then(data => {                 // egy küldjük el az adatokat
//             res.status(201);            // ez egy speciális státusz, amikor sikerült létrehozni az új erőforrást
//             res.json(data);             // a data kell persze
//         })

// });

// // Update a person
// controller.put('/:id', async (req, res, next) => {         // így kell, ez egy url változó lesz így, vigyázzunk itt put metódus kell, nem post
//     const id = req.params.id;                   // ami a kettőspont után van az egy változó és ezt így érem el.
//     // mongoose után nem kell
//     // const index = data.findIndex(p => p.id === Number(id))      // ez a Number konstruktorba tevés azért kell, hogy ne legyen gond a típusokkal, mert az url-ben stringként kapom, de a db-ben számként kezelem.
//     const { first_name, last_name, email } = req.body;          // egy ojjektumba pakolom

//     if (!last_name || !first_name || !email) {
//         return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
//             new createError.BadRequest("Missing properties!")
//         )
//     }

//     const update = {
//         firstName: first_name,
//         lastName: last_name,
//         email: email
//     }
//     let person = {};
//     try {
//         person = await Person.findByIdAndUpdate(id, update, { new: true })           // ha nem létezik, akkor létrehozza {new: true}
//     } catch (err) {
//         return next(new createError.BadRequest(err));
//     }
//     return res.json(person);

//     // data[index] = {
//     //     id,
//     //     //first_name: req.body                                  // így kellene, ha nem lenne a fenti objektum
//     //     first_name,
//     //     last_name,
//     //     email
//     // }

//     // res.json(data[index]);
// });

// // Delete a person
// controller.delete('/:id', async (req, res, next) => {
//     const { id } = req.params;
//     let person = {};
//     try {
//         person = await Person.findByIdAndDelete(id)           // itt elég csak az id, mert nem update-elünk, hanem törlünk
//     } catch (err) {
//         return next(new createError.NotFound(err));
//     }
//     // mongoose előtt ez volt:
//     // const index = data.findIndex(p => p.id === Number(req.params.id));
//     // if (index === -1) {         // a findIndex -1-el tér vissza ha nincs találata
//     //     return next(            // a next megszakítja a jelenlegi folyamatot és továbbdobja a következő middleware-nek a kérést
//     //         new createError.BadRequest("Person is not found!")
//     //     )
//     // }
//     // data.splice(index, 1);
//     res.json({});               // egy üres objektumot küldök vissza válaszként, de nem is lenne feltétlen szükségválaszra
// });

//module.exports = controller;
