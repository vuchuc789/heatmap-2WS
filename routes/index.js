const express = require('express');

const { homePage, dashboard} = require('../controllers/index');
const { ensureAuthenticated } = require('../middlewares/auth');

const route = express.Router();

route.get('/', homePage);
route.get('/dashboard', ensureAuthenticated, dashboard);

module.exports = route;