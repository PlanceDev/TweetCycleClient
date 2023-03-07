const { Task } = require("../../models");

// @route   POST api/task
// @desc    Create a task
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const task = await Task.createTask(req.body, req.user._id);

    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// @route   GET api/task
// @desc    Get all tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    return res.status(401).send({ message: "Not implemented" });
    // const tasks = await Task.find();

    // res.json(tasks);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// @route   GET api/task/:id
// @desc    Get a task by id
// @access  Private
exports.getTaskById = async (req, res, next) => {
  try {
    return res.status(401).send({ message: "Not implemented" });

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.task = task;
    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// @route   PUT api/task/:id
// @desc    Update a task
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.updateTask(req.params.id, req.body, req.user._id);

    return res.send({ task });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// @route   DELETE api/task/:id
// @desc    Delete a task
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.deleteTask(req.params.id, req.user._id);

    if (!deleted) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.send({ message: "Task deleted" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
