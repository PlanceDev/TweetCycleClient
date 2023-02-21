const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../../middleware");
const { authController } = require("../../controllers");

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", authController.register);

// @route   POST api/auth/verify-email
// @desc    Verify a users email address
// @access  Public
router.post("/verify-email", authController.verifyEmail);

// @route   POST api/auth/resend-email
// @desc    Resend a verification email
// @access  Public
router.post("/resend-email", authController.resendVerificationEmail);

// @route   POST api/auth/forgot-password
// @desc    Send a password reset email
// @access  Public
router.post("/forgot-password", authController.forgotPassword);

// @route   PUT api/auth/reset-password
// @desc    Reset a users password
// @access  Public
router.put("/reset-password", authController.resetPassword);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", authController.login);

module.exports = router;
