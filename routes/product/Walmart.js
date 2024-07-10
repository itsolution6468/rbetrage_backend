const express = require("express");
let router = express.Router();
const controller = require("../../controllers/product/WalmartController");

router.get("/update_db", controller.getWalmartProducts);

module.exports = router;
