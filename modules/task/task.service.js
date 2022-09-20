// const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Task = db.Task;

module.exports = {
    getTasks,
    getById,
    create,
    // update,
    // delete: _delete
};

function create(task) {
    return new Promise((resolve, reject) => {
        try {
            Task.create(task, function (error, doc) {
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

function getTasks(allTask) {
    return new Promise((resolve, reject) => {
        try {
            Task.find({ 'isActive': true }).exec(function (error, doc) {
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

function getById(taskId) {
    return new Promise((resolve, reject) => {
        try {
            Task.findOne({ _id: taskId }).exec(function (error, doc) {
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