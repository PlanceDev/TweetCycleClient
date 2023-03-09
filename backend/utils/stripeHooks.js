const stripe = require("stripe")(process.env.STRIPE_LIVE_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const { Subscription, User } = require("../models");

// Handle the invoice payment succeeded event
const handleInvoicePaymentSucceeded = async (invoicePaymentSucceeded) => {
  try {
    // Extract subscription ID, customer, and amount from the event data
    const stripeSubscriptionId = invoicePaymentSucceeded.subscription;
    const customer = invoicePaymentSucceeded.customer;
    const amount = invoicePaymentSucceeded.subtotal_excluding_tax;

    // Retrieve charge information from Stripe API
    const charge = await stripe.charges.retrieve(
      invoicePaymentSucceeded.charge
    );
    const card = charge.payment_method_details.card;

    // Find the user and subscription related to the event
    const user = await User.findOne({ stripeCustomerId: customer });
    const subscription = await Subscription.findOne({
      owner: user._id,
    });

    // Calculate the Unix timestamp for the end of the current subscription period
    let getUnixTime = subscription.currentPeriodEnd.getTime() / 1000;

    // Update the subscription details based on the amount paid
    if (amount === 1000) {
      subscription.plan = "premium";
      subscription.status = "active";
      subscription.frequency = "monthly";

      // If the current period has already ended, start the subscription immediately
      if (subscription.currentPeriodEnd < new Date()) {
        getUnixTime = new Date().getTime() / 1000;
      }

      // Calculate the Unix timestamp for the end of the next subscription period
      const extendPeriod = getUnixTime + 2592000;

      // Update the subscription period end date
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

    // Update the user's payment and subscription details
    user.stripeSubscriptionId = stripeSubscriptionId;
    user.stripeCustomerId = customer;
    user.stripePaymentMethodId = charge.payment_method;
    user.stripeCardBrand = card.brand;
    user.stripePaymentLast4 = card.last4;

    // Save the updated user and subscription objects
    await user.save();
    await subscription.save();
  } catch (error) {
    console.log(error);
    return;
  }
};

// Handle the completed payment webhook event
exports.handleCompletedPayment = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      // Construct the Stripe event object from the webhook payload
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event based on its type
    switch (event.type) {
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      default:
        // Handle unhandled event types here
        // console.log(`Unhandled event type ${event.type}`);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
