const express = require('express');
const db = require('../db/index');

const { authenticatePage } = require('../middlewares/page');
const { createScroll } = require('../middlewares/scroll');

const route = express.Router();

route.post('/create', authenticatePage, createScroll, async (req, res) => {
  try {
    let { stamps, maxLength, pageId } = req.body;
    let unitsChange = [];

    console.log(stamps);

    for (let e of stamps) {
      const tempLength = e.position + e.length;

      if (tempLength > maxLength) {
        continue;
      }

      if (unitsChange.length < e.position) {
        let append = [];
        append.length = e.position - unitsChange.length;
        append.fill(0);

        unitsChange = [...unitsChange, ...append];
      }

      if (tempLength <= unitsChange.length) {
        for (let i = e.position; i < tempLength; i++) {
          unitsChange[i] += e.weight;
        }
      } else {
        for (let i = e.position; i < unitsChange.length; i++) {
          unitsChange[i] += e.weight;
        }

        let append = [];
        append.length = tempLength - unitsChange.length;
        append.fill(e.weight);

        unitsChange = [...unitsChange, ...append];
      }
    }

    for (let i = unitsChange.length - 1; i >= 0; i--) {
      const result = await db.query(
        'UPDATE scroll_unit SET weight = weight + $1 WHERE webpage_id=$2 AND position=$3 RETURNING id;',
        [unitsChange[i], pageId, i]
      );
      if (!result.rows.length) {
        await db.query(
          'INSERT INTO scroll_unit (weight, position, webpage_id) VALUES ($1, $2, $3)',
          [unitsChange[i], i, pageId]
        );
      }
    }

    res.send('saved');
  } catch (e) {
    console.error(e);
  }
});

/* route.post('/beacon', authenticatePage, createScroll, () => {

}); */

module.exports = route;
