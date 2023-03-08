const express = require("express");
const router = express.Router();
const { noteController } = require("../../controllers");

// @route   POST /api/note
// @desc    Creates a note
// @access  Private
router.post("/", noteController.createNote);

// @route   GET /api/note
// @desc    Gets all notes
// @access  Private
router.get("/", noteController.getNotes);

// @route   GET /api/note/:id
// @desc    Gets a note by id
// @access  Private
router.get("/:id", noteController.getNoteById);

// @route   PUT /api/note/:id
// @desc    Updates a note by id
// @access  Private
router.put("/:id", noteController.updateNote);

// @route   DELETE /api/note/:id
// @desc    Deletes a note by id
// @access  Private
router.delete("/:id", noteController.deleteNote);

module.exports = router;
