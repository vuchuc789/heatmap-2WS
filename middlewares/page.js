const db = require('../db/index');

exports.checkPageExistence = async (req, res, next) => {
    try {
        const { pathname } = req.body;
        const { siteId } = res.locals;

        if (!siteId) {
            return next();
        }

        const result = await db.query('SELECT * FROM webpage WHERE pathname=$1 AND website_id=$2 LIMIT 1;', [ pathname, siteId ]);

        if (result.rows.length) {
            res.locals.pageId = result.rows[0].id;
        }

        next();
    } catch(e) {
        console.error(e);
        next(e);
    }
};

exports.authenticatePage = async (req, res, next) => {
    let { pathname, pageId } = req.body;
    if (!(pathname && pageId)) {
        pathname = req.query.pathname;
        pageId = req.query.pageId;
    }
    const result = await db.query('SELECT * FROM webpage WHERE id=$1 LIMIT 1;', [ pageId ]);

    if (pathname !== result.rows[0].pathname) {
        res.send('Error: Something wrong with your response !!')
    } else {
        next();
    }
};