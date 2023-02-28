const { User } = require("../../models");

// @route   POST /api/user/health
// @desc    checks if users is logged in
// @access  Private
exports.checkHealth = async (req, res) => {
  try {
    console.log(req.user);
    return res.status(200).send("User is logged in.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/user
// @desc    Gets a user by id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).send("User not found.");

    if (user._id !== req.user._id) {
      return res.status(401).send("Unauthorized.");
    }

    // remove access tokens from the response
    user.twitterAccessToken = undefined;
    user.twitterAccessTokenSecret = undefined;

    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route PUT /api/user
// @desc Updates a user by id
// @access Private
exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route DELETE /api/user
// @desc Deletes a user by id
// @access Private
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
