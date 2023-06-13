const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/", function (req, res) {
  models.Actor.findAll({ include: models.Movie })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/raw", async function (req, res) {
  const [results, metadata] = await models.sequelize.query(
    "SELECT `Actor`.`id`, `Actor`.`name`, `Actor`.`createdAt`, `Actor`.`updatedAt`, `Movies`.`id` AS `Movies.id`, `Movies`.`name` AS `Movies.name`, `Movies`.`createdAt` AS `Movies.createdAt`, `Movies`.`updatedAt` AS `Movies.updatedAt`, `Movies->ActorMovies`.`createdAt` AS `Movies.ActorMovies.createdAt`, `Movies->ActorMovies`.`updatedAt` AS `Movies.ActorMovies.updatedAt`, `Movies->ActorMovies`.`ActorId` AS `Movies.ActorMovies.ActorId`, `Movies->ActorMovies`.`MovieId` AS `Movies.ActorMovies.MovieId` FROM `Actors` AS `Actor` LEFT OUTER JOIN ( `ActorMovies` AS `Movies->ActorMovies` INNER JOIN `Movies` AS `Movies` ON `Movies`.`id` = `Movies->ActorMovies`.`MovieId`) ON `Actor`.`id` = `Movies->ActorMovies`.`ActorId`;"
  );
  res.send(results);
});

router.post("/", function (req, res) {
  const { name } = req.body;
  models.Actor.create({ name })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/search", function (req, res) {
  models.Actor.findAll({
    where: {
      Movie: 1,
    },
    include: models.Movie,
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/:id", function (req, res) {
  const { id } = req.params;
  models.Actor.findOne({
    where: {
      id,
    },
    include: models.Movie,
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/:id/movies", function (req, res) {
  const { id } = req.params;

  models.Actor.findOne({
    where: {
      id,
    },
    // include: models.Movie,
  })
    .then((actor) => {
      actor
        .getMovies()
        .then((movies) => res.send(movies))
        .catch((error) => {
          res.status(500).send(error);
        });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/:id/movies", function (req, res) {
  const { id } = req.params;
  const { name } = req.body;

  models.Actor.findOne({
    where: {
      id,
    },
  })
    .then((actor) => {
      actor
        .createMovie({ name })
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

router.put("/:id/movies", async (req, res) => {
  const { id } = req.params;
  const { movies } = req.body;

  try {
    const actor = await models.Actor.findOne({
      where: {
        id,
      },
    });

    const data = await actor.addMovies(movies);

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
