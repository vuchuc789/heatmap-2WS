const express = require('express');
const { loginGet, registerGet, loginPost , registerPost } = require('../controllers/user');

const router = express.Router();

router.get('/login', loginGet);
router.get('/register', registerGet);
router.post('/login', loginPost);
router.post('/register', registerPost);

module.exports = router;