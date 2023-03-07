const mongoose = require("mongoose");
const uuid = require("uuid");
const validator = require("mongoose-validator");

const noteSchema = new mongoose.Schema(
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
    lead: {
      type: String,
      ref: "Lead",
    },
    contact: {
      type: String,
      ref: "Contact",
    },
    note: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

exports.Note = mongoose.model("Note", noteSchema);
