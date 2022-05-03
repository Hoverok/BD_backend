const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Patients = require('../models/patients');
const Exercises = require('../models/exercises');

const patientRouter = express.Router();

patientRouter.use(bodyParser.json());

patientRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Patients.find(req.query)
            .populate('patients.author')
            .then((patients) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(patients);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Patients.create(req.body)
            .then((patient) => {
                console.log('Patient Created ', patient);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(patient);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /patients');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Patients.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

patientRouter.route('/:patientId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get((req, res, next) => {
        Patients.findById(req.params.patientId)
            .populate('comments.author')
            .then((patient) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(patient);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /comments/' + req.params.patientId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Patients.findByIdAndUpdate(req.params.patientId, {
            $set: req.body
        }, { new: true })
            .then((patient) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(patient);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Patients.findByIdAndRemove(req.params.patientId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


// .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     Exercises.findOne({ patient: req.params.patientId })
//         .then((exercise) => {
//             if (exercise) {
//                 Exercises.deleteMany({ program: req.params.programId })
//                     .then((resp) => {
//                         Programs.findByIdAndRemove(req.params.programId)
//                             .then((resp) => {
//                                 res.statusCode = 200;
//                                 res.setHeader('Content-Type', 'application/json');
//                                 res.json(resp);
//                             })
//                     }, (err) => next(err))
//                     .catch((err) => next(err));
//             }
//             else {
//                 Programs.findByIdAndRemove(req.params.programId)
//                     .then((resp) => {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(resp);
//                     }, (err) => next(err))
//                     .catch((err) => next(err));
//             }
//         }, (err) => next(err))
//         .catch((err) => next(err));
// });


module.exports = patientRouter;