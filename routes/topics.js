const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/", function (req, res) {
  models.Topic.findAll({
    // get all the first level topics
    where: { parentId: null },
    include: {
      model: models.Topic,
      as: "Subtopics",
    },
  })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/", function (req, res) {
  const { name } = req.body;
  models.Topic.create({ name })
    .then((data) => res.send(data))
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/:id/topics", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const topic = await models.Topic.findOne({
      where: {
        id,
      },
    });
    const subtopic = await topic.createSubtopic({ name });

    res.send(subtopic);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
