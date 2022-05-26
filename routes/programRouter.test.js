
const request = require('supertest');
const app = require('../app');
const authenticate = require('../authenticate');

var userId = '6274e50c49937c20986352eb';
var userIdChange = '6274e3842f1b4621783efc46';
var patientId = '6284f5e3ee005b0a5c89375a';
var patientIdChange = '6280f037b898fc398805a86e';
var token = authenticate.getToken({ _id: userId });
var createdProgramId = '';

describe('Fetching all programs from DB', () => {
    it('GET /programs --> returns array of program objects', () => {
        return request(app)
            .get('/programs')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        description: expect.any(String),
                        duration: expect.any(Number),
                        requirements: expect.any(String),
                        startDate: expect.any(String),
                        endDate: expect.any(String),
                        programCode: expect.any(String),
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
                description: "Test aprašymas",
                duration: 7,
                requirements: "Test įrankiai",
                startDate: "2022-05-24T00:00:00.000Z",
                endDate: "2022-06-01T00:00:00.000Z",
                programCode: "344010122221",
                patient: patientId
            })
            .then((response) => {
                createdProgramId = response.body._id;
                expect(response.body).toEqual(expect.objectContaining({
                    description: "Test aprašymas",
                    duration: 7,
                    requirements: "Test įrankiai",
                    startDate: "2022-05-24T00:00:00.000Z",
                    endDate: "2022-06-01T00:00:00.000Z",
                    programCode: "344010122221",
                    patient: expect.objectContaining({
                        personalCode: '34401012222',
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
                    description: "Test aprašymas",
                    duration: 7,
                    requirements: "Test įrankiai",
                    startDate: "2022-05-24T00:00:00.000Z",
                    endDate: "2022-06-01T00:00:00.000Z",
                    programCode: "344010122221",
                    patient: expect.objectContaining({
                        personalCode: '34401012222',
                    }),
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
                        _id: "6284f5e3ee005b0a5c89375a",
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

describe('Changing a program in DB', () => {
    it('PUT /programs/:programsId --> returns changed patient object', () => {
        return request(app)
            .put(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .send({
                description: "Test aprašymas keistas",
                duration: 9,
                requirements: "Test įrankiai keisti",
                startDate: "2022-05-25T00:00:00.000Z",
                endDate: "2022-06-02T00:00:00.000Z",
            })
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    description: "Test aprašymas keistas",
                    duration: 9,
                    requirements: "Test įrankiai keisti",
                    startDate: "2022-05-25T00:00:00.000Z",
                    endDate: "2022-06-02T00:00:00.000Z",
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

describe('Deleting a program from DB', () => {
    it('DELETE /programs/:programId --> returns a deleted program object', () => {
        return request(app)
            .delete(`/programs/${createdProgramId}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(expect.objectContaining({
                    description: "Test aprašymas keistas",
                    duration: 9,
                    requirements: "Test įrankiai keisti",
                    startDate: "2022-05-25T00:00:00.000Z",
                    endDate: "2022-06-02T00:00:00.000Z",
                }))
            });
    });
});