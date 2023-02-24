const cron = require("node-cron");
const { TwitterApi } = require("twitter-api-v2");
const { Tweet, User } = require("../models");

const { handleTweet } = require("./tweetFunctions");

// Run task every minute
exports.SendTweets = cron.schedule("* * * * *", async () => {
  try {
    const tweets = await Tweet.find({
      status: "scheduled",
      publishDate: { $lte: Date.now() },
    });

    if (!tweets || tweets.length <= 0) return;

    await Promise.all(
      tweets.map(async (tweet) => {
        const user = await User.findById(tweet.creator);

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
      })
    );
  } catch (error) {
    console.log(error);
  }
});
