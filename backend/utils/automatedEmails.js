const nodemailer = require("nodemailer");

// Create a transporter to send emails with nodemailer using gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: process.env.NODE_ENV !== "development",
  auth: {
    user: "jeremy@tweetcycle.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Send verification email to user when they sign up for an account or change their email address
exports.sendAccountVerificationEmail = async (firstName, email, token) => {
  try {
    const mailOptions = {
      from: {
        name: "Tweet Cycle Support",
        address: "jeremy@tweetcycle.com",
      },
      to: email,
      subject: `Tweet Cycle account verification`,
      html: `<h1>Welcome, ${firstName}! Please verify your Tweet Cycle account</h1>
        <p>Click the link below to verify your account.</p>
        <a href="${process.env.PRODUCTION_URL}/auth/verify-email?token=${token}">Verify Account</a>`,
    };

    transporter.sendMail(mailOptions).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
};

// Send password reset email to user when they request a password reset
exports.sendResetPasswordEmail = async (email, token) => {
  try {
    const mailOptions = {
      from: {
        name: "Tweet Cycle Support",
        address: "jeremy@tweetcycle.com",
      },
      to: email,
      subject: "Reset your Tweet Cycle password",
      html: `<h1>Reset your Tweet Cycle password</h1>
        <p>Please click the link below to reset your password.</p>
        <a href="${process.env.PRODUCTION_URL}/auth/reset-password?token=${token}">Reset Password</a>`,
    };

    transporter.sendMail(mailOptions).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
};