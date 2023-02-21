const express = require("express");
const router = express.Router();
const { tweetController } = require("../../controllers");

// @route   POST /api/tweet
// @desc    Creates a new tweet
// @access  Private
router.post("/", tweetController.createTweet);

// @route   GET /api/tweet
// @desc    Gets all tweets
// @access  Private
router.get("/", tweetController.getTweets);

// @route   GET /api/tweet/:id
// @desc    Gets a tweet by id
// @access  Private
router.get("/:id", tweetController.getTweetById);

// @route   PUT /api/tweet/:id
// @desc    Updates a tweet by id
// @access  Private
router.put("/:id", tweetController.updateTweetById);

// @route   DELETE /api/tweet/:id
// @desc    Deletes a tweet by id
// @access  Private
router.delete("/:id", tweetController.deleteTweetById);

module.exports = router;
