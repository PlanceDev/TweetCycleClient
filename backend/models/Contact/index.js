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

// Create a partial index on the email field to ensure that each user
// has a unique email address for their contacts (but not across all users)
contactSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { creator: { $exists: true } } }
);

contactSchema.pre("save", async function (next) {
  if (!this.phone) return;

  // Remove all non-numeric characters from the phone number
  this.phone = this.phone.replace(/\D/g, "");
  next();
});

contactSchema.statics.createContact = async function (contactData) {
  const contact = new this({
    creator: contactData.creator,
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    title: contactData.title,
    company: contactData.company,
  });

  await contact.save();
  return contact;
};

exports.Contact = mongoose.model("Contact", contactSchema);
