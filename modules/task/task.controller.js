const express = require('express');
const router = express.Router();
const TaskService = require('./task.service');

module.exports = router;

async function create(req, res, next) {
    TaskService.create(req.body).then((doc) => {
        res.json({ error: false, success: true, message: "Task created successfully", data: doc });
    }).catch(error => {
        next(error);
        // res.status(400).json({ error: true, success: false, message: error.message || (error || error.error), data: {} });
    });
}

async function getTasks(req, res, next) {

    let _filter = req.query.filter
    let allTask = {}

    if (_filter) {
      allTask = JSON.parse(_filter)
    }
    
    TaskService.getTasks(req.body).then((doc) => {
        res.json({ error: false, success: true, message: "Tasks fetched successfully", data: doc })
    }).catch(error => {
        next(error);
    });
}

async function getById(req, res, next) {
    TaskService.getById(req.params.id).then((doc) => {
        res.json({ error: false, success: true, message: "Tasks fetched successfully", data: doc })
    }).catch(error => {
        next(error);
    });
}

async function update(req, res, next) {
    // TaskService.update(req.params.id, req.body)
    //     .then(() => res.json({}))
    //     .catch(error => next(error));
}

async function _delete(req, res, next) {
    // TaskService.delete(req.params.id)
    //     .then(() => res.json({}))
    //     .catch(error => next(error));
}

module.exports = {
    create,
    getTasks,
    getById,
    update,
    _delete
};
