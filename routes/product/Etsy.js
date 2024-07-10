const express = require("express");
let router = express.Router();
const controller = require("../../controllers/product/EtsyController");

router.get("/update_db", controller.getEtsyProducts);

module.exports = router;
