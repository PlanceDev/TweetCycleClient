const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const downloadAndUploadImages = async (T, attachments) => {
  const keys = attachments.map((attachment) => attachment.key);

  // Download all images from S3
  const downloads = await Promise.all(
    keys.map((key) =>
      s3
        .getObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
        })
        .promise()
    )
  );

  // Upload all images to Twitter media API
  const uploadPromises = downloads.map(async (download, index) => {
    const imageBuffer = download.Body;
    const imageType = download.ContentType;
    const imageExtension = imageType.split("/")[1];
    const imageName = uuid.v4() + "." + imageExtension;
    const imageLocation = path.join(__dirname, "temp", imageName);

    await fs.promises.writeFile(imageLocation, imageBuffer);

    const media = await T.v1.uploadMedia(imageLocation).catch((err) => {
      return fs.unlink(imageLocation, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });

    await fs.promises.unlink(imageLocation);

    // Update attachment object with media ID
    attachments[index].mediaId = media.id;

    return media;
  });

  const photos = await Promise.all(uploadPromises);

  return photos;
};

// Create initial tweet that will be used to reply to and create thread
const initialTweet = async (tweet, T) => {
  const photos = await downloadAndUploadImages(T, tweet.thread[0].attachments);

  const thread = await T.v1.tweet(tweet.thread[0].body, {
    media_ids: photos,
  });

  tweet.initialTweetId = thread.id_str;
  await tweet.save();

  return thread;
};

// Create thread of tweets
const handleTweet = async (tweet, T) => {
  let thread = await initialTweet(tweet, T);

  // Reply to tweets to create thread
  await Promise.all(
    tweet.thread.map(async (t, i) => {
      if (t.id === tweet.thread[0].id) return;

      const photos = await downloadAndUploadImages(T, t.attachments);

      const newThread = await T.v1.reply(t.body, thread.id_str, {
        media_ids: photos,
      });

      console.log(newThread.id_str);

      thread = newThread;
    })
  );

  tweet.status = "published";
  await tweet.save();
};

module.exports = {
  handleTweet,
};
