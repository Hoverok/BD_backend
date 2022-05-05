const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const ExerciseTypes = require('../models/exerciseTypes');

const exerciseTypeRouter = express.Router();

exerciseTypeRouter.use(bodyParser.json());

exerciseTypeRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        ExerciseTypes.find(req.query)
            .then((exerciseTypes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(exerciseTypes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        ExerciseTypes.create(req.body)
            .then((exerciseType) => {
                console.log('ExerciseType Created ', exerciseType);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(exerciseType);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /exercisetypes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        ExerciseTypes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

exerciseTypeRouter.route('/:exerciseTypeId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get((req, res, next) => {
        ExerciseTypes.findById(req.params.exerciseTypeId)
            .then((exerciseType) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(exerciseType);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /exercisetypes/' + req.params.exerciseTypeId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        ExerciseTypes.findByIdAndUpdate(req.params.exerciseTypeId, {
            $set: req.body
        }, { new: true })
            .then((exerciseType) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(exerciseType);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        ExerciseTypes.findByIdAndRemove(req.params.exerciseTypeId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = exerciseTypeRouter;