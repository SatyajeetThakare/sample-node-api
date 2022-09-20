const routes = require('express').Router();
const {
  create,
  getTasks,
  getById,
  update
} = require('./task.controller');
const isAuthenticated = require('../../middlewares/isAuthenticated');

routes.get('/tasks/getTasks', isAuthenticated, getTasks);
routes.get('/tasks/getById/:id', isAuthenticated, getById);
routes.post('/tasks/create', isAuthenticated, create);
routes.patch('/tasks/update', isAuthenticated, update);

module.exports = routes;