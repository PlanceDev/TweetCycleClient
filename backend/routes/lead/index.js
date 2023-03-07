const express = require("express");
const router = express.Router();
const { leadController } = require("../../controllers");

// @route   POST /api/lead
// @desc    Creates a lead
// @access  Private
router.post("/", leadController.createLead);

// @route   GET /api/lead
// @desc    Gets all leads
// @access  Private
router.get("/", leadController.getLeads);

// @route   GET /api/lead/:id
// @desc    Gets a lead by id
// @access  Private
router.get("/:id", leadController.getLeadById);

// @route   PUT /api/lead/:id
// @desc    Updates a lead by id
// @access  Private
router.put("/:id", leadController.updateLead);

// @route   DELETE /api/lead/:id
// @desc    Deletes a lead by id
// @access  Private
router.delete("/:id", leadController.deleteLead);

module.exports = router;
