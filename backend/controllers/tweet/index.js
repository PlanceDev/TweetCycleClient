const fs = require("fs");
const path = require("path");
const { Tweet, User, Subscription } = require("../../models");
const uuid = require("uuid");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const { tweetNow } = require("../../utils/tweetNow");

// Uploads an attachment or list of attachments to S3
const uploadToS3 = async (attachment) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: attachment.key,
    Body: attachment.buffer,
    ACL: "public-read",
    ContentType: `image/${attachment.ext}`,
  };

  await s3.upload(params).promise();
};

const removeFromS3 = async (key) => {
  if (!key) return;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };

  await s3.deleteObject(params).promise();
};

// @route   POST /api/tweet
// @desc    Creates a new tweet
// @access  Private
exports.createTweet = async (req, res) => {
  try {
    if (req.user.status !== "active") {
      return res
        .status(402)
        .send({ error: "Your account must be active to create a tweet." });
    }

    if (!req.user.twitterId) {
      return res
        .status(401)
        .send({ error: "You must first connect your twitter account." });
    }

    // Validate the request body
    let isValidDate = true;

    const publishDate =
      req.body.type === "schedule-tweet" ? req.body.publishDate : Date.now();

    if (req.body.type === "schedule-tweet" && publishDate) {
      isValidDate = new Date(publishDate) > Date.now() - 1000 * 60 * 5;
    }

    const isValidThread = req.body.thread.every(
      (thread) => thread.body.length > 0
    );

    const correctAttachmentCount = req.body.thread.every(
      (thread) => thread.attachments.length <= 4
    );

    if (!isValidThread || !correctAttachmentCount || !isValidDate) {
      return res.status(400).send({ error: "Invalid thread" });
    }

    // Create a new tweet
    const tweet = new Tweet({
      _id: req.body._id,
      creator: req.user._id,
      publishDate: publishDate,
      thread: [],
      status: req.body.type !== "schedule-tweet" ? "draft" : "scheduled",
    });

    const attachments = [];

    // Iterate over the threads using async iteration
    for await (const thread of req.body.thread) {
      const newThread = {
        id: thread.id,
        body: thread.body,
        attachments: [],
      };

      // Iterate over the attachments using async iteration
      await Promise.all(
        thread.attachments.map(async (attachment) => {
          if (!attachment.b64) return;

          // check if file type is allowed
          const ext = attachment.name.split(".").pop();

          const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

          if (!allowedExtensions.includes(ext)) {
            return res.status(400).send({ error: "Invalid file type" });
          }

          // Set file name and path
          const fileName = `${uuid.v4()}.${ext}`;
          const imageBuffer = Buffer.from(attachment.b64, "base64");
          const filePath = path.join(__dirname, "uploads", fileName);

          // Add attachment to list for parallel upload
          attachments.push({
            filePath,
            key: fileName,
            name: attachment.name.replace(/\s/g, "_").toLowerCase(),
            ext,
            buffer: imageBuffer,
          });

          // Add attachment to list for parallel upload
          newThread.attachments.push({
            key: fileName,
            name: attachment.name.replace(/\s/g, "_").toLowerCase(),
            url: null,
          });
        })
      );

      tweet.thread.push(newThread);
    }

    // Upload all attachments to S3 in parallel
    await Promise.all(
      attachments.map(async (attachment) => {
        await uploadToS3(attachment);
        // fs.unlink(attachment.filePath);
      })
    );

    // Save the new tweet to the database
    await tweet.save();

    // If the tweet is tweet now, tweet it immediately
    if (req.body.type === "tweet-now") {
      await tweetNow(tweet, req.user._id);
    }

    return res.send({ tweet }).status(201);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Something went wrong" });
  }
};

// @route   GET /api/tweet/:status
// @desc    Gets all tweets
// @access  Private
exports.getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({
      creator: req.user._id,
      status: req.params.status,
    });

    return res.send({ tweets });
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   GET /api/tweet/:id
// @desc    Gets a tweet by id
// @access  Private
exports.getTweetById = async (req, res) => {
  try {
    return res.status(401).send({ message: "Not implemented" });

    const tweet = await Tweet.getTweetById(req.params.id);

    return res.send({ tweet });
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   PUT /api/tweet/:id
// @desc    Updates a tweet by id
// @access  Private
exports.updateTweetById = async (req, res) => {
  try {
    const tweet = await Tweet.findOne({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!tweet) {
      return res.status(404).send({ error: "Tweet not found" });
    }

    const isValidDate =
      new Date(req.body.publishDate) > Date.now() - 1000 * 60 * 5;

    const isValidThread = req.body.thread.every(
      (thread) => thread.body.length > 0
    );

    const correctAttachmentCount = req.body.thread.every(
      (thread) => thread.attachments.length <= 4
    );

    if (!isValidThread || !correctAttachmentCount || !isValidDate) {
      return res
        .status(400)
        .send({ error: "Invalid thread please check dates and thread body" });
    }

    tweet.publishDate = req.body.publishDate;
    tweet.thread = req.body.thread;

    // Remove images that were deleted by the user
    if (req.body.removedImages) {
      for (const key of req.body.removedImages) {
        tweet.thread.forEach((thread) => {
          thread.attachments = thread.attachments.filter(
            (attachment) => attachment.key !== key
          );
        });
      }

      await tweet.save();

      await Promise.all(
        req.body.removedImages.map(async (key) => {
          await removeFromS3(key);
        })
      );
    }

    // Add new images
    if (req.body.newImages) {
      const attachments = [];

      for (const image of req.body.newImages) {
        const ext = image.name.split(".").pop();
        const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

        if (!allowedExtensions.includes(ext)) {
          return res.status(400).send({ error: "Invalid file type" });
        }

        const fileName = `${uuid.v4()}.${ext}`;
        const imageBuffer = Buffer.from(image.b64, "base64");
        const filePath = path.join(__dirname, "uploads", fileName);

        attachments.push({
          filePath,
          key: fileName,
          name: image.name.replace(/\s/g, "_").toLowerCase(),
          ext,
          buffer: imageBuffer,
          thread: image.thread,
        });
      }

      await Promise.all(
        attachments.map(async (attachment) => {
          await uploadToS3(attachment);
          tweet.thread[attachment.thread].attachments.push({
            key: attachment.key,
            name: attachment.name,
          });
        })
      );
    }

    // remove attachements without keys (newly added images)
    // TODO: fix this hack later on (maybe) (maybe not) (probably not) (definitely not) (maybe)
    tweet.thread = tweet.thread.map((thread) => ({
      ...thread,
      attachments: thread.attachments.filter((attachment) => attachment.key),
    }));

    await tweet.save();

    res.send(tweet);
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   DELETE /api/tweet/:id
// @desc    Deletes a tweet by id
// @access  Private
exports.deleteTweetById = async (req, res) => {
  try {
    await Tweet.deleteTweet(req.user._id, req.params.id);

    return res.send({ message: "Tweet deleted" });
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};
