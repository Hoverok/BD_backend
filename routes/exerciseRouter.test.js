const { default: mongoose } = require('mongoose');
const authenticate = require('../authenticate');
const request = require('supertest');
const app = require('../app');

var userId = '6274e50c49937c20986352eb';
var token = authenticate.getToken({ _id: userId });
var createdExerciseId = '';
const exerciseTypeId = '628138efb898fc398805a871';
const testProgramId = '6280f059b898fc398805a86f';


describe('Fetching all exercises from DB', () => {
    it('GET /exercises --> returns array of exercise objects', () => {
        return request(app)
            .get('/exercises')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        program: expect.any(String),
                        instuructions: expect.any(String)
                    })
                ]))
            });
    });
});


describe('Creating a new exercise in DB', () => {
    it('POST /exercises --> returns created exercise object', () => {
        return request(app)
            .post('/exercises')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
                program: testProgramId,
                exerciseType: exerciseTypeId,
                instuructions: 'test instructions'
            })
            .then((response) => {
                createdExerciseId = response.body._id;
                expect(response.body).toEqual(expect.objectContaining({
                    _id: expect.any(String),
                    program: testProgramId,
                    instuructions: 'test instructions'
                }))
            });
    });
});

describe('Fetch an exercise by ID', () => {
    it('GET /exercises/:exerciseId --> returns exercise object by ID', () => {
        return request(app)
            .get(`/exercises/${createdExerciseId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    _id: expect.any(String),
                    program: testProgramId,
                    instuructions: 'test instructions'
                }))
            });
    });
});


describe('Automatically adding exercise type info to program exercise', () => {
    it('GET /exercises/:exerciseId --> populate(exerciseType)', () => {
        return request(app)
            .get(`/exercises/${createdExerciseId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    exerciseType: expect.objectContaining({
                        _id: "628138efb898fc398805a871",
                        ytLink: "https://www.youtube.com/watch?v=4t5gy-YX4Mg&list=PLcppEvy--xh3ttK_1f-DuxoBadNAFZAmY&index=1",
                        title: "Klubakaulio sukimas",
                        intensity: 3,
                        inventory: "Nėra",
                    }),
                }))
            });
    });
});


describe('Changing an exercise in DB', () => {
    it('PUT /exercises/:exerciseId --> returns changed exercise object', () => {
        return request(app)
            .put(`/exercises/${createdExerciseId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                instuructions: 'test instructions changed'
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    _id: expect.any(String),
                    program: testProgramId,
                    instuructions: 'test instructions changed'
                }))
            });
    });
});

describe('Deleting an exercise type from DB', () => {
    it('DELETE /exercises/:exerciseId --> returns a deleted exercise object', () => {
        return request(app)
            .delete(`/exercises/${createdExerciseId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    _id: expect.any(String),
                    program: testProgramId,
                    exerciseType: exerciseTypeId,
                    instuructions: 'test instructions changed'
                }))
            });
    });
});
