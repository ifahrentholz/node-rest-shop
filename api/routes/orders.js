const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product.js");

router.route("/")
  .get((req, res, next) => {
    const host = req.get("host");
    Order.find()
      .select('product quanity _id')
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map(doc => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: 'GET',
                url: `http://${host}/orders/${doc._id}`
              }
            }
          }),
        });
      })
      .catch( error => {
        res.status(500).json(error);
      });
  })
  .post((req, res, next) => {
    const {productId, quantity} = req.body;

    Product.findById(productId)
      .then(product => {
        if(!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const host = req.get("host");
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity,
          product: productId
        });

        order.save()
          .then(result => {
            res.status(201).json({
              message: 'Order stored',
              createdOrder: {
                _id: result._id,
                product: result.product,
                quanity: result.quanity
              },
              request: {
                type: 'GET',
                url: `http://${host}/orders/${result._id}`
              }
            });
          })
          .catch(error => {
            console.log(error);
            res.status(500).json({
              error
            });
          });
      })
      .catch(error => {
        res.status(500).json({
          message: "Product not found",
          error
        });
      });
  });

router.route("/:id")
  .get((req, res, next) => {
    const host = req.get("host");
    const { id } = req.params;
    
    Order.findById(id)
      .exec()
      .then(order => {
        if(!order) {
          return res.status(404).json({
            message: 'Order not found'
          });
        }
        res.status(200).json({
          order,
          request: {
            type: "GET",
            url: `http://${host}/orders`
          }
        });
      })
      .catch(error => {
        res.status(500)
          .json({
            error
          });
      });
  })
  .delete((req, res, next) => {
    const host = req.get("host");
    const { id } = req.params;
    Order.remove({
      _id: req.params.id
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: `http://${host}/orders`,
          body: {
            productId: 'ID', quantity: 'Number'
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

module.exports = router;