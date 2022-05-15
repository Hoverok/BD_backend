const { default: mongoose } = require('mongoose');
const authenticate = require('../authenticate');
const request = require('supertest');
const app = require('../app');

var userId = '6274e50c49937c20986352eb';
var token = authenticate.getToken({ _id: userId });
var createdPatientId = '';

describe('Fetching all the patients from DB', () => {
    it('GET /patients --> returns array of patient objects', () => {
        return request(app)
            .get('/patients')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        fullName: expect.any(String),
                        personalCode: expect.any(String),
                        address: expect.any(String),
                        telNum: expect.any(String),
                        email: expect.any(String),
                    })
                ]))
            });
    });
});


describe('Creating a new patient in DB', () => {
    it('POST /patients --> returns created patient object', () => {
        return request(app)
            .post('/patients')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
                fullName: "tester",
                personalCode: "123456789",
                address: "testAddress",
                telNum: "867811111",
                email: "testemail@.com",
            })
            .then((response) => {
                createdPatientId = response.body._id;
                expect(response.body).toEqual(expect.objectContaining({
                    fullName: "tester",
                    personalCode: "123456789",
                    address: "testAddress",
                    telNum: "867811111",
                    email: "testemail@.com",
                }))
            });
    });
});

describe('Fetch a patient by ID', () => {
    it('GET /patients/:patientId --> returns patient object by ID', () => {
        return request(app)
            .get(`/patients/${createdPatientId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    fullName: "tester",
                    personalCode: "123456789",
                    address: "testAddress",
                    telNum: "867811111",
                    email: "testemail@.com",
                }))
            });
    });
});


describe('Changing a patient in DB', () => {
    it('PUT /patients/:patientId --> returns changed patient object', () => {
        return request(app)
            .put(`/patients/${createdPatientId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                fullName: "testerChanged",
                personalCode: "123456789",
                address: "testAddress",
                telNum: "867811111",
                email: "testemail@.com",
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    fullName: "testerChanged",
                    personalCode: "123456789",
                    address: "testAddress",
                    telNum: "867811111",
                    email: "testemail@.com",
                }))
            });
    });
});

describe('Deleting a patient from DB', () => {
    it('DELETE /patients/:patientId --> returns a deleted patient object', () => {
        return request(app)
            .delete(`/patients/${createdPatientId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    fullName: "testerChanged",
                    personalCode: "123456789",
                    address: "testAddress",
                    telNum: "867811111",
                    email: "testemail@.com",
                }))
            });
    });
});
