const express = require("express");
let router = express.Router();
const controller = require("../../controllers/product/AmazonController");

router.get("/update_db", controller.getAmazonProducts);

module.exports = router;
