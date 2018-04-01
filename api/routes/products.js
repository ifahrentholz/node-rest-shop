const express = require("express");
const router = express.Router();

router.route("/")
  .get((req, res, next) => {
    res.status(200)
      .json({
        message: "handle product requests"
      });
  })
  .post((req, res, next) => {
    const { name, price } = req.body;
    const product = {
      name,
      price
    };

    res.status(201)
      .json({
        message: "handle product requests POST",
        createProduct: product
      });
  });
  

router.route("/:id")
  .get((req, res, next) => {
    const id = req.params.id;
    res.status(200)
      .json({
        message: `handle product request for ${id}`,
        id
      });
  })
  .patch((req, res, next) => {
    const id = req.params.id;
    res.status(200)
      .json({
        message: `updated product: ${id}`,
        id
      });
  })
  .delete((req, res, next) => {
    const id = req.params.id;
    res.status(200)
      .json({
        message: `deleted product: ${id}`,
        id
      });
  });

module.exports = router;