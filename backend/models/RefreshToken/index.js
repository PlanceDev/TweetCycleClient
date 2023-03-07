const mongoose = require("mongoose");
const uuid = require("uuid");

const RefreshTokenSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuid.v4,
    },
    token: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// create refresh token in database
RefreshTokenSchema.statics.createRefreshToken = async function (
  userId,
  refreshToken
) {
  const expireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const token = await this.create({
    token: refreshToken,
    user: userId,
    expireAt,
  });

  return token;
};

// delete refresh token from database
RefreshTokenSchema.statics.deleteRefreshToken = async function (user, token) {
  await this.findOneAndDelete({
    user,
    token,
  });

  return "Token deleted";
};

exports.RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
