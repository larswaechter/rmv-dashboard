const { Router } = require("express");

const { findAll } = require("../db/query");

router = Router();

router.get("", (req, res) => {
  findAll((err, data) => {
    if (err) return res.sendStatus(500);
    res.json(data);
  });
});

module.exports = router;
