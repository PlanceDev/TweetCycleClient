const mongoose = require("mongoose");
const uuid = require("uuid");
const validator = require("mongoose-validator");
const { User } = require("../User");
const { Note } = require("../Note");
const { Contact } = require("../Contact");

const nameValidator = [
  validator({
    validator: "isLength",
    arguments: [2, 50],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
  validator({
    validator: "isAlphanumeric",
    passIfEmpty: true,
    message: "Name should contain alpha-numeric characters only",
  }),
];

const emailValidator = [
  validator({
    validator: "isEmail",
    message: "Email is not valid",
  }),
];

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
    email: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
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
    notes: [
      {
        type: String,
      },
    ],
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

    const contact = new Contact({
      creator,
      name: lead.contact,
      email: lead.email,
      phone: lead.phone,
      title: lead.title,
      company: lead.company,
    });

    await contact.save();

    let note = null;

    if (lead.note) {
      note = new Note({
        creator,
        note: lead.note,
      });

      await note.save();
    }

    const newLead = await this.create({
      creator,
      company: lead.company,
      contacts: [contact._id],
      email: lead.email,
      twitter: lead.twitter,
      phone: lead.phone,
      notes: note ? [note._id] : [],
    });

    return this.findOne({ creator, _id: newLead._id }).populate({
      path: "contacts",
      select: "_id name email phone createdAt",
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
        select: "_id title description dueDate completed createdAt",
        options: { sort: { dueDate: 1 } },
      })
      .populate({
        path: "contacts",
        select: "_id name email phone createdAt",
        options: { sort: { createdAt: 1 } },
      })
      .populate({
        path: "notes",
        select: "_id title content createdAt",
        options: { sort: { createdAt: 1 } },
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
