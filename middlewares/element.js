const db = require('../db/index');

exports.createElement = async (req, res, next) => {
    try {
        const { pageId, tagName, position } = req.body;

        let result = await db.query('SELECT * FROM element WHERE tag_name=$1 AND position=$2 AND web_page_id=$3 LIMIT 1;', [ tagName, position, pageId ]);

        if (!result.rows.length) {
            result = await db.query('INSERT INTO element (tag_name, position, web_page_id) VALUES ($1, $2, $3) RETURNING id;', [ tagName, position, pageId ]);
        }

        res.locals.elementId = result.rows[0].id;
        next();
    } catch (e) {
        console.error(e);
        next(e);
    }
};