const UserAchievementsInfoService = require('../services/user-achievement-info.service');
const config = require('../config/config')

module.exports.updateUserAchievementInfo = (req, res, next) => {

  UserAchievementsInfoService.updateUserAchievementInfo(req, req.body).then((doc) => {
    res.json({ error: false, success: true, message: "User calibration phase modified", data: doc })
  }).catch(error => {
    next(error);
  });
}