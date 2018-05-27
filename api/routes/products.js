const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.route("/")
  .get((req, res, next) => {
    Product.find()
      .select("name price _id")
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          products: docs.map(doc => {
            const {name, price, _id} = doc;
            return {
              name: name,
              price: price,
              id: _id,
              request: {
                url: `http://localhost:3000/products/${_id}`
              }
            }
          }),
          request: {
            url: `http://localhost:3000/products`
          }
        });
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

    product.save()
      .then(result => {
        const {name, price, _id} = result;
        res.status(201).json({
          createProduct: {
            name,
            price,
            id: _id,
            request: {
              url: `http://localhost:3000/products/${_id}`
            }
          }
        });
      })
      .catch(error => {
        res.status(500).json({
          error
        });
      });
  });
  

// BY ID
router.route("/:id")
  .get((req, res, next) => {
    const id = req.params.id;
    
    Product.findById(id)
      .select("name price _id")
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
    
    Product.update({ _id: id}, {$set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          result,
          request: {
            "url": `http://localhost:3000/products/${id}`
          }
        });
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
      res.status(200).json({
        message: "Product deleted",
        request: {
          url: `http://localhost:3000/products`
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        error
      });
    });
  });


module.exports = router;