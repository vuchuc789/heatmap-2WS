const db = require('../db/index');
const bcrypt = require('bcrypt');
const passport = require('passport');

// Get login page
exports.loginGet = (req, res) => {
    res.render('index', {page: 'login'});
};

// Get register page
exports.registerGet = (req, res) => {
    res.render('index', {page: 'register'});
};

// Create account
exports.registerPost = async (req, res) => {
    try {
        const { username, password1, hostname } = req.body;
        // hash plaintext password
        const hashedPassword = await bcrypt.hash(password1, 12);
        // store and get user id
        const results = await db.query('INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING id;', [ username, hashedPassword ]);
        const userID = results.rows[0].id;
        // store website hostname
        await db.query('INSERT INTO website (hostname, user_id) VALUES ($1, $2);', [ hostname, userID ]);

        req.flash('success_message', 'You are now registered and can log in');
        res.redirect('/user/login');
    } catch (e) {
        console.error(e);
    }
};

exports.loginPost = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    req.flash('success_message', 'You are logged out');
    res.redirect('/user/login');
};