const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/", function (req, res) {
  models.Album.findAll()
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/", function (req, res) {
  const { name } = req.body;
  models.Album.create({ name })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/:id", function (req, res) {
  const { id } = req.params;
  models.Album.findOne({
    where: {
      id,
    },
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
