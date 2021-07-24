const { mockRequest, mockResponse } = require('jest-mock-req-res'); // http kéréseket tesztel
const createError = require('http-errors');

const personController = require('./person.controller');    // 
const personService = require('./person.service');

jest.mock('./person.service'); // ettől fogja tudni a jest hogy mock mappából kell vennie és nem az eredetiből, még ha a nevek alapján ez következne.

describe("person controler", () => {
    const mockData = [{
        "id": 1,
        "first_name": "Kristen",
        "last_name": "Owain",
        "email": "kowain0@sohu.com"
    }, {
        "id": 2,
        "first_name": "Sergio",
        "last_name": "Castleman",
        "email": "scastleman1@nationalgeographic.com"
    }, {
        "id": 3,
        "first_name": "Michaelina",
        "last_name": "Montacute",
        "email": "mmontacute2@webs.com"
    }, {
        "id": 4,
        "first_name": "Matelda",
        "last_name": "Muspratt",
        "email": "mmuspratt3@over-blog.com"
    }, {
        "id": 5,
        "first_name": "Neil",
        "last_name": "Rape",
        "email": "nrape4@go.com"
    }];

    let response;
    const nextFunction = jest.fn();   // egy tesztelhető egyszerű fv-t hoz létreS

    beforeEach(() => {      // minden teszt eset előtt lefut, ezért ezzel beállíthatok változókat, fv-eket, stb.
        personService.__setMockData(mockData);
        response = mockResponse();
    });

    // A Unit Test  !!!
    test('find one with valid id', () => {
        const PERSON_ID = 1;
        const request = mockRequest({
            params: {
                id: PERSON_ID
            }
        });
        return personController.findOne(request, response, nextFunction)         // ez a mock-osat hívja meg
            .then(() => {
                expect(personService.findOne).toBeCalledWith(PERSON_ID);
                expect(response.json).toBeCalledWith(
                    mockData.find(p => p.id === PERSON_ID)
                );
            });
    });
    // Ez a teszt vason belül marad, nem megy ki, erre jó a mock data

});
