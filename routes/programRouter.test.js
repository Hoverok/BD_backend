
const request = require('supertest');
const app = require('../app');
const authenticate = require('../authenticate');

var userId = '6274e50c49937c20986352eb';
var userIdChange = '6274e3842f1b4621783efc46';
var patientId = '6280f037b898fc398805a86e';
var patientIdChange = '628115a4b898fc398805a870';
var token = authenticate.getToken({ _id: userId });
var createdProgramId = '';

describe('Fetching all programs from DB', () => {
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
                        _id: expect.any(String),
                        programStatus: expect.any(String),
                        description: expect.any(String),
                        duration: expect.any(String),
                        requirements: expect.any(String)
                    })
                ]))
            });
    });
})

describe('Creating a new program in DB', () => {
    it('POST /programs --> returns created program object', () => {
        return request(app)
            .post('/programs')
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(201)
            .send({
                programStatus: "Aktyvi",
                description: "Test aprašymas",
                duration: "6 sav",
                requirements: "Test įrankiai",
                patient: patientId
            })
            .then((response) => {
                createdProgramId = response.body._id;
                expect(response.body).toEqual(expect.objectContaining({
                    programStatus: "Aktyvi",
                    description: "Test aprašymas",
                    duration: "6 sav",
                    requirements: "Test įrankiai",
                    patient: expect.objectContaining({
                        personalCode: '36908151111',
                    }),
                }))
            });
    });
});

describe('Fetch a program by ID', () => {
    it('GET /programs/:patientId --> returns program object by ID', () => {
        return request(app)
            .get(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    programStatus: "Aktyvi",
                    description: "Test aprašymas",
                    duration: "6 sav",
                    requirements: "Test įrankiai",
                }))
            });
    });
});

describe('Automatically adding author info to program', () => {
    it('GET /programs/:patientId --> populate(author)', () => {
        return request(app)
            .get(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    author: expect.objectContaining({
                        stampNr: '4444',
                        fullName: "Admino_Vardas Admino_Pavardė",
                        email: "admin@email.com",
                        admin: true,
                        _id: "6274e50c49937c20986352eb",
                        username: "admin",
                    }),
                }))
            });
    });
});


describe('Automatically adding patient info to program', () => {
    it('GET /programs/:patientId --> populate(patient)', () => {
        return request(app)
            .get(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    patient: expect.objectContaining({
                        _id: "6280f037b898fc398805a86e",
                        fullName: "Napoleon Bonaparte",
                        personalCode: "36908151111",
                        address: "Corsica 26-31",
                        telNum: "+37067843111",
                        email: "bonaparte@email.com",
                    }),
                }))
            });
    });
});

describe('Changing a program in DB', () => {
    it('PUT /programs/:programsId --> returns changed patient object', () => {
        return request(app)
            .put(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                programStatus: "Baigta",
                description: "Test aprašymas keistas",
                duration: "66 sav",
                requirements: "Test įrankiai keisti",
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    programStatus: "Baigta",
                    description: "Test aprašymas keistas",
                    duration: "66 sav",
                    requirements: "Test įrankiai keisti",
                }))
            });
    });
});
describe('Automatically changing author info in program', () => {
    it('PUT /programs/:programsId --> returns populate(author) object in changed program', () => {
        return request(app)
            .put(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                author: userIdChange
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    author: expect.objectContaining({
                        stampNr: '7777',
                        fullName: "Gydytojo_Vardas Gydytojo_Pavardė",
                        email: "gydytojas@email.com",
                        admin: false,
                        _id: "6274e3842f1b4621783efc46",
                        username: "doctor",
                    }),
                }))
            });
    });
});

describe('Automatically changing patient info in program', () => {
    it('PUT /programs/:programsId --> returns populate(patient) object in changed program', () => {
        return request(app)
            .put(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                patient: patientIdChange
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    patient: expect.objectContaining({
                        _id: "628115a4b898fc398805a870",
                        fullName: "Gaius Julius Caesar",
                        personalCode: "34401012222",
                        address: "Roma 22-22",
                        telNum: "+37067843222",
                        email: "caesar@email.com",
                    }),
                }))
            });
    });
});

describe('Deleting a program from DB', () => {
    it('DELETE /programs/:programId --> returns a deleted program object', () => {
        return request(app)
            .delete(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    programStatus: "Baigta",
                    description: "Test aprašymas keistas",
                    duration: "66 sav",
                    requirements: "Test įrankiai keisti",
                }))
            });
    });
});