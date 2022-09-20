const allRoutes = require('express').Router();
const constants = require('../../constants/constants');

allRoutes.get('/', (req, res) => {
    res.json({
      message: constants.WELCOME_MSG
    })
})

const userRoutes = require('../../modules/users/user.routes');
const roleRoutes = require('../../modules/role/role.routes');
const eventRoutes = require('../../modules/event/event.routes');
const articleRoutes = require('../../modules/article/article.routes');
const taskRoutes = require('../../modules/task/task.routes');

allRoutes.use(userRoutes);
allRoutes.use(roleRoutes);
allRoutes.use(eventRoutes);
allRoutes.use(articleRoutes);
allRoutes.use(taskRoutes);

module.exports = allRoutes;