const mongoose = require("mongoose");
const uuid = require("uuid");

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const tweetSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuid.v4,
      required: true,
    },
    creator: {
      type: String,
      required: true,
      ref: "User",
    },
    publishDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    thread: [
      {
        id: Number,
        body: String,
        attachments: [
          {
            key: String,
            name: String,
          },
        ],
      },
    ],
    status: {
      type: String,
      enum: ["published", "draft", "scheduled"],
      default: "draft",
    },
    initialTweetId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// @route   DELETE /api/tweet/:id
// @desc    Deletes a tweet
// @access  Private
tweetSchema.statics.deleteTweet = async function (creator, _id) {
  const tweet = await this.findOne({ _id, creator });

  if (!tweet) {
    throw new Error("Tweet not found");
  }

  const deletePromises = [];

  // Delete attachments from S3
  tweet.thread.forEach((thread) => {
    thread.attachments.forEach((attachment) => {
      deletePromises.push(
        new Promise((resolve, reject) => {
          const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: attachment.key,
          };

          s3.deleteObject(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        })
      );
    });
  });

  await Promise.all(deletePromises);

  await tweet.remove();

  return tweet;
};

exports.Tweet = mongoose.model("Tweet", tweetSchema);
