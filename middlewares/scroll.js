const db = require('../db/index');

exports.createScroll = async (req, res, next) => {
    try {
        const { pageId, maxLength } = req.body;

        let result = await db.query('SELECT * FROM scroll_bar WHERE webpage_id=$1 LIMIT 1;', [ pageId ]);

        if (!result.rows.length) {
            await db.query('INSERT INTO scroll_bar (webpage_id, max_length) VALUES ($1, $2)', [ pageId, maxLength ]);
        } else if (result.rows[0].max_length < maxLength) {
            await db.query('UPDATE scroll_bar SET max_length=$1 WHERE webpage_id=$2;', [ maxLength, pageId ])
        }

        next();
    } catch (e) {
        console.error(e);
        next(e);
    }
};