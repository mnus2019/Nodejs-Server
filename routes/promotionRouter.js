const express = require("express");
const bodyParser = require("body-parser");
const Promotion = require("../models/promotion");

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter
  .route("/")
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        console.log("Promotion Created ", promotion);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res, next) => {
    Promotion.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });
promotionRouter
  .route("/:partnerId")
  .get((req, res, next) => {
  
    Promotion.findById(req.params.partnerId)
      .then((promotion) => {
        if (promotion) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        } else {
          err = new Error(`Promotion ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("Post operation not supported on /promotions");
  })
  .put((req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.partnerId,{'$set':req.body},{new:true})
      .then((promotion) => {
        
    
            
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(promotion);
           
      
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Promotion.findByIdAndDelete(req.params.partnerId)
      .then((promotion) => {
      
        
           
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(promotion);
            })
           
        
      
      .catch((err) => next(err));
  });



module.exports = promotionRouter;
