const UserUniversitiesInfoService = require('../services/user-university-info.service');
const config = require('../config/config')

module.exports.updateUserUniversities = (req, res, next) => {

  UserUniversitiesInfoService.updateUserUniversities(req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User universities added", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.updateUserUniversityInfo = (req, res, next) => {
  UserUniversitiesInfoService.updateUserUniversityInfo(req).then((doc) => {
    res.json({ error: false, success: true, message: "User university info modified", data: doc })
  }).catch(error => {
    console.log('next error', error);
    res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} });
  });
}

module.exports.deleteUserUniversityInfo = (req, res, next) => {
  UserUniversitiesInfoService.deleteUserUniversityInfo(req).then((doc) => {
    res.json({ error: false, success: true, message: "User university info deleted", data: doc })
  }).catch(error => {
    console.log('next error', error);
    res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} });
  });
}

module.exports.createUserUniversityInfo = (req, res, next) => {
  UserUniversitiesInfoService.createUserUniversityInfo(req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User university fetched", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.getUserUniversityById = (req, res, next) => {
  UserUniversitiesInfoService.getUserUniversityById(req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User university fetched", data: doc })
  }).catch(error => {
    next(error);
  });
}

module.exports.changeUserUniversityListSequence = (req, res, next) => {
  UserUniversitiesInfoService.changeUserUniversityListSequence(req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User university category name changed", data: doc })
  }).catch(error => {
    next(error);
  });
}