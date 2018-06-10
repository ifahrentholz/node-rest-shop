const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/png') {
    //accept
    cb(null, true);
  } else {
    // reject
    cb(null, false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
  fileSize: 1024 * 1024 * 5 // 5MB
}});
const Product = require("../models/product");

router.route("/")
  .get((req, res, next) => {
    const host = req.get("host");
    Product.find()
      .select("name price _id image")
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          products: docs.map(doc => {
            const {name, price, _id, image} = doc;
            return {
              id: _id,
              name,
              price,
              image,
              request: {
                url: `http://${host}/products/${_id}`
              }
            }
          }),
          request: {
            url: `http://${host}/products`
          }
        });
      })
      .catch(error => {
        res.status(500).json({
          error
        });
      });
  })


  .post(upload.single('productImage'), (req, res, next) => {
    const host = req.get("host");
    const { name, price } = req.body;

    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name,
      price,
      image: req.file.path
    });

    product.save()
      .then(result => {
        const {name, price, _id, image} = result;
        res.status(201).json({
          createProduct: {
            name,
            price,
            id: _id,
            image,
            request: {
              url: `http://${host}/products/${_id}`
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
    const host = req.get("host");
    const id = req.params.id;

    Product.findById(id)
      .select("name price _id image")
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
    const host = req.get("host");
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
            "url": `http://${host}/products/${id}`
          }
        });
      })
      .catch(error => {
        res.status(500).json({error});
      });
  })


  .delete((req, res, next) => {
    const host = req.get("host");
    const id = req.params.id;
    Product.remove({
      _id: id
    })
    .exec()
    .then(doc => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          url: `http://${host}/products`
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