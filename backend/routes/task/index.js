const express = require("express");
const router = express.Router();
const { taskController } = require("../../controllers");

// @route   POST api/task
// @desc    Create a task
// @access  Private
router.post("/", taskController.createTask);

// @route   GET api/task
// @desc    Get all tasks
// @access  Private
router.get("/", taskController.getTasks);

// @route   GET api/task/:id
// @desc    Get a task by id
// @access  Private
router.get("/:id", taskController.getTaskById);

// @route   PUT api/task/:id
// @desc    Update a task
// @access  Private
router.put("/:id", taskController.updateTask);

// @route   DELETE api/task/:id
// @desc    Delete a task
// @access  Private
router.delete("/:id", taskController.deleteTask);

module.exports = router;
