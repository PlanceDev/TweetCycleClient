const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers");

// @route   POST /api/user/health
// @desc    checks if users is logged in
// @access  Private
router.get("/health", userController.checkHealth);

// @route   GET /api/user
// @desc    Gets a user by id
// @access  Private
router.get("/", userController.getUserById);

// @route PUT /api/user
// @desc Updates a user by id
// @access Private
router.put("/:id", userController.updateUserById);

module.exports = router;
