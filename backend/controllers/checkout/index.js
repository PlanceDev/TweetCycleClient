const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_LIVE_KEY);
const { Subscription, User } = require("../../models");

// @route   GET /api/checkout/:plan
// @desc    get checkout session
// @access  Private
exports.getCheckoutSession = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      // customer_email: user.email,
      client_reference_id: user._id,
      success_url: `${process.env.PRODUCTION_URL}/a/account/billing/checkout-success`,
      cancel_url: `${process.env.PRODUCTION_URL}/a/account/billing`,
      line_items: [{ price: process.env.PREMIUM_PRICE_ID, quantity: 1 }],
      mode: "subscription",
    });

    return res.status(200).send(session);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/checkout/success
// @desc    send new JWT after successful checkout and get user subscription
// @access  Private
exports.checkOutSuccess = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const subscription = await Subscription.findOne({
      owner: user._id,
    });

    // Create and send new access token to update user subscription
    const accessToken = jwt.sign(
      {
        _id: user._id,
        twitterId: user.twitterId || null,
        twitterUsername: user.twitterUsername || null,
        plan: subscription.plan,
        status: subscription.status,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).send({
      user: user.toObject(),
      subscription,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
