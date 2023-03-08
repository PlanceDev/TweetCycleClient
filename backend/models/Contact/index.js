const mongoose = require("mongoose");
const uuid = require("uuid");
const validator = require("mongoose-validator");

const contactSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
    },
    company: {
      type: String,
    },
    notes: [
      {
        type: String,
        ref: "Note",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

contactSchema.pre("save", async function (next) {
  if (!this.phone) return;

  // Remove all non-numeric characters from the phone number
  this.phone = this.phone.replace(/\D/g, "");
  next();
});

contactSchema.statics.createContact = async function (contactData, creator) {
  try {
    if (!creator) {
      const err = new Error("Creator is required");
      err.status = 400;
      throw err;
    }

    if (!contactData.name) {
      const err = new Error("Contact is required");
      err.status = 400;
      throw err;
    }

    if (!contactData.lead) {
      const err = new Error("Lead is required");
      err.status = 400;
      throw err;
    }

    const { Lead } = require("../Lead");

    const lead = await Lead.findOne({ _id: contactData.lead, creator });

    if (!lead) {
      const err = new Error("Lead is not a valid lead");
      err.status = 400;
      throw err;
    }

    if (lead.creator !== creator) {
      const err = new Error(
        "You are not authorized to create a contact for this lead"
      );
      err.status = 400;
      throw err;
    }

    const contact = await this.create({
      creator: creator,
      lead: contactData.lead,
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      title: contactData.title,
      company: contactData.company,
    });

    await contact.save();

    lead.contacts.push(contact._id);
    await lead.save();

    return contact;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.Contact = mongoose.model("Contact", contactSchema);
