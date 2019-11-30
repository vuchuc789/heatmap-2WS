const db = require('../db/index');

exports.checkInputRegister = (req, res, next) => {
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
        next();
    }
};

exports.checkUsernameRegister = async (req, res, next) => {
    // check database
    try {
        const { username, password1, password2, hostname } = req.body;
        // check username
        const results = await db.query('SELECT * FROM "user" WHERE username=$1 LIMIT 1;', [ username ]);

        if (results.rows.length) {
            // render register page with error
            res.render('index', {
                page: 'register',
                errors: [ 'Username is already registered' ],
                username,
                password1,
                password2,
                hostname
            });
        } else {
            next();
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
};