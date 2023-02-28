const express = require("express");
const router = express.Router();
const { subscriptionController } = require("../../controllers");

// @route   POST /api/subscription
// @desc    Creates a subscription
// @access  Private
router.post("/", subscriptionController.createSubscription);

// @route   GET /api/subscription
// @desc    Gets a subscription by id
// @access  Private
router.get("/:id", subscriptionController.getSubscriptionById);

// @route   PUT /api/subscription
// @desc    Updates a subscription by id
// @access  Private
router.put("/:id", subscriptionController.updateSubscriptionById);

// @route   DELETE /api/subscription
// @desc    Deletes a subscription by id
// @access  Private
router.delete("/:id", subscriptionController.deleteSubscriptionById);

module.exports = router;
