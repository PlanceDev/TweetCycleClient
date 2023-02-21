const fs = require("fs");
const path = require("path");
const { Tweet } = require("../../models");
const uuid = require("uuid");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// @route   POST /api/tweet
// @desc    Creates a new tweet
// @access  Private
exports.createTweet = async (req, res) => {
  try {
    if (!req.user.twitterId) {
      return res
        .status(401)
        .send({ error: "You must first connect your twitter account." });
    }

    // Validate the request body
    let isValidDate = true;

    let publishDate =
      req.body.type === "schedule-tweet" ? req.body.publishDate : Date.now();

    if (req.body.type === "schedule-tweet" && publishDate) {
      isValidDate = new Date(publishDate) > Date.now() + 1000 * 60 * 5;
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
      status: req.body.type === "draft" ? "draft" : "scheduled",
    });

    for await (const thread of req.body.thread) {
      let newThread = {
        id: thread.id,
        body: thread.body,
        attachments: [],
      };

      let uploadPromises = [];

      for await (const attachment of thread.attachments) {
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

        // Write file to disk and upload to S3
        uploadPromises.push(
          new Promise((resolve, reject) => {
            fs.writeFile(filePath, imageBuffer, (err) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                // upload file to s3
                const params = {
                  Bucket: process.env.S3_BUCKET_NAME,
                  Key: fileName,
                  Body: fs.createReadStream(filePath),
                  ACL: "public-read",
                };

                s3.upload(params, (err, data) => {
                  if (err) {
                    reject(err);
                  } else {
                    newThread.attachments.push({
                      key: fileName,
                      name: attachment.name.replace(/\s/g, "_").toLowerCase(),
                      url: data.Location,
                    });
                    console.log(
                      `File uploaded successfully. File URL: ${data.Location}`
                    );
                    fs.unlinkSync(filePath);
                    resolve();
                  }
                });
              }
            });
          })
        );
      }

      // Wait for all file uploads to complete
      await Promise.all(uploadPromises);

      tweet.thread.push(newThread);
    }

    // Save the new tweet to the database
    await tweet.save();

    return res.send({ tweet }).status(201);
  } catch (e) {
    console.log(e);
    return res.status(e.status || 500).send({ error: e.message });
  }
};

// @route   GET /api/tweet
// @desc    Gets all tweets
// @access  Private
exports.getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({ creator: req.user._id });

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
    const tweet = await Tweet.updateTweetById(req.params.id, req.body);

    return res.send({ tweet });
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
