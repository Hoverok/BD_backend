
const request = require('supertest');
const app = require('../app');

describe('Programs API', () => {
    //jest.setTimeout(30000);
    it('GET /programs --> returns array of program objects', () => {
        //jest.setTimeout(30000);
        return request(app)
            .get('/programs')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        programStatus: expect.any(String),
                        description: expect.any(String),
                        duration: expect.any(String)
                    })
                ]))
            });

    });
})