const express = require("express");
const router = express.Router();
const { tweetGeneratorController } = require("../../controllers");

// @route   POST /api/tweet-generator
// @desc    Generates tweets
// @access  Private
router.post("/", tweetGeneratorController.generateTweets);

// @route   POST /api/tweet-generator/improve
// @desc    Improves a tweet
// @access  Private
router.post("/improve", tweetGeneratorController.improveTweet);

// @route   POST /api/tweet-generator/thread
// @desc    Generates a thread
// @access  Private
router.post("/thread", tweetGeneratorController.generateThread);

module.exports = router;
