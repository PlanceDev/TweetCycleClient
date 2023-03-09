const { Subscription } = require("../models");

exports.payWall = async (req, res, next) => {
  try {
    const subscriptionExp = new Date(req.user.currentPeriodEnd) < new Date();

    if (subscriptionExp) {
      // Double check subscription status
      const subscription = await Subscription.findOne({
        owner: req.user._id,
      });

      if (!subscription) {
        return res.status(440).send({
          error: "Session expired",
          message:
            "Your session has expired. Please login again to continue using Tweet Cycle.",
        });
      }

      const validateSubExp =
        new Date(subscription.currentPeriodEnd) < new Date();

      if (validateSubExp) {
        // Set subscription status to inactive
        subscription.status = "inactive";
        await subscription.save();

        return res.status(402).send({
          error: "Please upgrade your subscription",
          message:
            "Your subscription has expired, please upgrade your subscription to continue using Tweet Cycle.",
        });
      }

      if (!validateSubExp) {
        // Update user object with new subscription details
        req.user.plan = subscription.plan;
        req.user.status = subscription.status;
        req.user.currentPeriodEnd = subscription.currentPeriodEnd;
      }
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};
