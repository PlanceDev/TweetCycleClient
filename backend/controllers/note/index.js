const { Note } = require("../../models");

// @route   POST api/note
// @desc    Create a note
// @access  Private
exports.createNote = async (req, res) => {
  try {
    const note = await Note.createNote(req.body, req.user._id);

    if (!note) {
      return res.status(404).json({ msg: "Note could not be created." });
    }

    return res.send({ note });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// @route   GET api/note
// @desc    Get all notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    return res.send({ message: "Not implemented yet." });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// @route   GET api/note/:id
// @desc    Get a single note by ID
// @access  Private
exports.getNoteById = async (req, res) => {
  try {
    return res.send({ message: "Not implemented yet." });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// @route   PUT api/note/:id
// @desc    Update a note
// @access  Private
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.updateNote(req.params.id, req.body, req.user._id);

    if (!note) {
      return res.status(404).json({ msg: "Note could not be updated." });
    }

    return res.send({ note });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// @route   DELETE api/note/:id
// @desc    Delete a note
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.deleteNote(req.params.id, req.user._id);

    if (!note) {
      return res.status(404).json({ msg: "Note could not be deleted." });
    }

    return res.send("Note deleted");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
