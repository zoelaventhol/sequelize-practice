const express = require("express");
const router = express.Router();
const models = require("../models");

// get all nodes with all their connections
router.get("/", async (req, res) => {
  try {
    const data = await models.Node.findAll({
      include: {
        model: models.Node,
        as: "Connection",
      },
    });
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get all connections from one node
router.get("/:id/edges", async (req, res) => {
  const { id } = req.params;
  try {
    const node = await models.Node.findOne({
      where: { id },
    });

    const data = await node.getConnection();

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const data = await models.Node.create({ name });
    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id/edges", async (req, res) => {
  const { id } = req.params;
  const { edges } = req.body;

  try {
    const node = await models.Node.findOne({
      where: {
        id,
      },
    });

    // without extra data in the junction table, we can just pass an array of IDs
    // const data = await node.addConnection(edges); // we are assuming edges is an array of IDs: [2,3,5,7,8]

    // with extra data in the junction table, we need to pass that data as well in the through option
    const data = [];
    for (const { id, option } of edges) {
      // we are assuming edges is an array of objects: [{id: 2, option: 'a'}, {id: 3, option: 'b'}]
      data.push(await node.addConnection(id, { through: { name: option } }));
    }

    // Alternatively, if we have a model for the Edge, we can use its create method directly:
    // for (const { id: edgeId, option } of edges) {
    //   data.push(
    //     await models.Edge.create({
    //       Node1Id: id,
    //       Node2Id: edgeId,
    //       name: option,
    //     })
    //   );
    // }

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
