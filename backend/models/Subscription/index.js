const mongoose = require("mongoose");
const uuid = require("uuid");

const subscriptionSchema = new mongoose.Schema({
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
  plan: {
    type: String,
    required: true,
    enum: ["trial", "basic", "premium", "enterprise"],
    default: "free",
  },
  frequency: {
    type: String,
    required: true,
    enum: ["monthly", "yearly"],
    default: "monthly",
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive", "cancelled"],
    default: "active",
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
    default: Date.now() + 14 * 24 * 60 * 60 * 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

subscriptionSchema.statics.createSubscription = async function (
  owner,
  plan,
  frequency
) {
  const subscription = await this.create({
    owner,
    plan,
    frequency,
  });
  return subscription;
};

exports.Subscription = mongoose.model("Subscription", subscriptionSchema);
