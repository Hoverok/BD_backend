const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Programs = require('../models/programs');
const Exercises = require('../models/exercises');

const programRouter = express.Router();

programRouter.use(bodyParser.json());

programRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Programs.find(req.query)
            .populate('author')
            .populate('patient')
            .then((programs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(programs);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        req.body.author = req.user._id; //req.user contains the info of logged in user
        Programs.create(req.body)
            .then((program) => {
                Programs.findById(program._id)
                    .populate('author')
                    .populate('patient')
                    .then((program) => {
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(program);
                    })
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /programs');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Programs.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

programRouter.route('/:programId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get((req, res, next) => {
        Programs.findById(req.params.programId)
            .populate('author')
            .populate('patient')
            .then((program) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(program);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /programs/' + req.params.programId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Programs.findByIdAndUpdate(req.params.programId, {
            $set: req.body
        }, { new: true })
            .populate('author')
            .populate('patient')
            .then((program) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(program);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Exercises.findOne({ program: req.params.programId })
            .then((exercise) => {
                if (exercise) {
                    Exercises.deleteMany({ program: req.params.programId })
                        .then((resp) => {
                            Programs.findByIdAndRemove(req.params.programId)
                                .then((resp) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(resp);
                                })
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    Programs.findByIdAndRemove(req.params.programId)
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));

        // Exercises.deleteMany({ program: req.params.programId })
        //     .then((resp) => {
        //         Programs.findByIdAndRemove(req.params.programId)
        //             .then((resp) => {
        //                 res.statusCode = 200;
        //                 res.setHeader('Content-Type', 'application/json');
        //                 res.json(resp);
        //             })
        //     }, (err) => next(err))
        //     .catch((err) => next(err));

    });

// .then((favorite) => {
//     if (favorite) {
//         if (favorite.dishes.indexOf(req.params.dishId) < 0) {
//             favorite.dishes.push(req.body);
//             favorite.save()
//                 .then((favorite) => {
//                     Favorites.findById(favorite._id)
//                         .populate('user')
//                         .populate('dishes')
//                         .then((favorite) => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(favorite);
//                         })
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 })
//         }
//         else {
//             err = new Error('Dish id :' + req.params.dishId + ' already in favorites');
//             err.status = 422;
//             return next(err);
//         }
//     }

module.exports = programRouter;