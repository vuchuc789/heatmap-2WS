const express = require('express');
const { loginGet, registerGet, loginPost , registerPost, logout } = require('../controllers/user');
const { checkInputRegister, checkUsernameRegister } = require('../middlewares/user');
const { checkWebsiteRegister } = require('../middlewares/site');

const route = express.Router();

route.get('/login', loginGet);
route.get('/register', registerGet);
route.post('/login', loginPost);
route.post('/register', checkInputRegister, checkUsernameRegister, checkWebsiteRegister, registerPost);
route.get('/logout', logout);

module.exports = route;