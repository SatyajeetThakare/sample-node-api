const mongoose = require('mongoose');
const connectionOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.MONGODB_URI, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../modules/users/user.model'),
    Role: require('../modules/role/role.model'),
    Token: require('../modules/token/token.model'),
    Event: require('../modules/event/event.model'),
    Article: require('../modules/article/article.model'),
    Task: require('../modules/task/task.model'),
};