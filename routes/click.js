const express = require('express');

const { createClick } = require('../controllers/click');
const { authenticatePage } = require('../middlewares/page');
const { createElement } = require('../middlewares/element');

const route = express.Router();

route.post('/create', authenticatePage, createElement, createClick);

module.exports = route;