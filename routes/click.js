const express = require('express');
const db = require('../db/index');

const { authenticatePage } = require('../middlewares/page');
const { createElement } = require('../middlewares/element');

const route = express.Router();

route.post('/create', authenticatePage, createElement, async (req, res) => {
  try {
    const { x, y, timestamp } = req.body;
    const { elementId } = res.locals;

    await db.query(
      'INSERT INTO click (x_position, y_position, element_id, timestamp) VALUES ($1, $2, $3, $4)',
      [x, y, elementId, timestamp]
    );
    res.send('Click is saved');
  } catch (e) {
    console.error(e);
  }
});

module.exports = route;
