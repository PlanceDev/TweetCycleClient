const mongoose = require("mongoose");
const uuid = require("uuid");
const validator = require("mongoose-validator");

const leadSchema = new mongoose.Schema(
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
    company: {
      type: String,
      required: true,
      trim: true,
    },
    contacts: [
      {
        type: String,
        trim: true,
        ref: "Contact",
      },
    ],
    tasks: [
      {
        type: String,
        ref: "Task",
        trim: true,
      },
    ],
    notes: [
      {
        type: String,
        ref: "Note",
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: [
        "new",
        "engaged",
        "qualified",
        "unqualified",
        "cancelled",
        "won",
        "lost",
        "not interested",
      ],
      default: "new",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

leadSchema.pre("save", async function (next) {
  if (!this.phone) return;

  // Remove all non-numeric characters from the phone number
  this.phone = this.phone.replace(/\D/g, "");
  next();
});

leadSchema.statics.createLead = async function (lead, creator) {
  try {
    if (!creator) {
      const err = new Error("Creator is required");
      err.status = 400;
      throw err;
    }

    if (!lead) {
      const err = new Error("Lead is required");
      err.status = 400;
      throw err;
    }

    if (!lead.company || !lead.contact) {
      const err = new Error("Company and contact are required");
      err.status = 400;
      throw err;
    }

    const { User } = require("../User");

    const user = await User.findById(creator);

    if (!user) {
      const err = new Error("Creator is not a valid user");
      err.status = 400;
      throw err;
    }

    if (!lead.company || !lead.contact) {
      const err = new Error("Company and contact are required");
      err.status = 400;
      throw err;
    }

    let lead_id = uuid.v4();

    const { Contact } = require("../Contact");

    // Create a contact and add it to the lead
    const contact = new Contact({
      lead: lead_id,
      creator,
      company: lead.company,
      name: lead.contact,
      title: lead.title,
      email: lead.email,
      phone: lead.phone,
      twitter: lead.twitter,
      url: lead.url,
      location: lead.location,
    });

    await contact.save();

    // Create the lead and add the contact to it
    const newLead = await new this({
      _id: lead_id,
      creator,
      company: lead.company,
      contacts: [contact._id],
    });

    // If there is a note, create a note and add it to the lead
    const { Note } = require("../Note");

    if (lead.note) {
      const note = new Note({
        creator,
        body: lead.note,
        lead: newLead._id,
      });

      await note.save();

      newLead.notes = [note._id];
    }

    await newLead.save();

    return this.findOne({ creator, _id: newLead._id }).populate({
      path: "contacts",
      options: { sort: { createdAt: 1 } },
    });
  } catch (err) {
    throw new Error(err);
  }
};

leadSchema.statics.updateLeadCompany = async function (id, company, creator) {
  try {
    if (!creator || !id || !company) {
      const err = new Error("Lead company, id, and creator are required.");
      err.status = 400;
      throw err;
    }

    const lead = await this.findOneAndUpdate(
      { _id: id, creator },
      { company },
      {
        new: true,
      }
    );

    return lead;
  } catch (err) {
    throw new Error(err);
  }
};

leadSchema.statics.updateLeadStatus = async function (id, status, creator) {
  try {
    if (!creator || !id || !status) {
      const err = new Error("creator status, id, and creator are required.");
      err.status = 400;
      throw err;
    }

    const lead = await this.findOneAndUpdate(
      { _id: id, creator },
      { status },
      {
        new: true,
      }
    )
      .populate({
        path: "tasks",
        model: "Task",
        options: { sort: { dueDate: 1 } },
      })
      .populate({
        path: "contacts",
        model: "Contact",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "notes",
        model: "Note",
        options: { sort: { createdAt: -1 } },
      });

    if (!lead) {
      const err = new Error("Lead not found");
      err.status = 404;
      throw err;
    }

    return lead;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.Lead = mongoose.model("Lead", leadSchema);
