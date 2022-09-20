const User = require('../models/User')
const UserService = require('../services/user.service');
const UserAcademicInfoService = require('../services/user-academic-info.service');
const UserAchievementInfoService = require('../services/user-achievement-info.service');
const UserUniversitiesInfoService = require('../services/user-university-info.service');
const UserTaskInfoService = require('../services/user-task-info.service');
const UserExtraCurricularInfoService = require('../services/user-extracurricular-info.service');
const UserPlannerInfoService = require('../services/user-planner-info.service');
const bcrypt = require('bcryptjs')
const constants = require('../constants/constants')
const jwt = require('jsonwebtoken')
const Token = require('../models/Token')
const config = require('../config/config')
const assert = require('assert');
const UserAcademicInfo = require('../models/UserAcademicInfo');
const UserUniversitiesInfo = require('../models/UserUniversitiesInfo');

module.exports.register = (req, res, next) => {

  // Generate hash password from text
  let hashedPassword = bcrypt.hashSync(req.body.password, 8)
  let user = req.body;
  user.hash = hashedPassword;
  // if (user.password === user.confirmPassword) {
  User.create(user, (err, doc) => {
    if (err) return handleError(err, req, res, next)
    res.status(constants.HTTP_200).json({
      success: true,
      error: false,
      message: constants.USER_CREATED,
      data: doc
    });
  });
  // } else {
  //   res.json({
  //     error: true,
  //     success: false,
  //     message: 'Confirm password does not match the password feild'
  //   })
  // }
}

exports.login = (req, res, next) => {
  try {
    User.findOne({
      'email': req.body.email
    }, (err, data) => {
      if (err) {
        return res.json({
          success: false,
          error: true,
          message: err,
          data: {}
        })
      }
      if (data != null) {

        let passwordIsValid = bcrypt.compareSync(req.body.password, data.hash)
        // let books_pw = crypto.createHash('md5').update(req.body.books_pw).digest('hex')
        if (passwordIsValid) {
          let buff = new Buffer(config.token.secret)
          let base64data = buff.toString('base64')
          let token = jwt.sign({
            id: data.email
          }, base64data, {
            // expiresIn: '24h'
            expiresIn: config.token.validity, // expires in 24 hours
          })
          try {
            req.session.login(req, data, (err) => {
              if (err) return handleError(err, req, res, next)
            })
          } catch (error) {
            return handleError(error, req, res, next)
          }

          req.session.token = token
          let userDetail = JSON.parse(JSON.stringify(data))
          userDetail.token = 'Bearer ' + token
          delete userDetail.hash

          // Check if user has done the payment only if role is student (i.e. id == 2)
          if (userDetail.role == 1 && !userDetail.paymentDone) {
            res.json({
              success: false,
              error: true,
              message: 'Payment not done',
              data: {}
            });
          } else {
            res.json({
              success: true,
              error: false,
              message: 'Authentication successful!',
              data: userDetail
            });
          }


          let createdAt = Date.now()
          Token.update({
            email: req.body.email
          }, {
            token: token,
            createdAt: createdAt
          }, {
            upsert: true,
            setDefaultsOnInsert: true
          }, (err, doc) => {
            // console.log(' in token doc',doc);
            return err;
          })
        } else {
          return res.json({
            error: true,
            success: false,
            message: 'Please check whether you have entered valid password ',
            data: []
          })
        }
      } else {
        res.json({
          error: true,
          success: false,
          message: 'Please check whether you have entered valid email',
          data: []
        });
      }
    })
  } catch (error) {
    console.log('error', error);
  }
}

module.exports.changePassword = (req, res, next) => {
  let request = req.body
  let id = req.body._id
  req.body.email = req.session.userInfo.email
  // console.log('--req.body.email ', req.body.email);

  User.findOne({
    'email': req.body.email
  }, (err, data) => {
    console.log('data', data);

    if (err) {
      return res.json({
        error: false,
        success: true,
        message: err.message,
        data: []
      })
    }
    if (data != null) {
      let passwordIsValid = bcrypt.compareSync(req.body.password, data.hash)
      // let books_pw = crypto.createHash('md5').update(req.body.books_pw).digest('hex')
      if (passwordIsValid) {
        let hashedPassword = bcrypt.hashSync(req.body.newpassword, 8)
        let _User = req.body
        _User.hash = hashedPassword
        User.findOneAndUpdate({
          'email': req.body.email
        }, {
          $set: {
            'hash': _User.hash
          }
        }, {
          new: true
        }, (err, newPassword) => {
          if (err) return handleError(err, req, res, next)
          else
            res.json({
              success: true,
              error: false,
              message: 'Password is updated',
              data: newPassword
            })
        })

      } else {
        return res.json({
          error: true,
          success: false,
          message: 'Please check whether you have entered valid password ',
          data: []
        })
      }
    } else {
      res.json({
        error: true,
        success: false,
        message: 'Please check whether you have entered valid email',
        data: []
      });
    }
  })
}

module.exports.verifyToken = (req, res, next) => {
  //  get the token from the request
  let Bearer = null
  if (req.headers['authorization']) Bearer = req.headers['authorization'].split(' ')[1]
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || Bearer
  //  if token exists, verify the same
  //  console.log(token)
  // also verify token from session data
  // console.log('--token',token)
  let user = null
  if (token) {
    let buff = new Buffer(config.token.secret)
    let base64data = buff.toString('base64')
    // console.log('====base64data',base64data,buff);

    jwt.verify(token, base64data, function (err, decoded) {
      if (err) {
        // console.log('----err', err)
        return handle401Error({
          'message': constants.INVALID_SESSION
        }, req, res, next)
      }
      // console.log('----decoded',decoded);
      // console.log('--req.session', req.session);


      req.decoded = decoded
      user = decoded.id
      req.isAuthenticated = true
      //  res.status(constants.HTTP_200).json({'error': false, 'message': constants.VALID_TOKEN})
    })
    //  let dbToken = null
    let q = {
      email: user
    }
    // console.log('q', q)
    let willGetAUser = User.findOne(q).exec()
    assert.ok(willGetAUser instanceof Promise)
    willGetAUser
      .then((doc) => {
        // console.log(doc)
        req.session.userInfo = doc
        // req.session.user = req.session.userInfo.email
        let willGetAToken = Token.findOne(q).exec()
        assert.ok(willGetAToken instanceof Promise)
        willGetAToken
          .then((doc) => {
            //  dbToken = doc.token
            // console.log(doc, "Doc")
            if (!doc) return handle401Error({
              'message': constants.INVALID_SESSION
            }, req, res, next)
            if (doc.token !== token) return handle401Error({
              'message': constants.INVALID_SESSION
            }, req, res, next)
            //send session
            let resData = req.session
            next()
            // res.json({error: false, success: true, message: '', data: resData})
          }).catch((err) => {
            console.log(err)
            return handle401Error({
              'message': constants.INVALID_SESSION
            }, req, res, next)
          })
      }).catch((err) => {
        console.log(err)
        return handle401Error({
          'message': constants.INVALID_SESSION
        }, req, res, next)
      })
  } else {
    return handle401Error({
      'message': constants.INVALID_SESSION
    }, req, res, next)
  }
}

module.exports.me = (req, res, next) => {

  let Bearer = null
  if (req.headers['authorization']) Bearer = req.headers['authorization'].split(' ')[1]
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || Bearer

  // console.log('--00 req.session', req.session.user,req.session)
  let _email = null
  if (req.session.userInfo.email) {
    // req.session.user = req.session.userInfo.email
    _email = req.session.userInfo.email.toLowerCase()
  } else {
    return handle403Error({
      'message': constants.INVALID_SESSION
    }, req, res, next)
  }
  // console.log('==-11 req.session again', req.session)
  // console.log('--- 1_email', _email)
  let dbToken = null
  let willGetAToken = Token.findOne({
    email: _email
  }).exec()
  assert.ok(willGetAToken instanceof Promise)
  willGetAToken.then((doc) => {
    // console.log('--1 doc', doc)
    dbToken = doc.token
    if ((null === dbToken) || (!dbToken === token)) return handle403Error({
      'message': constants.INVALID_TOKEN
    }, req, res, next)
    let resData = req.session
    // user info here
    // console.log(resData)
    // console.log(_email)
    // console.log('1 --token', token)
    // console.log('1-- dbToken', dbToken)
    if (dbToken === token) {

      res.json({
        error: false,
        success: true,
        message: 'valid token',
        data: []
      })
    } else {
      res.json({
        error: true,
        success: false,
        message: 'invalid token',
        data: []
      })
    }
    // User.findOne({ 'email': _email }).exec()
    //     .then((doc) => {
    //         console.log(_email, doc)
    //         resData.userInfo = doc
    //         res.json({ error: false, success: true, message: `namaste ${doc.email}`, data: resData })
    //     })
    //     .catch((err) => handleError(err, req, res, next))
  }).catch((err) => {
    return handle403Error({
      'message': constants.INVALID_TOKEN
    }, req, res, next)
  })
}

module.exports.createUser = async (req, res, next) => {

  let hashedPassword = bcrypt.hashSync(req.body.password, 8)
  let user = req.body;
  user.hash = hashedPassword;

  console.log('req.body', req.body);

  UserService.createUser(user).then((doc) => {
    // console.log('doc', doc);
    user._id = doc._id;
    UserAcademicInfoService.createUserAcademicInfo(user).then((userAcademicDoc) => {
      UserAchievementInfoService.createUserAchievementInfo(user).then((userAchievementDoc) => {
        UserTaskInfoService.createUserTask(user).then((userTaskDoc) => {
          UserExtraCurricularInfoService.createUserExtraCurricularInfo(user).then((userExtraCurricularDoc) => {
            // res.json({ error: false, success: true, message: "User created successfully", data: doc });
            UserPlannerInfoService.createUserPlanner(user).then((userPlannerDoc) => {
              res.json({ error: false, success: true, message: "User created successfully", data: doc });
            }).catch(error => {
              res.json({ error: false, success: true, message: error || error.error || error.message, data: {} })
            });
          }).catch(error => {
            res.json({ error: false, success: true, message: error || error.error || error.message, data: {} })
          });
        }).catch(error => {
          res.json({ error: false, success: true, message: error || error.error || error.message, data: {} })
        });
      }).catch(error => {
        res.json({ error: false, success: true, message: error || error.error || error.message, data: {} })
      });
    }).catch(error => {
      res.json({ error: false, success: true, message: error || error.error || error.message, data: {} })
    });
  }).catch(error => {
    next(error);
  });
}

module.exports.updateUser = function (req, res, next) {
  let _id = req.params.id
  let user = req.body
  // console.log('here');

  let email = /\S+@\S+\.\S+/
  User.findByIdAndUpdate(_id, user, {
    new: true
  }, function (err, userUpdate) {
    if (err) {
      return handleError(err, req, res, next)
    } else if (user.email && !user.email.match(email)) {
      err = 'Invalid  email'
      res.json({
        success: false,
        error: true,
        message: err,
        data: []
      })

    } else {
      res.json({
        success: true,
        error: false,
        message: 'User updated successfully',
        data: userUpdate
      })
    }

  })
}

module.exports.getUserById = async function (req, res, next) {
  try {
    console.log("In getUserById");
    UserService.getUserById(req.params.id).then(async (doc) => {
      if (doc) {
        let data = await getUserInfo(req.params.id);
        // console.log('data', data);
        doc = doc.toObject();
        doc.academicInfo = data.academicInfo;
        doc.universityInfo = data.universityInfo;
        doc.achievementInfo = data.achievementInfo;
        doc.taskInfo = data.taskInfo;
        doc.extraCurricularInfo = data.extraCurricularInfo;
      } else {
        var message = "User not found";
      }
      res.json({ error: false, success: true, message: message ? message : "User fetched successfully", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

function getUserInfo(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let userInfo = {
        academicInfo: await UserAcademicInfoService.getUserAcademicInfoByUserId(userId),
        achievementInfo: await UserAchievementInfoService.getUserAchievementInfo(userId),
        universityInfo: await UserUniversitiesInfoService.getUserUniversityInfo(userId),
        taskInfo: await UserTaskInfoService.getUserTaskById(userId),
        extraCurricularInfo: await UserExtraCurricularInfoService.getUserExtraCurricularInfoByUserId(userId)
      }
      resolve(userInfo);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports.getUsers = async (req, res, next) => {
  let _filter = req.query.filter
  let allUser = {}
  if (_filter) {
    allUser = JSON.parse(_filter)
  }

  UserService.getUsers().then((doc) => {
    res.json({ error: false, success: true, message: "Users list", data: doc })
  }).catch(error => {
    res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
  });
}

module.exports.forgotPassword = async (req, res, next) => {
  UserService.forgotPassword().then((doc) => {
    res.json({ error: false, success: true, message: "Email sent successfully", data: doc })
  }).catch(error => {
    res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
  });
}

module.exports.deleteUser = function (req, res, next) {
  UserService.deleteUser(req).then((doc) => {
    res.json({ error: false, success: true, message: "User deleted successfully", data: doc })
  }).catch(error => {
    res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
  });
}