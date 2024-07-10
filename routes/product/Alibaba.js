const express = require("express");
let router = express.Router();
const controller = require("../../controllers/product/AlibabaController");

router.get("/update_db", controller.getAlibabaProducts);

module.exports = router;
