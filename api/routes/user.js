const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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


router.route("/login")
  .post((req, res, next) => {
    User.find({email: req.body.email})
      .exec()
      .then(user => {
        if(user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (error, result) => {
          if(error) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if(result) {
            const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            }, 
            'secret',
            {
              expiresIn: "1h"
            });
            return res.status(200).json({
              message: "Autho successful",
              token
            });
          }
          return res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(error => {
        res.status(500).json({
          error
        });
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