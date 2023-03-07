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
    Be sure to make it as viral as possible.
    Be sure to make it seem like it is coming from the person you are in style of.
    Be sure to make it seem as though a person would want to retweet it.
    Be sure to make it seem as though a human wrote it.
    Do not explicitly say that you are an expert in the field.
    Do not include hashtags or the persons name who it is in style of. 
    Only include the tweet body. Do not include hashtags. 
    Do not include quote symbols. Do not include ${prompt}.
    Do not include hashtags. Do not include quote symbols.
    Make sure the tweet is less than 280 characters.
    Do NOT under any circumstance include words starting with "#"`;

    const promises = Array(6)
      .fill()
      .map(async () => {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: newPrompt + "\n",
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        return completion.data.choices[0].text.replace(/\n/g, "");
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

    const newPrompt = `Please improve this tweet: ${prompt}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: newPrompt + "\n",
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const result = completion.data.choices[0].text.replace(/\n/g, "");

    return res.send({ result });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Something went wrong" });
  }
};
