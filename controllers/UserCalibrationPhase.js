const UserCalibrationPhaseService = require('../services/user-calibration-phase.service');
const config = require('../config/config');

module.exports.getUserCalibrationPhaseByUserId = (req, res, next) => {
  try {
    UserCalibrationPhaseService.getUserCalibrationPhaseByUserId(req).then((doc) => {
      res.json({ error: false, success: true, message: "User calibration phase fetched", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.updateCalibrationPhase = (req, res, next) => {
  try {
    UserCalibrationPhaseService.updateCalibrationPhase(req, req.body).then((doc) => {
      res.json({ error: false, success: true, message: "User calibration phase modified", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.updateUserCalibrationPhaseAttachment = (req, res, next) => {
  try {
    UserCalibrationPhaseService.updateUserCalibrationPhaseAttachment(req).then((doc) => {
      res.json({ error: false, success: true, message: "User calibration attachment saved", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error, data: {} })
    }); 
  } catch (error) {
    next(error); 
  }
}

module.exports.downloadUserCalibrationPhaseAttachment = (req, res, next) => {
  try {
    UserCalibrationPhaseService.downloadUserCalibrationPhaseAttachment(req, res).then((doc) => {
      res.download(doc);
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}