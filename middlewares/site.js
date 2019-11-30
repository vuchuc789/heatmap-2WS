const db = require('../db/index');

exports.checkWebsiteExistence = async (req, res, next) => {
    try {
        const { hostname } = req.body;
        const result = await db.query('SELECT * FROM website WHERE hostname=$1 LIMIT 1;', [ hostname ]);

        if (result.rows.length) {
            res.locals.siteId = result.rows[0].id;
        }

        next();
    } catch(e) {
        console.error(e);
        next(e);
    }
};

exports.checkWebsiteRegister = async (req, res, next) => {
    try {
        const { username, password1, password2, hostname } = req.body;
        const result = await db.query('SELECT * FROM website WHERE hostname=$1 LIMIT 1;', [ hostname ]);

        if (result.rows.length) {
            res.render('index', {
                page: 'register',
                errors : ['Hostname is already existed'],
                username,
                password1,
                password2,
                hostname
            });
        } else {
            next();
        }
    } catch(e) {
        console.error(e);
        next(e);
    }
};