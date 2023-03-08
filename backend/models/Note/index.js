const mongoose = require("mongoose");
const uuid = require("uuid");

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
    body: {
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

noteSchema.statics.createNote = async function (note, creator) {
  try {
    const { Lead } = require("../Lead");

    const lead = await Lead.findOne({
      _id: note.lead,
      creator: creator,
    });

    if (lead.creator !== creator) {
      throw new Error("You are not authorized to create a note for this lead.");
    }

    const newNote = await this.create({
      creator,
      lead: note.lead,
      body: note.body,
    });

    if (!newNote) {
      throw new Error("Note could not be created.");
    }

    lead.notes.push(newNote._id);
    await lead.save();

    return newNote;
  } catch (error) {
    throw error;
  }
};

noteSchema.statics.updateNote = async function (id, note, creator) {
  try {
    const { Lead } = require("../Lead");

    const lead = await Lead.findOne({
      _id: note.lead,
      creator: creator,
    });

    if (!lead) {
      throw new Error("Lead not found.");
    }

    if (lead.creator !== creator) {
      throw new Error("You are not authorized to update a note for this lead.");
    }

    const updatedNote = await this.findOneAndUpdate(
      {
        lead: lead._id,
        _id: id,
        creator: creator,
      },
      {
        body: note.body,
      },
      {
        new: true,
      }
    );

    if (!updatedNote) {
      throw new Error("Note could not be updated.");
    }

    return updatedNote;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

noteSchema.statics.deleteNote = async function (id, creator) {
  try {
    const { Lead } = require("../Lead");

    const note = await this.findOne({
      _id: id,
      creator: creator,
    });

    if (!note) {
      throw new Error("Note not found.");
    }

    const lead = await Lead.findOne({
      _id: note.lead,
      creator: creator,
    });

    if (!lead) {
      throw new Error("Lead not found.");
    }

    if (lead.creator !== creator) {
      throw new Error("You are not authorized to delete a note for this lead.");
    }

    const deletedNote = await this.findOneAndDelete({
      _id: id,
      creator: creator,
    });

    if (!deletedNote) {
      throw new Error("Note could not be deleted.");
    }

    lead.notes.pull(deletedNote._id);
    await lead.save();

    return deletedNote;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.Note = mongoose.model("Note", noteSchema);
