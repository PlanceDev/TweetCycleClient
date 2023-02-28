const express = require("express");
const router = express.Router();
const { checkoutController } = require("../../controllers");

// @route   GET /api/checkout/:plan
// @desc    Create a checkout session
// @access  Private
router.get("/", checkoutController.getCheckoutSession);

// @route   GET /api/checkout/success
// @desc    send new JWT after successful checkout and update user subscription
// @access  Private
router.post("/success-redirect", checkoutController.checkOutSuccess);

module.exports = router;
