const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/index');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const results = await db.query('SELECT * FROM "user" WHERE username=$1 LIMIT 1;', [ username ]);
            if (!results.rows.length) {
                return done(null, false, { message: 'That username is not registered' });
            }

            const user = results.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Password incorrect' });
            }

            return done(null,  user);
        } catch (e) {
            return done(e);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const results = await db.query('SELECT * FROM "user" WHERE id=$1 LIMIT 1;', [ id ]);
            const user = results.rows[0];
            done(null, user);
        } catch (e) {
            done(e);
        }
    })
};