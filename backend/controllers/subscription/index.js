const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_LIVE_KEY);
const { Subscription, User } = require("../../models");

// @route   POST /api/subscription
// @desc    Creates a subscription
// @access  Private
exports.createSubscription = async (req, res) => {
  try {
    console.log("createSubscription");

    return res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/subscription
// @desc    Gets a subscription by id
// @access  Private
exports.getSubscriptionById = async (req, res) => {
  try {
    return res.status(401).send({ message: "Not implemented" });

    return res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/subscription
// @desc    Updates a subscription by id
// @access  Private
exports.updateSubscriptionById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    const subscription = await Subscription.findOne({
      owner: req.user._id,
      _id: req.params.id,
      status: "active",
    });

    if (!subscription) {
      return res.status(404).json({ error: "Active subscription not found." });
    }

    // cancel stripe subscription
    const deleted = await stripe.subscriptions.del(user.stripeSubscriptionId);

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Error while cancelling subscription." });
    }

    subscription.status = "cancelled";
    user.stripeCardBrand = null;
    user.stripePaymentLast4 = null;
    user.stripeSubscriptionId = null;
    user.stripePaymentMethodId = null;

    await subscription.save();
    await user.save();

    return res.status(200).send({ subscription, user: user.toObject() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// @route   DELETE /api/subscription
// @desc    Deletes a subscription by id
// @access  Private
exports.deleteSubscriptionById = async (req, res) => {
  try {
    console.log("deleteSubscriptionById");

    return res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
