// const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Event = db.Event;

module.exports = {
    getAll,
    getById,
    create,
    // update,
    // delete: _delete
};

function create(event) {
    return new Promise((resolve, reject) => {
        try {
            Event.create(event, function (error, doc) {
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

function getAll(allEvent) {
    return new Promise((resolve, reject) => {
        try {
            Event.find({ 'isActive': true }).exec(function (error, doc) {
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

function getById(eventId) {
    return new Promise((resolve, reject) => {
        try {
            Event.findOne({ _id: eventId }).exec(function (error, doc) {
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