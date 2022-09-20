const UserTasksInfoService = require('../services/user-task-info.service');
const config = require('../config/config')

module.exports.createUserTask = (req, res, next) => {
  UserTasksInfoService.createUserTask(req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User task added", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.addUserTaskToCategory = (req, res, next) => {
  UserTasksInfoService.addUserTaskToCategory(req).then((doc) => {
    res.json({ error: false, success: true, message: "User task added", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.completeUserTask = (req, res, next) => {
  UserTasksInfoService.completeUserTask(req).then((doc) => {
    res.json({ error: false, success: true, message: "User task completed", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.removeUserTask = (req, res, next) => {
  UserTasksInfoService.removeUserTask(req).then((doc) => {
    res.json({ error: false, success: true, message: "User task completed", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.updateUserTask = (req, res, next) => {
  UserTasksInfoService.updateUserTask(req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User task updated", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.getUserTaskById = (req, res, next) => {
  UserTasksInfoService.getUserTaskById(req.params.id).then((doc) => {
    res.json({ error: false, success: true, message: "User tasks fetched", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.getCategoryWiseTasks = (req, res, next) => {
  UserTasksInfoService.getCategoryWiseTasks(req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User category wise task fetched", data: doc })
  }).catch(error => {
    console.log("Here");
    next(error);
  });
}