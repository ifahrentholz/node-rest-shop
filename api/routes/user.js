const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.route("/signup")
  .post((req, res, next) => {
    User.find({email: req.body.email})
      .exec()
      .then(user => {
        if(user.length >= 1) {
          return res.status(409).json({
            message: "User already exists"
          });
        } else {
          bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) {
              return res.status(500).json({
                error
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });
              user.save()
                .then(result => {
                  res.status(201).json({
                    message: "User created"
                  });
                })
                .catch(error => {
                  res.status(500).json({
                    error
                  });
                });
            }
          });
        }
      });
  });


router.route("/:id")
  .delete((req, res, next) => {
    User.remove({_id: req.params.id})
      .exec()
      .then(result => {
        result.status(200).json({
          message: "User deleted"
        });
      })
      .catch(error => {
        res.status(500).json({
          error
        });
      })
  });

module.exports = router;