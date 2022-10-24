const session = require('express-session');

module.exports.getUserInfo = function(req, res, next) {
    return req.session.userInfo;
}