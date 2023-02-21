const mongoose = require("mongoose");
const uuid = require("uuid");

const verificationTokenSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuid.v4,
      required: true,
    },
    owner: {
      type: String,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
      unique: true,
      default: uuid.v4,
    },
    createdAt: {
      type: Date,
      expires: "1h",
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a new token
verificationTokenSchema.statics.generateToken = async function (owner) {
  const verificationToken = await this.create({
    owner,
  });

  return verificationToken;
};

// Verify the users token
verificationTokenSchema.statics.checkToken = async function (token) {
  const verificationToken = await this.findOne({ token });

  console.log(verificationToken);

  if (!verificationToken || verificationToken.isExpired) {
    throw new Error("Invalid token");
  }

  return verificationToken;
};

exports.VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);
