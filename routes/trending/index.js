const express = require("express");
let router = express.Router();
const controller = require("../../controllers/trending/TrendingController");

router.get("/twitter", controller.getTwitterTrendingProducts);
router.get("/facebook", controller.getFacebookTrendingProducts);

module.exports = router;
