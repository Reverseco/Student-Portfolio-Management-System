const express = require("express");
var db = require("../database/db");
const router = express.Router();
var { data } = require("./loginauth");
const middlewares = require("../utils/verifyUser.js");

// to render links page with sending all links
router.get("/links",middlewares.verifyUser, async (req, res) => {
  try {
    
    var sql = `SELECT * FROM links where enroll_no="${req.user.enroll_no}" `;
    db.query(sql, (error, result) => {
      if (error) console.log(error);
      else {

        res.render("links", {
          links: result,
        });
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});

module.exports=router;