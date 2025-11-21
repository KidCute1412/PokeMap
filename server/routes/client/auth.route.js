import express from "express";
import * as authController from "../../controllers/client/auth.controller.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-otp-signup", authController.verifySignupOTP);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-otp-reset-password", authController.otpForgotPassword);

// router.post("/login", authController.login);

// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password", authController.resetPassword);
// router.post("/logout", authController.logout);

export default router;
