const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/", (req, res) => {
  const where = req.query;

  models.Artist.findAll({
    where,
    attributes: ["name"],
    // include all nested relationships
    // include: { all: true, nested: true },
    include: {
      model: models.Album,
      attributes: ["name"],
      include: {
        model: models.Song,
        attributes: ["name"],
      },
    },
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

// get all artists with their album counts:
router.get("/albumcount", (req, res) => {
  models.Artist.findAll({
    attributes: {
      include: [
        [
          models.Sequelize.fn("COUNT", models.Sequelize.col("albums.id")),
          "albumCount",
        ],
      ],
    },
    include: {
      model: models.Album,
      attributes: [], // important
    },
    group: ["Artist.id"], // necessary when selecting many records
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

// get all artists with their song counts:
router.get("/songcount", (req, res) => {
  models.Artist.findAll({
    attributes: {
      include: [
        [
          models.Sequelize.fn("COUNT", models.Sequelize.col("albums.songs.id")),
          "songCount",
        ],
      ],
    },
    include: {
      model: models.Album,
      attributes: [], // important
      include: {
        model: models.Song,
        attributes: [], // important
      },
    },
    group: ["Artist.id"], // necessary when selecting many records
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

// CREATE NEW ARTIST
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const artist = await models.Artist.create({ name });
    res.send(artist);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET ONE ARTIST BY ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  models.Artist.findOne({
    where: {
      id,
    },
    attributes: {
      include: [
        [
          models.Sequelize.fn("COUNT", models.Sequelize.col("albums.id")),
          "albumCount",
        ],
      ],
    },
    include: {
      model: models.Album,
      attributes: [],
    },
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

// COUNT SONGS FROM ARTIST
router.get("/:id/songcount", (req, res) => {
  const { id } = req.params;
  models.Artist.findOne({
    where: {
      id,
    },
    attributes: {
      include: [
        [
          models.Sequelize.fn("COUNT", models.Sequelize.col("albums.songs.id")),
          "songCount",
        ],
      ],
    },
    include: {
      model: models.Album,
      attributes: [],
      include: {
        model: models.Song,
        attributes: [],
      },
    },
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

// COUNT SONGS FROM ARTIST - METHOD 2
router.get("/:id/songcount2", (req, res) => {
  const { id } = req.params;

  models.Song.count({
    col: "id",
    // distinct: true,
    // include: {
    //   model: models.Album,
    //   attributes: [],
    //   include: {
    //     model: models.Artist,
    //     attributes: [],
    //   },
    // },
    // group: ["Song.id", "Album.id"], // necessary when selecting many records
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

// GET ALL ALBUMS FROM AN ARTIST
router.get("/:id/albums", async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await models.Artist.findOne({
      where: {
        id,
      },
    });

    const albums = await artist.getAlbums();

    res.send(albums);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ADD NEW ALBUM FOR AN ARTIST
router.post("/:id/albums", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const artist = await models.Artist.findOne({
      where: {
        id,
      },
    });

    const album = await artist.createAlbum({ name });

    res.send(album);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
