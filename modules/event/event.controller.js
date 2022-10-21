const express = require('express');
const router = express.Router();
const EventService = require('./event.service');
const { getUserId } = require('../../middlewares/isAuthenticated');

module.exports = router;

async function create(req, res, next) {
    req.body.createdBy = await getUserId(req);
    EventService.create(req.body).then((doc) => {
        res.json({ error: false, success: true, message: "Event created successfully", data: doc });
    }).catch(error => {
        res.json({ error: false, success: true, message: (error || error.error) || error.message, data: {} });
    });
}

async function getAll(req, res, next) {
    let userId = await getUserId(req);
    let _filter = {};
    if (req.query && req.query.limit > 0) {
        _filter.limit = Number(req.query.limit);
    } else {
        _filter.limit = null;
    }
    
    EventService.getAll(_filter, userId).then((doc) => {
        res.json({ error: false, success: true, message: "Events fetched successfully", data: doc })
    }).catch(error => {
        next(error);
    });
}

async function getById(req, res, next) {
    EventService.getById(req.params.id).then((doc) => {
        res.json({ error: false, success: true, message: "Events fetched successfully", data: doc })
    }).catch(error => {
        next(error);
    });
}

async function update(req, res, next) {
    // EventService.update(req.params.id, req.body)
    //     .then(() => res.json({}))
    //     .catch(err => next(err));
}

async function _delete(req, res, next) {
    // EventService.delete(req.params.id)
    //     .then(() => res.json({}))
    //     .catch(err => next(err));
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    _delete
};
