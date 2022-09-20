const UserPlannersInfoService = require('../services/user-planner-info.service');
const config = require('../config/config')

module.exports.getUserPlannerInfoByUserId = (req, res, next) => {
  UserPlannersInfoService.getUserPlannerInfoByUserId(req.params.id).then((doc) => {
    res.json({ error: false, success: true, message: "User planner fetched", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.createUserPlannerInfo = (req, res, next) => {
  UserPlannersInfoService.createUserPlannerInfo(req).then((doc) => {
    res.json({ error: false, success: true, message: "User planner added", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.createUserPlannerInfoTimeline = (req, res, next) => {
  UserPlannersInfoService.createUserPlannerInfoTimeline(req).then((doc) => {
    res.json({ error: false, success: true, message: "Planner timeline added", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.updateUserPlannerInfoTimeline = (req, res, next) => {
  UserPlannersInfoService.updateUserPlannerInfoTimeline(req).then((doc) => {
    res.json({ error: false, success: true, message: "Planner timeline updated", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.updateUserPlannerInfo = (req, res, next) => {
  UserPlannersInfoService.updateUserPlannerInfo(req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User planner updated", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.deleteUserPlannerInfo = (req, res, next) => {
  UserPlannersInfoService.deleteUserPlannerInfo(req).then((doc) => {
    res.json({ error: false, success: true, message: "User planner deleted", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.completeUserPlannerInfo = (req, res, next) => {
  UserPlannersInfoService.completeUserPlannerInfo(req).then((doc) => {
    res.json({ error: false, success: true, message: "User planner completed", data: doc })
  }).catch(error => {
    next(error);
  });
}