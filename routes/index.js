const express = require('express');

const homePage = require('../controllers/index');

const route = express.Router();

route.get('/', homePage);

module.exports = route;