const { response } = require('express');
const UserEvent = require('../models/UserEventsInfo');

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function createUserEvent(req) {
  return new Promise((resolve, reject) => {
    try {
      const query = { user: req.body.user };
      const update = { 
        $set: { user: req.body.user },
        $push: { eventDetails: req.body }
      };
      const options = { upsert: true };

      UserEvent.update(query, update, options, function (error, doc) {
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

function updateUserEvent(req) {
  return new Promise((resolve, reject) => {
    try {

      let eventId = req.body._id;
      const query = {
        user: req.body.user,
        [`eventDetails`]: { $elemMatch: { _id: eventId } }
      };

      delete req.body.user;
      delete req.body._id;
      req.body.updatedOn = new Date();
      const update = {
        $set: { [`eventDetails.$`]: req.body }
      };

      UserEvent.findOneAndUpdate(query, update).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          console.log('doc', doc);
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function deleteUserEvent(userEvent) {
  return new Promise((resolve, reject) => {
    try {
      UserEvent.update({ '_id': userEvent._id },
        { $set: { 'isActive': false, remarks: userEvent.remarks || 'Deleted' } },
        function (error, doc) {
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

function getUserEventById(id) {
  return new Promise((resolve, reject) => {
    try {
      var query = { user: id }
      UserEvent.findOne(query).exec(function (error, doc) {
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

function completeUserEvent(requestObj) {
  return new Promise((resolve, reject) => {
    try {

      var query = {
        user: requestObj.body.userId,
        "taskDetails.category": requestObj.body.category
      };

      var taskInfo = {
        task: requestObj.body.task,
        isActive: true,
        createdBy: requestObj.session.userInfo._id || 0,
        createdOn: new Date(),
        updatedBy: null,
        updatedOn: null
      }

      UserEvent.updateOne(query, {
          $push: {
            "taskDetails.$[elem].taskList.0.tasks": taskInfo
          }
        },
        {
          arrayFilters: [
            { "elem.category": requestObj.body.category }
          ]
        }, function (error, doc) {
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

module.exports = {
  get,
  getAll,
  createUserEvent,
  updateUserEvent,
  getUserEventById,
  deleteUserEvent,
  completeUserEvent
};
