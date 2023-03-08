const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// @route   POST /api/tweet-generator
// @desc    Generates tweets
// @access  Private
exports.generateTweets = async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const selectedStyle = req.body.selectedStyle;

    if (!prompt || !selectedStyle) {
      return res.status(400).send("Prompt and selected style is required");
    }

    if (prompt.length > 100) {
      return res.status(400).send("Prompt must be less than 100 characters");
    }

    if (selectedStyle.length === 0 || selectedStyle.length > 3) {
      return res.status(400).send("Please select 1-3 styles");
    }

    const newPrompt = `Please give me a ${selectedStyle} 
    tweet in the style of an expert in the field about ${prompt}.
    Given the style of the prompt think of the most influential person in the field that has a large cult following and mimick them.
    Be sure to make it as viral as possible.
    Be sure to make it seem like it is coming from the person you are in style of.
    Be sure to make it seem as though a person reading would want to retweet it.
    Be sure to make it seem as though a human wrote it.
    Do not explicitly say that you are an expert in the field.
    Do not include the persons name who it is in style of. 
    Only include the tweet body.
    Do not include quotes. Do not include ${prompt}.
    Make sure the tweet is less than 280 characters.`;

    const promises = Array(6)
      .fill()
      .map(async () => {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: newPrompt,
            },
          ],
        });

        return completion.data.choices[0].message.content
          .replace(/\n/g, "")
          .replace(/"/g, "");
      });

    const results = await Promise.all(promises);

    const tweets = results.map((text, index) => ({
      id: index,
      body: text,
    }));

    res.send(tweets);
  } catch (error) {
    console.log(error);
  }
};

// @route   POST /api/tweet-generator/improve
// @desc    Improves a tweet
// @access  Private
exports.improveTweet = async (req, res) => {
  try {
    if (req.user.status !== "active") {
      return res.status(402).send({
        error: "Your account must be active to improve a tweet.",
      });
    }

    if (!req.user.twitterId) {
      return res.status(401).send({
        error: "You must first connect your twitter account.",
      });
    }

    const prompt = req.body.body;

    const newPrompt = `Please improve this tweet and keep it under 280 characters: ${prompt}`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: newPrompt,
        },
      ],
    });

    const result = completion.data.choices[0].message.content
      .replace(/\n/g, "")
      .replace(/"/g, "");

    return res.send({ result });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Something went wrong" });
  }
};
