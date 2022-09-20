const express = require('express');
const router = express.Router();
const ArticleService = require('./article.service');

module.exports = router;

async function create(req, res, next) {
    ArticleService.create(req.body).then((doc) => {
        res.json({ error: false, success: true, message: "Article created successfully", data: doc });
    }).catch(error => {
        res.json({ error: false, success: true, message: (error || error.error) || error.message, data: {} });
    });
}

async function getAll(req, res, next) {

    let _filter = req.query.filter
    let allArticle = {}

    if (_filter) {
      allArticle = JSON.parse(_filter)
    }
    
    ArticleService.getAll(req.body).then((doc) => {
        res.json({ error: false, success: true, message: "Articles fetched successfully", data: doc })
    }).catch(error => {
        next(error);
    });
}

async function getById(req, res, next) {
    ArticleService.getById(req.params.id).then((doc) => {
        res.json({ error: false, success: true, message: "Articles fetched successfully", data: doc })
    }).catch(error => {
        next(error);
    });
}

async function update(req, res, next) {
    // ArticleService.update(req.params.id, req.body)
    //     .then(() => res.json({}))
    //     .catch(err => next(err));
}

async function _delete(req, res, next) {
    // ArticleService.delete(req.params.id)
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
