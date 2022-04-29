const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Programs = require('../models/programs');

const programRouter = express.Router();

programRouter.use(bodyParser.json());

programRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Programs.find(req.query)
            .populate('programs.author')
            .then((programs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(programs);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Programs.create(req.body)
            .then((program) => {
                console.log('Program Created ', program);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(program);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /programs');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
            .populate('comments.author')
            .then((program) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(program);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /programs/' + req.params.programId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Programs.findByIdAndUpdate(req.params.programId, {
            $set: req.body
        }, { new: true })
            .then((program) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(program);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Programs.findByIdAndRemove(req.params.programId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
    

module.exports = programRouter;