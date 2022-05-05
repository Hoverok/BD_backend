const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Exercises = require('../models/exercises');

const exerciseRouter = express.Router();

exerciseRouter.use(bodyParser.json());

exerciseRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Exercises.find(req.query)
            .populate('author')
            .populate('exerciseType')
            .then((exercises) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(exercises);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        if (req.body != null) { 
            req.body.author = req.user._id; 
            Exercises.create(req.body)
                .then((exercise) => {
                    Exercises.findById(exercise._id)
                        .populate('author')
                        .populate('exerciseType')
                        .then((exercise) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(exercise);
                        })
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            err = new Error('Exercise not found in request body');
            err.status = 404;
            return next(err);
        }

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /exercises/');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Exercises.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

exerciseRouter.route('/:exerciseId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Exercises.findById(req.params.exerciseId)
            .populate('author')
            .populate('exerciseType')
            .then((exercise) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(exercise);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /exercises/' + req.params.exerciseId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Exercises.findById(req.params.exerciseId)
            .then((exercise) => {
                if (exercise != null) {
                    // if (!exercise.author.equals(req.user._id)) { //leaving this for now as an example, will change later if need be
                    //     var err = new Error('You are not authorized to update this exercise!');
                    //     err.status = 403;
                    //     return next(err);
                    // }
                    req.body.author = req.user._id;
                    Exercises.findByIdAndUpdate(req.params.exerciseId, {
                        $set: req.body
                    }, { new: true }) //makes updated exercise returns for next .then((exercise) => {})
                        .then((exercise) => {
                            Exercises.findById(exercise._id)
                                .populate('author')
                                .populate('exerciseType')
                                .then((exercise) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(exercise);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Exercise ' + req.params.exerciseId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Exercises.findById(req.params.exerciseId)
            .then((exercise) => {
                if (exercise != null) {
                    // if (!exercise.author.equals(req.user._id)) {
                    //     var err = new Error('You are not authorized to delete this exercise!');
                    //     err.status = 403;
                    //     return next(err);
                    // }
                    Exercises.findByIdAndRemove(req.params.exerciseId)
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    err = new Error('Exercise ' + req.params.exerciseId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = exerciseRouter;