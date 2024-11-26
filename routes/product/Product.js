const express = require("express");
let router = express.Router();
const controller = require("../../controllers/product/ProductController");
const {
  getScrappingProducts,
} = require("../../controllers/product/scrappingController");

router.post("/find-similar", controller.findSimilarProducts);
router.get("/total", controller.getTotalNumberOfProducts);
router.get("/filtered_products", controller.getSortedProducts);
router.get("/winning_products", controller.getWinningProducts);
router.get("/", controller.getProducts);
router.get("/alibaba-scrape", getScrappingProducts);

module.exports = router;
