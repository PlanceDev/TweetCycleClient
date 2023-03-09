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
    company: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
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

// remove non numeric characters from phone number except + - ( )
contactSchema.pre("save", function (next) {
  const contact = this;

  if (contact.phone) {
    contact.phone = contact.phone.replace(/[^0-9+()-]/g, "");
  }

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
      company: contactData.company,
      name: contactData.name,
      title: contactData.title,
      email: contactData.email,
      phone: contactData.phone,
      twitter: contactData.twitter,
      url: contactData.url,
      location: contactData.location,
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

contactSchema.statics.getContacts = async function (creator) {
  try {
    if (!creator) {
      const err = new Error("Creator is required");
      err.status = 400;
      throw err;
    }

    const contacts = await this.find({ creator });

    return contacts;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

contactSchema.statics.updateContact = async function (
  id,
  contactData,
  creator
) {
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

    const contact = await this.findOneAndUpdate(
      { _id: id, creator },
      {
        company: contactData.company,
        name: contactData.name,
        title: contactData.title,
        email: contactData.email,
        phone: contactData.phone,
        twitter: contactData.twitter,
        url: contactData.url,
        location: contactData.location,
      },
      { new: true }
    );

    if (!contact) {
      const err = new Error("Contact is not a valid contact");
      err.status = 400;
      throw err;
    }

    await contact.save();

    return contact;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

contactSchema.statics.deleteContact = async function (id, creator) {
  try {
    if (!creator) {
      const err = new Error("Creator is required");
      err.status = 400;
      throw err;
    }

    const contact = await this.findOne({ _id: id, creator });

    if (!contact) {
      const err = new Error("Contact is not a valid contact");
      err.status = 400;
      throw err;
    }

    const { Lead } = require("../Lead");

    const lead = await Lead.findOne({ _id: contact.lead, creator });

    if (!lead) {
      const err = new Error("Lead is not a valid lead");
      err.status = 400;
      throw err;
    }

    if (lead.contacts.length === 1) {
      const err = new Error("Lead must have at least one contact");
      err.status = 400;
      throw err;
    }

    if (lead.creator !== creator || contact.creator !== creator) {
      const err = new Error(
        "You are not authorized to delete a contact for this lead"
      );
      err.status = 400;
      throw err;
    }

    lead.contacts = lead.contacts.filter((contact) => contact !== id);
    await lead.save();

    await contact.remove();

    return true;
  } catch (err) {
    throw err;
  }
};

exports.Contact = mongoose.model("Contact", contactSchema);
