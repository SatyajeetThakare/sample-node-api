// const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Article = db.Article;

module.exports = {
    getAll,
    getById,
    create,
    // update,
    // delete: _delete
};

function create(article) {
    return new Promise((resolve, reject) => {
        try {
            Article.create(article, function (error, doc) {
                if (error) {
                    reject(error);
                } else {
                    resolve(doc);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getAll(allArticle) {
    return new Promise((resolve, reject) => {
        try {
            Article.find({ 'isActive': true }).exec(function (error, doc) {
                if (error) {
                    reject(error);
                } else {
                    resolve(doc);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function getById(articleId) {
    return new Promise((resolve, reject) => {
        try {
            Article.findOne({ _id: articleId }).exec(function (error, doc) {
                if (error) {
                    reject(error);
                } else {
                    resolve(doc);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}