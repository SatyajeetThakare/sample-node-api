const UserAchievementInfo = require('../models/UserAchievementsInfo')

function createUserAchievementInfo(user) {

  delete user.student.academic;
  let achievementInfo = user.student;
  achievementInfo.user = user._id;

  return new Promise((resolve, reject) => {
    try {
      UserAchievementInfo.create(achievementInfo, function (error, doc) {
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

function updateUserAchievementInfo(req) {
  return new Promise((resolve, reject) => {
    try {

      const query = { _id: req.body._id };
      const update = req.body;

      UserAchievementInfo.updateOne(query, update).exec(function (error, doc) {
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

function getUserAchievementInfo(id) {
  return new Promise((resolve, reject) => {
    try {
      var query = { user: id }
      UserAchievementInfo.findOne(query).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          // console.log('doc', doc);
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  createUserAchievementInfo,
  updateUserAchievementInfo,
  getUserAchievementInfo
};
