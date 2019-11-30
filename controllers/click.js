const db = require('../db/index');

exports.createClick = async (req, res) => {
    try {
        const { x, y } = req.body;
        const { elementId } = res.locals;

        await db.query('INSERT INTO click (x_position, y_position, element_id) VALUES ($1, $2, $3)', [ x, y, elementId ]);
        res.send('Click is saved');
    } catch (e) {
        console.error(e);
    }
};