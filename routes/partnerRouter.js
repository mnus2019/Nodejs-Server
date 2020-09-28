const express = require("express");
const bodyParser = require("body-parser");
const Partners = require("../models/partner");
const authenticate = require("../authenticate");
const cors = require('./cors');

const partnerRouter = express.Router();

partnerRouter.use(bodyParser.json());

partnerRouter.route("/");
partnerRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partners.find()
     
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partners.create(req.body)
      .then((partner) => {
        console.log("Partners Created ", partner);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /partners");
  })
  .delete(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partners.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );
partnerRouter
  .route("/:partnerId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partners.findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(partner);
        } else {
          err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("Post operation not supported on /partners");
  })
  .put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partners.findByIdAndUpdate(
      req.params.partnerId,
      { $set: req.body },
      { new: true }
    )
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partners.findByIdAndDelete(req.params.partnerId)
        .then((partner) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(partner);
        })

        .catch((err) => next(err));
    }
  );
module.exports = partnerRouter;
