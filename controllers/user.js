const db = require('../db/index');
const bcrypt = require('bcrypt');
const uuidGeneratorV4 = require('uuid/v4');
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
    const { username, password1, password2, hostname } = req.body;

    // check input
    // errors list
    let errors = [];

    // check empty input
    if (!username || !password1 || !password2 || !hostname) {
        errors.push('Please fill in all fields');
    }

    // check password
    if (password1 !== password2) {
        errors.push('Password is not match');
    }

    // check password length
    if (password1.length < 6) {
        errors.push('Password should be at least 6 characters');
    }

    if (errors.length > 0) {
        // render register page with error
        res.render('index', {
            page: 'register',
            errors,
            username,
            password1,
            password2,
            hostname
        });
    } else {
        // check database
        try {
            // check username
            const results1 = await db.query('SELECT * FROM "user" WHERE username=$1 LIMIT 1;', [ username ]);
            const results2 = await db.query('SELECT * FROM website WHERE hostname=$1 LIMIT 1;', [ hostname ]);
            if (results1.rows.length) {
                errors.push('Username is already registered');
            }

            if (results2.rows.length) {
                errors.push('Hostname is already registered');
            }

            if (errors.length > 0) {
                // render register page with error
                res.render('index', {
                    page: 'register',
                    errors,
                    username,
                    password1,
                    password2,
                    hostname
                });
            } else {
                // hash plaintext password
                const hashedPassword = await bcrypt.hash(password1, 12);
                // store and get user id
                const results = await db.query('INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING id;', [ username, hashedPassword ]);
                const userID = results.rows[0].id;
                // store website hostname
                await db.query('INSERT INTO website (hostname, user_id) VALUES ($1, $2);', [ hostname, userID ]);

                req.flash('success_message', 'You are now registered and can log in');
                res.redirect('/user/login');
            }
        } catch (e) {
            console.error(e);
        }
    }
};

exports.loginPost = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
};