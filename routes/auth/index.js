const express = require("express");
let router = express.Router();
const controller = require("../../controllers/auth");

router.post("/signUp", controller.signUp);
router.post("/signIn", controller.signIn);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-code", controller.verifyCode);
router.post("/reset-password", controller.resetPassword);
module.exports = router;
