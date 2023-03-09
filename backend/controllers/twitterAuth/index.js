const jwt = require("jsonwebtoken");
const OAuth = require("oauth"),
  qs = require("querystring");
const { TwitterApi } = require("twitter-api-v2");
const Auth = OAuth.OAuth;
const { Subscription } = require("../../models");

const twitterConsumerKey = process.env.CONSUMER_KEY;
const twitterConsumerSecret = process.env.CONSUMER_SECRET;

const requestUrl = "https://twitter.com/oauth/request_token";
const accessUrl = "https://twitter.com/oauth/access_token";
const authorizeUrl = "https://twitter.com/oauth/authorize";

const { User } = require("../../models");

const oa = new Auth(
  requestUrl,
  accessUrl,
  twitterConsumerKey,
  twitterConsumerSecret,
  "2.0",
  null,
  "HMAC-SHA1"
);

// @route   GET /api/auth/twitter
// @desc    Sends the twitter oAuth redirect to the users browser
// @access  Public
exports.twitterUrl = async (req, res) => {
  try {
    oa.getOAuthRequestToken((e, requestToken) => {
      if (e) return res.status(400).send({ error: e.message });

      const authUrl =
        authorizeUrl + "?" + qs.stringify({ oauth_token: requestToken });

      return res.send(authUrl);
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};

// @route   POST /api/auth/connect-twitter
// @desc    Connects a users twitter account to the app
// @access  Private
exports.connectTwitter = async (req, res) => {
  try {
    // Handle the users Twitter login
    const { oauthToken, verifier } = req.body;

    if (!oauthToken || !verifier) {
      return res.status(400).send({
        error: "Invalid login attempt. Please try again.",
      });
    }

    const handleGetOAuthAccessToken = async (
      e,
      accessToken,
      accessTokenSecret
    ) => {
      if (e) {
        console.log(e);
        return res.status(400).send({ error: e.message });
      }

      // Login using app key and secret and verify using the users access and secret token
      const twitterClient = new TwitterApi({
        appKey: process.env.CONSUMER_KEY,
        appSecret: process.env.CONSUMER_SECRET,
        accessToken: accessToken,
        accessSecret: accessTokenSecret,
      });

      // Returns the users twitter name and ID
      const getCurrentUser = await twitterClient.v1.verifyCredentials({
        include_email: true,
        include_entities: false,
        skip_status: true,
      });

      if (!getCurrentUser) {
        return res.status(404).send({
          error: "Twitter not connected. Please try again.",
        });
      }

      const user = await User.findOne({
        _id: req.user._id,
      });

      if (!user) {
        return res.status(404).send({
          error: "User not found. Please try again.",
        });
      }

      // Update the users twitter info
      user.twitterId = getCurrentUser.id;
      user.twitterUsername = getCurrentUser.screen_name;
      user.twitterAccessToken = accessToken;
      user.twitterAccessTokenSecret = accessTokenSecret;
      await user.save();

      // remove the users access and secret token from the response
      user.twitterAccessToken = undefined;
      user.twitterAccessTokenSecret = undefined;

      const subscription = await Subscription.findOne({
        user: user._id,
      });

      if (!subscription) {
        return res.status(440).send({
          error: "Subscription not found. Please try again.",
        });
      }

      // Create a JWT token
      const token = jwt.sign(
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
          expiresIn: "7d",
        }
      );

      res.cookie(process.env.TOKEN_PSUEDO_NAME, token, {
        secure: process.env.NODE_ENV !== "development",
      });

      return res.send(user);
    };

    // Get the users access and secret token
    try {
      oa.getOAuthAccessToken(
        oauthToken,
        oauthToken,
        verifier,
        handleGetOAuthAccessToken
      );
    } catch (e) {
      console.log(e);
      return res.status(400).send({ error: e.message });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
};
