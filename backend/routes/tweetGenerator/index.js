const express = require("express");
const router = express.Router();
const { tweetGeneratorController } = require("../../controllers");

router.post("/", tweetGeneratorController.generateTweets);

module.exports = router;
