const User = require('../models/User');
const Mailer = require('../utility/Mailer');
const MyEmmiter = require('../utility/EventCore');

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function getCalibrationPhases(){
  return [{
    name: 'Initiation Form', link: '', isUserCompleted: true, isAdminApproved: true, isUserActivePhase: false, isAdminActivePhase: false
  }, {
    name: 'Myer Briggs', link: 'https://www.16personalities.com/free-personality-test', isUserCompleted: false, isAdminApproved: false, isUserActivePhase: true, isAdminActivePhase: true
  }, {
    name: 'Holland Code', link: 'https://openpsychometrics.org/tests/RIASEC/', isUserCompleted: false, isAdminApproved: false, isUserActivePhase: false, isAdminActivePhase: false
  }, {
    name: 'Mock ACT/SAT', link: 'https://www.ueseducation.com/diagnostic', isUserCompleted: false, isAdminApproved: false, isUserActivePhase: false, isAdminActivePhase: false
  }, {
    name: 'Intuitive Sciences', link: '', isUserCompleted: false, isAdminApproved: false, isUserActivePhase: false, isAdminActivePhase: false
  }];
}

function createUser(user) {
  return new Promise((resolve, reject) => {
    try {
      user.calibrationPhase = {
        calibrationPhaseCompleted: false,
        phases: getCalibrationPhases()
      }
      User.create(user, function (error, doc) {
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

function getUsers() {
  return new Promise((resolve, reject) => {
    try {
      User.find({ 'isActive': true }).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          doc.sort((a,b) => (a.name.firstName.toLowerCase() > b.name.firstName.toLowerCase()) ? 1 : ((b.name.firstName.toLowerCase() > a.name.firstName.toLowerCase()) ? -1 : 0))
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    try {
      User.findById(id).exec(function (error, doc) {
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

// User.findById(_id).exec(function (err, displayUser) {
//   if (err) return handleError(err, req, res, next)
//   else
//     res.json({
//       success: true,
//       error: false,
//       message: 'user',
//       data: displayUser
//     })
// })

function checkIfUserHasDonePayment(user) {
  return new Promise((resolve, reject) => {
    try {
      var query = { email: user.email, paymentDone: true };
      User.findOne(query, function (error, doc) {
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

function forgotPassword(req) {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ email: req.body.email, 'isActive': true }).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          let email = {
            to: [ doc.email ],
            subject: 'Reset Password | 221b Analytics',
            content: 'done ----',
            contentType: 'text/html',
          }
          MyEmmiter.emit('sendMail', email, _app)
        }
      });
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
}

function deleteUser(req) {
  return new Promise((resolve, reject) => {
    try {
      User.update({ '_id': req.params.id },
        { $set: { 'isActive': false, remarks: req.body.remarks || 'Deleted' } },
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

module.exports = {
  get,
  getAll,
  createUser,
  getUserById,
  getUsers,
  checkIfUserHasDonePayment,
  forgotPassword,
  deleteUser
};
