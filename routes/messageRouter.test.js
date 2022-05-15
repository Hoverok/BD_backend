const { default: mongoose } = require('mongoose');
const authenticate = require('../authenticate');
const request = require('supertest');
const app = require('../app');

var userId = '6274e50c49937c20986352eb';
var token = authenticate.getToken({ _id: userId });
var createdMessageId = '';
const programId = '6280f059b898fc398805a86f';

describe('Fetching all messages from DB', () => {
    it('GET /messages --> returns array of message objects', () => {
        return request(app)
            .get('/messages')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        messageSeen: expect.any(Boolean),
                        program: expect.any(String),
                        message: expect.any(String)
                    })
                ]))
            });
    });
});


describe('Creating a new message in DB', () => {
    it('POST /messages --> returns created message object', () => {
        return request(app)
            .post('/messages')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
                program: programId,
                message: "test message"

            })
            .then((response) => {
                createdMessageId = response.body._id;
                expect(response.body).toEqual(expect.objectContaining({
                    _id: expect.any(String),
                    messageSeen: false,
                    program: programId,
                    message: "test message"
                }))
            });
    });
});

describe('Fetch a message by ID', () => {
    it('GET /messages/:messageId --> returns message object by ID', () => {
        return request(app)
            .get(`/messages/${createdMessageId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    _id: createdMessageId,
                    messageSeen: expect.any(Boolean),
                    program: programId,
                    message: "test message"
                }))
            });
    });
});


describe('Changing messageSeen in message', () => {
    it('PUT /messages/:patientId --> returns changed message object', () => {
        return request(app)
            .put(`/messages/${createdMessageId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                messageSeen: true,
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    _id: createdMessageId,
                    messageSeen: true,
                    program: programId,
                    message: "test message"
                }))
            });
    });
});

describe('Deleting a message from DB', () => {
    it('DELETE /messages/:messageId --> returns a deleted message object', () => {
        return request(app)
            .delete(`/messages/${createdMessageId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    _id: expect.any(String),
                    messageSeen: true,
                    program: programId,
                    message: "test message"
                }))
            });
    });
});
