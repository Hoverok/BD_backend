const request = require('supertest');
const app = require('../app');



describe('Programs API', () => {
    //jest.setTimeout(9000);
    it('GET /patients --> returns array of program objects', () => {
        return request(app)
            .get('/patients')
            .then((response) => {
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        fullName: expect.any(String),
                        personalCode: expect.any(String),
                        address: expect.any(String)
                    })
                ]))
            });

    });


})