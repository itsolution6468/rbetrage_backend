const express = require("express");
let router = express.Router();
const controller = require("../../controllers/auth");
const { VerifyToken } = require('../../middlewares/auth');

router.post("/signUp", VerifyToken, controller.signUp);
router.post("/signIn", VerifyToken, controller.signIn);
router.post("/google", VerifyToken, controller.googleLogin);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-code", controller.verifyCode);
router.post("/reset-password", controller.resetPassword);
router.get('/', controller.getUser);

module.exports = router;
