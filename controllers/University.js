const University = require('../models/University')
const UniversityService = require('../services/university.service');
const constants = require('../constants/constants')
const assert = require('assert')

module.exports.getUniversities = (req, res, next) => {
  try {
    UniversityService.getUniversities().then((doc) => {
      res.json({ error: false, success: true, message: "Universities list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.getUniversityById = (req, res, next) => {
  try {
    UniversityService.getUniversityById(req.params.id).then((doc) => {
      res.json({ error: false, success: true, message: "University fetched", data: doc })
    }).catch(error => {
      res.json({ error: false, success: true, message: error.message || error.errmsg || error.message, data: {} })
    });  
  } catch (error) {
    next(error); 
  }
}

module.exports.createUniversity = (req, res, next) => {
  try {
    let _userInfo = req.session.userInfo;
    UniversityService.createUniversity(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "University created successfully", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.updateUniversity = (req, res, next) => {
  try {
    let _userInfo = req.session.userInfo;
    UniversityService.updateUniversity(req).then((doc) => {
      res.json({ error: false, success: true, message: "University updated successfully", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error.errmsg, data: null })
    });
  } catch (error) {
    next(error);
  }
}
