const allRoutes = require('express').Router();
const constants = require('../../constants/constants');

allRoutes.get('/', (req, res) => {
  res.json({
    message: constants.WELCOME_MSG
  })
})

// allRoutes.get('/', (req, res) => {
//     res.json({
//       message: 'Welcome to Sample API'
//     })
// })

module.exports = allRoutes;