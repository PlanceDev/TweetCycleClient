const express = require("express");
const router = express.Router();
const { contactController } = require("../../controllers");

// @route   POST /api/contact
// @desc    Creates a contact
// @access  Private
router.post("/", contactController.createContact);

// @route   GET /api/contact
// @desc    Gets all contacts
// @access  Private
router.get("/", contactController.getContacts);

// @route   GET /api/contact/:id
// @desc    Gets a contact by id
// @access  Private
router.get("/:id", contactController.getContactById);

// @route   PUT /api/contact/:id
// @desc    Updates a contact by id
// @access  Private
router.put("/:id", contactController.updateContact);

// @route   DELETE /api/contact/:id
// @desc    Deletes a contact by id
// @access  Private
router.delete("/:id", contactController.deleteContact);

module.exports = router;
