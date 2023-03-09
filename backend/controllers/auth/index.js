const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const {
  User,
  VerificationToken,
  Subscription,
  RefreshToken,
} = require("../../models");
const {
  sendAccountVerificationEmail,
  sendResetPasswordEmail,
} = require("../../utils");

// @route   POST /api/auth/register
// @desc    Registers a new user
// @access  Public
exports.register = async (req, res) => {
  try {
    const user = await User.register(req.body);

    await Subscription.createSubscription(user._id, "trial", "monthly");

    const verificationToken = await VerificationToken.generateToken(user._id);

    await sendAccountVerificationEmail(
      user.firstName,
      user.email,
      verificationToken.token
    );

    return res.send({ message: user }).status(201);
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   POST /api/auth/login
// @desc    Logs in a user
// @access  Public
exports.login = async (req, res) => {
  try {
    const user = await User.login(req.body.email, req.body.pw);

    const subscription = await Subscription.findOne({ owner: user._id });

    const accessToken = jwt.sign(
      {
        _id: user._id,
        twitterId: user.twitterId || null,
        twitterUsername: user.twitterUsername || null,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        twitterId: user.twitterId || null,
        twitterUsername: user.twitterUsername || null,
        plan: subscription.plan,
        status: subscription.status,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_EXPIRES_IN,
      }
    );

    // Save refresh token to database
    await RefreshToken.createRefreshToken(user._id, refreshToken);

    res.cookie("refresh_token", refreshToken, {
      secure: process.env.NODE_ENV !== "development",
    });

    return res.send({
      accessToken,
      user: user.toObject(),
      subscription,
    });
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   POST /api/auth/refresh-token
// @desc    Refreshes a users access token
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refresh_token || req.cookie || req.body.refresh_token;

    if (!refreshToken) {
      return res.status(440).send({
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    // check the database to see if refresh token is still in the database
    const isValidRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });

    if (!isValidRefreshToken) {
      return res.status(440).send({
        error: "Unauthorized",
        message: "Invalid token",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          return res.status(440).send({
            error: "Unauthorized",
            message: "Invalid token",
          });
        }

        const user = await User.findById(decoded._id);
        const subscription = await Subscription.findOne({ owner: user._id });

        if (!user) {
          return res.status(440).send({
            error: "Unauthorized",
            message: "Invalid token",
          });
        }

        const accessToken = jwt.sign(
          {
            _id: user._id,
            twitterId: user.twitterId || null,
            twitterUsername: user.twitterUsername || null,
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        return res.send({ accessToken });
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   GET /api/auth/logout
// @desc    Logs out a user
// @access  Public
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(440).send({
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          return res.status(440).send({
            error: "Unauthorized",
            message: "Invalid token",
          });
        }

        await RefreshToken.deleteRefreshToken(decoded._id, refreshToken);

        res.clearCookie("refresh_token");

        return res.send({ message: "Logged out" });
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   POST /api/auth/verify-email
// @desc    Verifies a users email address
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const verificationToken = await VerificationToken.checkToken(
      req.body.token
    );

    await User.verifyEmail(verificationToken.owner);

    return res.send({ message: "Email verified" });
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   POST /api/auth/resend-email
// @desc    Resends a verification email
// @access  Public
exports.resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(200).send({ message: "Email sent" });

    const verificationToken = await VerificationToken.generateToken(user._id);

    await sendAccountVerificationEmail(
      user.firstName,
      user.email,
      verificationToken.token
    );

    return res.send({ message: "Email sent" });
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   POST /api/auth/forgot-password
// @desc    Resets a users password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const verificationToken = await VerificationToken.generateToken(
      req.body.email
    );

    await sendResetPasswordEmail(req.body.email, verificationToken.token);

    return res.send({ message: "Email sent" });
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   PUT /api/auth/reset-password
// @desc    Resets a users password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const token = await VerificationToken.checkToken(req.body.token);

    await User.resetPassword(token.owner, req.body.pw, req.body.confirmPw);

    await VerificationToken.deleteOne({ token: token.token });

    return res.send({ message: "Password reset" });
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};
