const stripe = require("stripe")(process.env.STRIPE_LIVE_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const { Subscription, User } = require("../models");

const handleInvoicePaymentSucceeded = async (invoicePaymentSucceeded) => {
  try {
    const stripeSubscriptionId = invoicePaymentSucceeded.subscription;

    const customer = invoicePaymentSucceeded.customer;

    const amount = invoicePaymentSucceeded.subtotal_excluding_tax;

    const charge = await stripe.charges.retrieve(
      invoicePaymentSucceeded.charge
    );

    const card = charge.payment_method_details.card;

    const user = await User.findOne({ stripeCustomerId: customer });

    const subscription = await Subscription.findOne({
      owner: user._id,
    });

    let getUnixTime = subscription.currentPeriodEnd.getTime() / 1000;

    if (amount === 1000) {
      subscription.plan = "premium";
      subscription.status = "active";
      subscription.frequency = "monthly";

      if (subscription.currentPeriodEnd < new Date()) {
        getUnixTime = new Date().getTime() / 1000;
      }

      const extendPeriod = getUnixTime + 2592000;

      subscription.currentPeriodEnd = new Date(
        extendPeriod * 1000
      ).toISOString();
    }

    if (amount === 9800) {
      subscription.plan = "premium";
      subscription.status = "active";
      subscription.frequency = "yearly";

      if (subscription.currentPeriodEnd < new Date()) {
        getUnixTime = new Date().getTime() / 1000;
      }

      const extendPeriod = getUnixTime + 31536000;

      subscription.currentPeriodEnd = new Date(
        extendPeriod * 1000
      ).toISOString();
    }

    user.stripeSubscriptionId = stripeSubscriptionId;
    user.stripeCustomerId = customer;
    user.stripePaymentMethodId = charge.payment_method;
    user.stripeCardBrand = card.brand;
    user.stripePaymentLast4 = card.last4;

    await user.save();
    await subscription.save();
  } catch (error) {
    console.log(error);
    return;
  }
};

exports.handleCompletedPayment = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      default:
        // console.log(`Unhandled event type ${event.type}`);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
