const { TwitterApi } = require("twitter-api-v2");
const { User } = require("../models");

const { handleTweet } = require("./tweetFunctions");

// Run task every minute
exports.tweetNow = async (tweet, creator) => {
  try {
    if (!tweet || tweet.length <= 0) return;

    const user = await User.findById(creator);

    if (!user) {
      throw new Error("User not found.");
    }

    const T = new TwitterApi({
      appKey: process.env.CONSUMER_KEY,
      appSecret: process.env.CONSUMER_SECRET,
      accessToken: user.twitterAccessToken,
      accessSecret: user.twitterAccessTokenSecret,
    });

    await handleTweet(tweet, T);
  } catch (error) {
    console.log(error);
  }
};
