const { response } = require('express');
const UserTask = require('../models/UserTasksInfo');

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function getUserTasksList() {
  return [{
    category: 'Academic', taskList: []
  }, {
    category: 'EC', taskList: []
  }, {
    category: 'University', taskList: []
  }, {
    category: 'Others', taskList: []
  }];
}

function createUserTask(user) {
  return new Promise((resolve, reject) => {
    try {
      let userTaskInfo = {
        taskDetails: getUserTasksList(),
        user: user._id
      };

      UserTask.create(userTaskInfo, function (error, doc) {
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

function updateUserTask(userTask) {
  return new Promise((resolve, reject) => {
    try {
      UserTask.findByIdAndUpdate(userTask._id,
        userTask, { new: true },
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

function removeUserTask(req) {
  return new Promise((resolve, reject) => {
    try {

      const query = {
        user: req.body.userId
      };
      const update = {
        $set: { "taskDetails.$[i].taskList.0.tasks.$[j].isActive": false }
      };
      const filter = {
        arrayFilters: [{ "i.category": req.body.category }, { "j._id": req.body.taskId }]
      };
      UserTask.update(query, update, filter, function (error, doc) {
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

function getUserTaskById(id) {
  return new Promise((resolve, reject) => {
    try {
      var query = { user: id }
      UserTask.findOne(query).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          if (!doc) {
            let createdTaskInfo = createUserTask({ _id: id });
            resolve(createdTaskInfo);
          } else {
            resolve(doc);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getCategoryWiseTasks(requestObj) {
  return new Promise((resolve, reject) => {
    try {
      var query = {
        user: requestObj.userId,
        "taskDetails.category": requestObj.category
      }
      UserTask.findOne(query).exec(async function (error, doc) {
        if (error) {
          reject(error);
        } else {
          // let data = await filterTasksBasedOnCategory(doc, requestObj.category);
          // let activeTasks = await filterTasksBasedOnStatus(data, requestObj.status);
          // resolve(activeTasks);

          filterTasksBasedOnCategory(doc, requestObj.category).then((dataResult) => {
            filterTasksBasedOnStatus(dataResult, requestObj.status).then((activeTasksResult) => {
              resolve(activeTasksResult);
            }).catch(error => {
              reject(error);
            });
          }).catch(error => {
            reject(error);
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function filterTasksBasedOnCategory(objUserTaskInfo, category) {
  return new Promise((resolve, reject) => {
    try {
      let filteredTasksInfo = objUserTaskInfo.taskDetails.filter(e => e.category === category);
      resolve(filteredTasksInfo);
    } catch (error) {
      reject(error);
    }
  });
}

function filterTasksBasedOnStatus(objUserTaskInfo, status) {
  return new Promise((resolve, reject) => {
    try {
      let filteredTasksInfo;
      if (objUserTaskInfo[0].taskList.length > 0) {
        filteredTasksInfo = objUserTaskInfo[0].taskList[0].tasks.filter(e => {
          return status == 'Active' ? e.isActive && !e.isCompleted : e.isCompleted
        });
        objUserTaskInfo[0].taskList[0].tasks = filteredTasksInfo;
      }
      resolve(objUserTaskInfo);
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
}

function getUserTaskInfo(id) {
  return new Promise((resolve, reject) => {
    try {
      var query = { user: id }
      UserTask.findOne(query).exec(async function (error, doc) {
        if (error) {
          reject(error);
        } else {
          if (!doc) {
            let createdTaskInfo = createUserTask({ _id: id });
            resolve(createdTaskInfo);
          } else {
            resolve(doc);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getUserTaskByCategory(userId, category) {
  return new Promise((resolve, reject) => {
    try {
      const query = {
        user: userId,
        "taskDetails.category": category,
        isActive: true
      };

      UserTask.find(query).exec(function (error, doc) {
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

function getUserTasks() {
  return new Promise((resolve, reject) => {
    try {
      UserTask.find({ 'isActive': true }).exec(function (error, doc) {
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

function addUserTaskToCategory(req) {
  return new Promise(async (resolve, reject) => {
    try {

      var query = {
        user: req.body.userId,
        "taskDetails.category": req.body.category
      };

      if (req.body.category == 'Academic') {
        let checkIfSubCategoryExistsResult = await checkIfSubCategoryExists(req);
        console.log('checkIfSubCategoryExistsResult', checkIfSubCategoryExistsResult);
        let saveSubCategoryTaskInfoResult = await saveSubCategoryTaskInfo(req, checkIfSubCategoryExistsResult ? 'update' : 'add');
        console.log('saveSubCategoryTaskInfoResult', saveSubCategoryTaskInfoResult);
        resolve(saveSubCategoryTaskInfoResult);
      } else {
        var taskInfo = {
          task: req.body.task,
          isActive: true,
          createdBy: req.session.userInfo._id || 0,
          createdOn: new Date(),
          updatedBy: null,
          updatedOn: null
        }

        UserTask.updateOne(query, {
          $push: {
            "taskDetails.$[elem].taskList.0.tasks": taskInfo
          }
        },
          {
            arrayFilters: [
              { "elem.category": req.body.category }
            ]
          }, function (error, doc) {
            if (error) {
              reject(error);
            } else {
              resolve(doc);
            }
          });
      }
    } catch (error) {
      reject(error);
    }
  });
}

function checkIfSubCategoryExists(req) {
  return new Promise((resolve, reject) => {
    try {

      const query = {
        user: req.body.userId,
        taskDetails: { $elemMatch: { taskList: { $elemMatch: { subCategory: req.body.subCategory } } } }
      };
      UserTask.findOne(query, function (error, doc) {
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

function saveSubCategoryTaskInfo(req, operation = 'add') {
  return new Promise((resolve, reject) => {
    try {
      // console.log('operation', operation, req.body.subCategory);
      var taskInfo = {
        subCategory: req.body.subCategory,
        tasks: [{
          task: req.body.task,
          isActive: true,
          createdBy: req.session.userInfo && req.session.userInfo._id || 0,
          createdOn: new Date(),
          updatedBy: null,
          updatedOn: new Date(),
        }]
      }

      console.log('taskInfo', taskInfo);
      const query = {
        user: req.body.userId
      };
      var update;
      var filters;
      if (operation == 'add') {
        update = {
          $push: { "taskDetails.$[elem].taskList": taskInfo }
        };
        filters = {
          arrayFilters: [
            { "elem.category": req.body.category }
          ]
        }
      } else {
        update = {
          $push: { "taskDetails.$[elem].taskList.$[elem2].tasks": taskInfo.tasks[0] }
        };
        filters = {
          arrayFilters: [
            { "elem.category": req.body.category },
            { "elem2.subCategory": req.body.subCategory }
          ]
        }
      }

      UserTask.findOneAndUpdate(query, update, filters, function (error, doc) {
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

function completeUserTask(req) {
  return new Promise((resolve, reject) => {
    try {

      const query = {
        user: req.body.userId
      };
      const update = {
        $set: { "taskDetails.$[i].taskList.0.tasks.$[j].isCompleted": true }
      };
      const filter = {
        arrayFilters: [{ "i.category": req.body.category }, { "j._id": req.body.taskId }]
      };
      UserTask.update(query, update, filter, function (error, doc) {
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
  createUserTask,
  updateUserTask,
  removeUserTask,
  getUserTaskById,
  getUserTaskInfo,
  getUserTaskByCategory,
  getCategoryWiseTasks,
  getUserTasks,
  addUserTaskToCategory,
  completeUserTask
};
