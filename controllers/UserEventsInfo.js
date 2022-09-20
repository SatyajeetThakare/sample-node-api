const UserEventsInfoService = require('../services/user-event-info.service');
const config = require('../config/config')

module.exports.getUserEventById = (req, res, next) => {
  UserEventsInfoService.getUserEventById(req.params.id).then((doc) => {
    res.json({ error: false, success: true, message: "User events fetched", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.createUserEvent = (req, res, next) => {
  UserEventsInfoService.createUserEvent(req).then((doc) => {
    res.json({ error: false, success: true, message: "User event added", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.updateUserEvent = (req, res, next) => {
  UserEventsInfoService.updateUserEvent(req).then((doc) => {
    res.json({ error: false, success: true, message: "User event updated", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.completeUserEvent = (req, res, next) => {
  UserEventsInfoService.completeUserEvent(req).then((doc) => {
    res.json({ error: false, success: true, message: "User event completed", data: doc })
  }).catch(error => {
    next(error);
  });
}