const cron = require("node-cron");
const { TwitterApi } = require("twitter-api-v2");
const { Tweet, User } = require("../models");

// Run task every minute
exports.SendTweets = cron.schedule("* * * * *", async () => {
  try {
    const tweets = await Tweet.find({
      status: "scheduled",
      publishDate: { $lte: Date.now() },
    });

    if (!tweets || tweets.length <= 0) return;

    tweets.forEach(async (tweet) => {
      const user = await User.findById(tweet.creator);

      if (!user) return res.status(404).send("User not found.");

      const T = new TwitterApi({
        appKey: process.env.CONSUMER_KEY,
        appSecret: process.env.CONSUMER_SECRET,
        accessToken: user.accessToken,
        accessSecret: user.accessSecret,
      });

      let thread = await T.v2.tweet(tweet.thread[0].body);

      for await (let t of tweet.thread) {
        if (t.id === tweet.thread[0].id) continue;

        let newThread = await T.v2.reply(t.body, thread.data.id);
        thread = newThread;
      }

      tweet.status = "published";
      await tweet.save();
    });
  } catch (error) {
    console.log(error);
  }
});
