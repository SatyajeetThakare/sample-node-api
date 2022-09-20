const { response } = require('express');
var mongoose = require('mongoose');
const UserPlannerInfo = require('../models/UserPlannerInfo');

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function createUserPlannerInfo(userId) {
  return new Promise((resolve, reject) => {
    try {
      const userPlannerInfo = { user: userId, timeline: [] };

      UserPlannerInfo.create(userPlannerInfo, function (error, doc) {
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

function updateUserPlannerInfo(userPlanner) {
  return new Promise((resolve, reject) => {
    try {
      UserPlannerInfo.findByIdAndUpdate(userPlanner._id,
        userPlanner, { new: true },
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

function createUserPlannerInfoTimeline(req) {
  return new Promise((resolve, reject) => {
    try {
      var query = {
        user: req.params.id
      };
      // console.log('req.session', req.session);
      delete req.body._id;
      req.body.createdBy = req?.session?.userInfo && req.session.userInfo._id || 1;
      req.body.updatedBy = req?.session?.userInfo && req.session.userInfo._id || 1;
      req.body.createdOn = new Date();
      req.body.updatedOn = new Date();
      const update = {
        $push: {
          "timeline": req.body
        }
      };
      UserPlannerInfo.updateOne(query, update, function (error, doc) {
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

function updateUserPlannerInfoTimeline(req) {
  return new Promise((resolve, reject) => {
    try {
      const timelineId = req.body._id;
      const query = {
        _id: req.body.id
      };
      delete req.body._id
      req.body.updatedBy = req?.session?.userInfo && req.session.userInfo._id || 1;
      req.body.updatedOn = new Date();
      const update = {
        $set: { "timeline.$[i]": req.body }
      };
      const filters = {
        arrayFilters: [{ "i._id": timelineId }]
      };

      UserPlannerInfo.findByIdAndUpdate(query, update, filters).exec(function (error, doc) {
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

function deleteUserPlannerInfo(userPlanner) {
  return new Promise((resolve, reject) => {
    try {
      UserPlannerInfo.update({ '_id': userPlanner._id },
        { $set: { 'isActive': false, remarks: userPlanner.remarks || 'Deleted' } },
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

function getUserPlannerInfoByUserId(userId) {
  return new Promise((resolve, reject) => {
    try {
      var query = { user: userId }
      UserPlannerInfo.findOne(query).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          if (!doc) {
            createUserPlannerInfo(userId).then((userPlannerDoc) => {
              resolve(userPlannerDoc);
            }).catch(error => {
              reject(error);
            });
          } else {
            doc.timeline = doc.timeline.filter(e => e.isActive);
            // console.log('doc.timeline', doc.timeline);
            resolve(doc);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function completeUserPlannerInfo(requestObj) {
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

      UserPlannerInfo.updateOne(query, {
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
  createUserPlannerInfo,
  updateUserPlannerInfo,
  createUserPlannerInfoTimeline,
  updateUserPlannerInfoTimeline,
  getUserPlannerInfoByUserId,
  deleteUserPlannerInfo,
  completeUserPlannerInfo
};
