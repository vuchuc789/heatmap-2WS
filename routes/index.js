const express = require('express');

const { ensureAuthenticated } = require('../middlewares/auth');

const route = express.Router();

route.get('/', (req, res) => {
  res.render('index');
});

route.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('index', {
    page: 'dashboard',
    username: req.user.username
  });
});

module.exports = route;
