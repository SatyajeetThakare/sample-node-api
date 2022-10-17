const routes = require('express').Router();
const {
  informNewPodcastIsAvailable,
  readPodcasts
} = require('./podcast.controller');
const { isAuthenticated } = require('../../middlewares/isAuthenticated');

routes.post('/podcasts/informNewPodcastIsAvailable', isAuthenticated, informNewPodcastIsAvailable);
routes.get('/podcasts/readPodcasts', isAuthenticated, readPodcasts);

module.exports = routes;