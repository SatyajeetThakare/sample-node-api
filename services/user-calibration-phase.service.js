const { query } = require('express');
const User = require('../models/User');
const Common = require('../utility/Common');
const FileUploadService = require('./file-upload.service');
const path = require(`path`);

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function getUserCalibrationPhaseByUserId(req) {
  return new Promise((resolve, reject) => {
    try {
      var query = { _id: req.params.id };
      User.findOne(query).exec(async function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc.calibrationPhase.attachment);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateCalibrationPhase(req, user) {
  return new Promise((resolve, reject) => {
    try {

      let role = Common.getUserRole(req);
      // console.log('role', role);

      var query = {
        _id: user._id,
        "calibrationPhase.phases._id": user.calibrationPhaseId
      };

      var transaction;
      if (role === 0 || role === 2) { // If role is admin or analyst update Admin Approved Flag
        transaction = { $set: { "calibrationPhase.phases.$.isAdminApproved": true, "calibrationPhase.phases.$.isAdminActivePhase": false } };
      } else {
        transaction = { $set: { "calibrationPhase.phases.$.isUserCompleted": true, "calibrationPhase.phases.$.isUserActivePhase": false } };
      }

      User.updateOne(
        query,
        transaction,
        function (error, doc) {
          if (error) {
            reject(error);
          } else {
            // if (role === 0 || role === 2) {
              updateNextPhase(req).then(userDoc => {
                resolve(userDoc);
              }).catch(error => {
                reject(error);
              });
            // }
            // resolve(doc);
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}

function updateNextPhase(req) {
  return new Promise((resolve, reject) => {
    try {
      // console.log('In updateNextPhase');
      var phaseLabel;
      let role = Common.getUserRole(req);
      if(role === 0 || role === 2){
        phaseLabel = "isAdminActivePhase";
      } else {
        phaseLabel = "isUserActivePhase";
      }

      var query = {
        _id: req.body._id,
        "calibrationPhase.phases._id": req.body.calibrationPhaseId
      };

      User.findOne(query, function (error, doc) {
        if (error) {
          reject(error);
        } else {
          var indexValue;
          doc.calibrationPhase.phases.find(function(e, i) {
            if (e._id == req.body.calibrationPhaseId) {
              // console.log('Match found', i);
              indexValue = i
            }
          });
          var transaction;
          if (indexValue < 4) {
            
            if (indexValue == 3 && (role === 0 || role === 2)) {
              transaction = { $set: { [`calibrationPhase.phases.${indexValue + 1}.${phaseLabel}`]: true, 
                [`calibrationPhase.phases.${indexValue + 1}.isUserCompleted`]: true } }
            } else {
              transaction = { $set: { [`calibrationPhase.phases.${indexValue + 1}.${phaseLabel}`]: true} }
            }
          } else if(indexValue === 4 && (role === 0 || role === 2)) {
            transaction = { $set: { [`calibrationPhase.calibrationPhaseCompleted`]: true} }
          }
          User.update(
            query,
            transaction,
            function (error, doc) {
              if (error) {
                // console.log('error', error);
                reject(error);
              } else {
                // console.log('isActivePhase', doc);
                resolve(doc);
              }
            });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateUserCalibrationPhaseAttachment(req) {
  return new Promise((resolve, reject) => {
    try {
      const fileType = 'calibration-phase';
      FileUploadService.uploadFile(req, fileType, 'calibration-phase-uploads').then(async (filePath) => {

        let docObj = {
          url: filePath,
          fileName: req.file.originalname,
          uploadedOn: new Date()
        }
        const query = { _id: req.body._id };
        const update = {
          $set: { ['calibrationPhase.attachment']: docObj }
        }
        // Update the collection
        User.update(query, update, function (error, doc) {
          if (error) {
            reject(error);
          } else {
            resolve(doc);
          }
        });
      }).catch((error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function downloadUserCalibrationPhaseAttachment(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, '../calibration-phase-uploads') + '/' + req.body.userId + '/' + req.body.fileName;
      res.sendFile(filePath);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  get,
  getAll,
  getUserCalibrationPhaseByUserId,
  updateCalibrationPhase,
  updateUserCalibrationPhaseAttachment,
  downloadUserCalibrationPhaseAttachment
};
