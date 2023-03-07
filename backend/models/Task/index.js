const mongoose = require("mongoose");
const uuid = require("uuid");
const { Lead } = require("../Lead");

const taskSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuid.v4,
    },
    creator: {
      type: String,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lead: {
      type: String,
      ref: "Lead",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

taskSchema.statics.createTask = async function (task, creator) {
  if (!task.lead) throw new Error("Lead ID is required.");

  const lead = await Lead.findById(task.lead);
  task.creator = creator;

  if (!lead) throw new Error("Lead not found");

  if (lead.creator != task.creator)
    throw new Error("Not authorized to create task for this lead.");

  if (task.dueDate < Date.now()) {
    throw new Error("Due date must be in the future.");
  }

  const newTask = await this.create(task);

  lead.tasks.push(newTask._id);
  await lead.save();

  return newTask;
};

taskSchema.statics.updateTask = async function (taskId, task, creator) {
  try {
    const taskToUpdate = await this.findOne({ _id: taskId, creator });

    if (!taskToUpdate) throw new Error("Task not found");

    if (task.dueDate < Date.now()) {
      throw new Error("Due date must be in the future.");
    }

    if (!task.dueDate || !task.title) throw new Error("Invalid task data");

    const updatedTask = await this.findOneAndUpdate(
      { _id: taskId, creator },
      task,
      {
        new: true,
      }
    );

    return updatedTask;
  } catch (error) {
    throw error;
  }
};

taskSchema.statics.deleteTask = async function (taskId, creator) {
  try {
    const task = await this.findOne({ _id: taskId, creator });
    const lead = await Lead.findOne({ tasks: taskId });

    if (!task) throw new Error("Task not found");
    if (!lead) throw new Error("Lead not found");

    if (lead.creator != creator)
      throw new Error("Not authorized to delete task for this lead.");

    lead.tasks = lead.tasks.filter((task) => task != taskId);
    await lead.save();

    await task.delete();

    return true;
  } catch (error) {
    throw error;
  }
};

exports.Task = mongoose.model("Task", taskSchema);
