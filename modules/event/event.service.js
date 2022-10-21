// const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Event = db.Event;

const { getAdminUsers } = require('../users/user.service');

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

function getAll(_filter, userId) {
    return new Promise(async (resolve, reject) => {
        try {
            let adminUsers = await getAdminUsers();
            let adminUserIds = adminUsers.map(user => user._id);
            let extractedAdminUserIds = adminUserIds.push(userId);
            let userIds = [...new Set(adminUserIds)];

            Event.find({ 'isActive': true, "eventDate": { $gte: new Date() }, createdBy: { $in: userIds } })
                .populate('createdBy', 'name')
                .sort({ eventDate: 1 })
                .limit(_filter.limit)
                .exec(function (error, doc) {
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