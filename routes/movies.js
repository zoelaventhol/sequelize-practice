const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/", function (req, res) {
  models.Movie.findAll()
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/", function (req, res) {
  const { name } = req.body;
  models.Movie.create({ name })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/:id", function (req, res) {
  const { id } = req.params;
  models.Movie.findOne({
    where: {
      id,
    },
    include: models.Actor,
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/:id/actors", function (req, res) {
  const { id } = req.params;

  models.Movie.findOne({
    where: {
      id,
    },
    // include: models.Album,
  })
    .then((movie) => {
      movie
        .getActors()
        .then((actors) => res.send(actors))
        .catch((error) => {
          res.status(500).send(error);
        });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/:id/actors", function (req, res) {
  const { id } = req.params;
  const { name } = req.body;

  models.Movie.findOne({
    where: {
      id,
    },
  })
    .then((movie) => {
      movie
        .createActor({ name })
        .then((data) => {
          res.send(data);
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.put("/:id/actors", async (req, res) => {
  const { id } = req.params;
  const { actors } = req.body;

  try {
    const movie = await models.Movie.findOne({
      where: {
        id,
      },
    });

    const data = await movie.addActors(actors);

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
