const express = require("express");
let router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const authRouter = require("./auth");
const productRouter = require("./product");
const trendingRouter = require("./trending");

router.use("/products", productRouter);
router.use("/auth", authRouter);
router.use("/trending", trendingRouter);
router.get("/auth-endpoint", (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

module.exports = router;
