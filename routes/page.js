const express = require('express');

const { createPage, readPage } = require('../controllers/page');
const { ensureAuthenticated } = require('../middlewares/auth');
const { checkWebsiteExistence } = require('../middlewares/site');
const { checkPageExistence } = require('../middlewares/page');
const {authenticatePage} = require("../middlewares/page");

const route = express.Router();

route.post('/create', checkWebsiteExistence, checkPageExistence, createPage);
route.get('/read', authenticatePage, readPage);

module.exports = route;