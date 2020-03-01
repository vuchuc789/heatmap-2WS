const express = require("express");
const db = require("../db/index");

const { ensureAuthenticated } = require("../middlewares/auth");
const { checkWebsiteExistence } = require("../middlewares/site");
const { checkPageExistence } = require("../middlewares/page");
const { authenticatePage } = require("../middlewares/page");

const route = express.Router();

route.post(
  "/create",
  checkWebsiteExistence,
  checkPageExistence,
  async (req, res) => {
    try {
      const { pathname } = req.body;
      let { siteId, pageId } = res.locals;
      let status = "existed";

      if (!siteId) {
        return res.send("Website was not registered");
      }

      if (!pageId) {
        const result = await db.query(
          "INSERT INTO webpage (pathname, website_id) VALUES ($1, $2) RETURNING id;",
          [pathname, siteId]
        );
        pageId = result.rows[0].id;
        status = "created";
      }

      res.json({
        pageId,
        status
      });
    } catch (e) {
      console.error(e);
    }
  }
);

route.get("/read", authenticatePage, async (req, res) => {
  try {
    const { pageId, begin, end } = req.query;
    let result;

    if (begin && end) {
      result = await db.query(
        "SELECT c.element_id, e.tag_name, e.position, c.x_position, c.y_position FROM (SELECT * FROM element WHERE web_page_id=$1) AS e INNER JOIN click c ON e.id = c.element_id WHERE c.date>=$2 AND c.date<=$3;",
        [pageId, begin, end]
      );
    } else {
      result = await db.query(
        "SELECT c.element_id, e.tag_name, e.position, c.x_position, c.y_position FROM (SELECT * FROM element WHERE web_page_id=$1) AS e INNER JOIN click c ON e.id = c.element_id;",
        [pageId]
      );
    }

    res.json({
      data: result.rows
    });
  } catch (e) {
    console.error(e);
  }
});

route.get("/readScroll", authenticatePage, async (req, res) => {
  try {
    const { pageId, maxLength } = req.query,
      result = await db.query(
        "SELECT position, weight FROM scroll_unit WHERE webpage_id = $1 AND position < $2 ORDER BY position ASC",
        [pageId, maxLength]
      );

    res.json({
      data: result.rows
    });
  } catch (e) {
    console.error(e);
  }
});

module.exports = route;
