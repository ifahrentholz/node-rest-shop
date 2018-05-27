const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.route("/")
  .get((req, res, next) => {
    Product.find()
      .exec()
      .then(docs => {
        res.status(200).json(docs)
      })
      .catch(error => {
        res.status(500).json({
          error
        });
      });
  })
  .post((req, res, next) => {
    const { name, price } = req.body;
    
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name,
      price
    });

    product
      .save()
      .then(result => {
        res.status(201)
          .json({
            message: "handle product requests POST",
            createProduct: product
          });
    })
    .catch(error => {
      res.status(500).json({
        error
      });
    });


  });
  

router.route("/:id")
  .get((req, res, next) => {
    const id = req.params.id;
    
    Product.findById(id)
      .exec()
      .then(doc => {
        if(doc) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({
            message: "Not found"
          });
        }
      })
      .catch(error => {
        res.status(500).json({
          error
        });
      });

  })
  .patch((req, res, next) => {
    const id = req.params.id;
    const { name, price } = req.body;
    const updateOps = {};

    for(const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    console.log(updateOps);
    
    Product.update({ _id: id}, {$set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({result});
      })
      .catch(error => {
        res.status(500).json({error});
      });
  })
  .delete((req, res, next) => {
    const id = req.params.id;
    Product.remove({
      _id: id
    })
      .exec()
      .then(doc => {
        res.status(200).json(doc);
      })
      .catch(error => {
        res.status(500).json({
          error
        });
      });
  });

module.exports = router;