const app = require('./server');
const mongoose = require('mongoose');
const supertest = require('supertest');
const config = require('config');
const Person = require('./models/person.model');
const { response } = require('./server');

// Itt már élesben fognak menni a http kérések, ez egy olyan teszt

describe('REST API integration tests', () => {
    const insertData = [
        {
            firstName: 'John',
            lastName: 'Test',
            email: 'john@test.com'
        },
        {
            firstName: 'Kate',
            lastName: 'Test',
            email: 'kate@test.com'
        }
    ];

    beforeEach(done => {

        const { username, password, host } = config.get('database');
        mongoose
            //.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`, {    // ezt a mongoose odlalról másoltam ki amit előtte autogeneráltattam; Itt volt egy <password> rész, ami helyett bemásoltam a fenti jelszót, ez fontos!
            .connect(`mongodb+srv://${username}:${password}@${host}`, {    // ezt a mongoose odlalról másoltam ki amit előtte autogeneráltattam; Itt volt egy <password> rész, ami helyett bemásoltam a fenti jelszót, ez fontos!
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                logger.info('MongoDB connection has been established successfully.');
                done();         // done-nal jelzem, hogy sikerült csatlakozni az adatbázishoz
            })
            .catch(err => {
                logger.error(err);
                process.exit();
            });
    });

    afterEach(done => {     // ez minden teszteset után fut le.
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(() => done());
        });    // a default.json-ben a myFirstDatabase helyére beírtuk a JestDB-t
        //ez nem az éles, hanem a tesztadatbázist fogja eldobni
    });

    test('GET /person', () => {
        return Person.insertMany(insertData)
            .then(() => supertest(app).get('/person').expect(200))
            .then(response => {
                expect(Array.isArray(response.body)).toBeTruthy();
                expect(response.body.length).toEqual(insertData.length);

                response.body.forEach((person, index) => {
                    expect(person.firstName).toBe(insertData[index].firstName);
                    expect(person.lastName).toBe(insertData[index].lastName);
                    expect(person.email).toBe(insertData[index].email);
                });
            });

    });
    test('GET /person/:id', () => {
        let firstPostId;
        return Person.insertMany(insertData)
            .then(people => {
                firstPostId = people[0]._id;
                return supertest(app).get(`/person/${firstPersonId}`).expect(200)
            })
            .then(response => {     // egy személy adatait fogja tartalmazni
                const person = response.body;
                expect(person.firstName).toBe(insertData[0].firstName);
                expect(person.lastName).toBe(insertData[0].lastName);
                expect(person.email).toBe(insertData[0].email);
            });

    });
})