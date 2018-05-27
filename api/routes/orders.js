const express = require("express");
const router = express.Router();


router.route("/")
  .get((req, res, next) => {
    res.status(200)
      .json({
        message: "Orders fetched"
      })
  })
  .post((req, res, next) => {
    const {productId, quantity} = req.body;
    const order = {
      productId,
      quantity
    }

    res.status(201)
      .json({
        message: "Order was created",
        order
      });
  });

router.route("/:id")
  .get((req, res, next) => {
    const { id } = req.params;
    res.status(200)
      .json({
        message: "Order details",
        id
      });
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    res.status(201)
      .json({
        message: "Order was deleted",
        id
      });
  });

module.exports = router;