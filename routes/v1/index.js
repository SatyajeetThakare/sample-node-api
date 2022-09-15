const allRoutes = require('express').Router();

allRoutes.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Sample API'
    })
})

module.exports = allRoutes;