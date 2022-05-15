const { default: mongoose } = require('mongoose');
const authenticate = require('../authenticate');
const request = require('supertest');
const app = require('../app');

var userId = '6274e50c49937c20986352eb';
var token = authenticate.getToken({ _id: userId });
var createdMessageId = '';
const programId = '6280f059b898fc398805a86f';

describe('Fetching all users from DB', () => {
    it('GET /users --> returns array of users objects', () => {
        return request(app)
            .get('/users')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        admin: expect.any(Boolean),
                        fullName: expect.any(String),
                        email: expect.any(String),
                        stampNr: expect.any(String),
                        username: expect.any(String),
                    })
                ]))
            });
    });
});


describe('Logging in as a registered user', () => {
    it('POST /users/login --> returns success, status and token', () => {
        return request(app)
            .post('/users/login')
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                "username": "doctor",
                "password": "pass"
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    success: true,
                    status: "Login Successful!",
                    token: expect.any(String)
                }))
            });
    });
});