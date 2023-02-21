const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../../middleware");
const { twitterAuthController } = require("../../controllers");

// @route   GET api/auth/connect-twitter
// @desc    Connects a users twitter account to the app
// @access  Public
router.post("/connect-twitter", twitterAuthController.connectTwitter);

// @route   GET api/auth/twitter-url
// @desc    Gets the twitter oAuth redirect url
// @access  Private
router.get("/twitter-url", twitterAuthController.twitterUrl);

module.exports = router;
