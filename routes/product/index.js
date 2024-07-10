const express = require("express");
let router = express.Router();

const amazonRouter = require("./Amazon");
const alibabaRouter = require("./Alibaba");
const aliExpressRouter = require("./AliExpress");
const walmartRouter = require("./Walmart");
const etsyRouter = require("./Etsy");
const ebayRouter = require("./Ebay");
const mainRouter = require("./Product");

router.use("/amazon", amazonRouter);
router.use("/alibaba", alibabaRouter);
router.use("/ali-express", aliExpressRouter);
router.use("/walmart", walmartRouter);
router.use("/etsy", etsyRouter);
router.use("/ebay", ebayRouter);
router.use("/", mainRouter);

module.exports = router;
