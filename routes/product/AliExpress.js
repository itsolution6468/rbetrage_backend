const express = require("express");
let router = express.Router();
const controller = require("../../controllers/product/AliExpressController");

router.get("/update_db", controller.getAliExpressProducts);

module.exports = router;
