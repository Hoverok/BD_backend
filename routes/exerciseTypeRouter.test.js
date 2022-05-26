const { default: mongoose } = require('mongoose');
const authenticate = require('../authenticate');
const request = require('supertest');
const app = require('../app');

var userId = '6274e50c49937c20986352eb';
var token = authenticate.getToken({ _id: userId });
var createdExerciseTypeId = '';

describe('Fetching all exercise types from DB', () => {
    it('GET /exercisetypes --> returns array of exercise type objects', () => {
        return request(app)
            .get('/exercisetypes')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        ytLink: expect.any(String),
                        bodyPart: expect.any(String),
                        title: expect.any(String),
                        intensity: expect.any(Number),
                        inventory: expect.any(String),
                    })
                ]))
            });
    });
});


describe('Creating a new exercise type in DB', () => {
    it('POST /exercisetypes --> returns created exercise type object', () => {
        return request(app)
            .post('/exercisetypes')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
                ytLink: "test nuoroda",
                bodyPart: "liemuo/nugara",
                title: "test title",
                intensity: 5,
                inventory: "test intventory"
            })
            .then((response) => {
                createdExerciseTypeId = response.body._id;
                expect(response.body).toEqual(expect.objectContaining({
                    ytLink: "test nuoroda",
                    bodyPart: "liemuo/nugara",
                    title: "test title",
                    intensity: 5,
                    inventory: "test intventory"
                }))
            });
    });
});

describe('Fetch an exercise type by ID', () => {
    it('GET /exercisetypes/:exercisetypeId --> returns exercise type object by ID', () => {
        return request(app)
            .get(`/exercisetypes/${createdExerciseTypeId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    ytLink: "test nuoroda",
                    bodyPart: "liemuo/nugara",
                    title: "test title",
                    intensity: 5,
                    inventory: "test intventory"
                }))
            });
    });
});


describe('Changing an exercise type in DB', () => {
    it('PUT /exercisetypes/:exercisetypeId --> returns changed exercise type object', () => {
        return request(app)
            .put(`/exercisetypes/${createdExerciseTypeId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                ytLink: "test nuoroda change",
                bodyPart: "dubuo/šlaunis",
                title: "test title change",
                intensity: 2,
                inventory: "test intventory change"
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    ytLink: "test nuoroda change",
                    bodyPart: "dubuo/šlaunis",
                    title: "test title change",
                    intensity: 2,
                    inventory: "test intventory change"
                }))
            });
    });
});

describe('Deleting an exercise type from DB', () => {
    it('DELETE /exercisetypes/:exercisetypeId --> returns a deleted exercise type object', () => {
        return request(app)
            .delete(`/exercisetypes/${createdExerciseTypeId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    ytLink: "test nuoroda change",
                    bodyPart: "dubuo/šlaunis",
                    title: "test title change",
                    intensity: 2,
                    inventory: "test intventory change"
                }))
            });
    });
});
