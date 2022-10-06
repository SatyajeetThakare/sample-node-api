const routes = require('express').Router();
const {
  create,
  getQuestions,
  getQuestionAnswersById,
  update,
  answerAQuestion,
  _delete
} = require('./question-and-answer.controller');
const { isAuthenticated } = require('../../middlewares/isAuthenticated');

routes.get('/question-and-answers/getQuestions', isAuthenticated, getQuestions);
routes.get('/question-and-answers/getQuestionAnswersById/:id', isAuthenticated, getQuestionAnswersById);
routes.post('/question-and-answers/create', isAuthenticated, create);
routes.delete('/question-and-answers/deleteQuestion/:id', isAuthenticated, _delete);
routes.put('/question-and-answers/update', isAuthenticated, update);
routes.put('/question-and-answers/answerAQuestion', isAuthenticated, answerAQuestion);

module.exports = routes;