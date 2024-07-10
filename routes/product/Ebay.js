const express = require("express");
let router = express.Router();
const controller = require("../../controllers/product/EbayController");

router.get("/update_db", controller.getEbayProducts);

module.exports = router;
