const express = require("express");
let router = express.Router();
const controller = require("../../controllers/product/ProductController");

router.post("/find-similar", controller.findSimilarProducts);
router.get("/total", controller.getTotalNumberOfProducts);
router.get("/sorted_products", controller.getSortedProducts);
router.get("/", controller.getProducts);

module.exports = router;
