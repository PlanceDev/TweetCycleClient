const { Contact, User } = require("../../models");
const { isEmpty } = require("lodash");

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.createContact(req.body, req.user._id);

    if (!contact) {
      return res.status(400).send({ msg: "Contact not created." });
    }

    res.send({ contact });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await User.findById(req.user._id).populate({
      path: "contacts",
      options: {
        limit: 10,
        sort: { createdAt: -1 },
        skip: (req.query.page - 1) * 10,
      },
    });

    if (!contacts) {
      return res.status(404).json({ msg: "User not found." });
    }

    return res.send(contacts.contacts);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found." });
    }

    res.send(contact);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a contact
exports.updateContact = async (req, res) => {
  try {
    let updates = {};
    const query = { _id: req.params.id, creator: req.user._id };
    const options = { new: true };

    // Only update the fields that were passed in
    if (!isEmpty(req.body.name)) updates.name = req.body.name;
    if (!isEmpty(req.body.email)) updates.email = req.body.email;
    if (!isEmpty(req.body.phone)) updates.phone = req.body.phone;
    if (!isEmpty(req.body.title)) updates.title = req.body.title;
    if (!isEmpty(req.body.company)) updates.company = req.body.company;

    const contact = await Contact.findOneAndUpdate(query, updates, options);

    if (!contact) {
      return res.status(404).send("Contact not found");
    }

    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!contact) {
      return res.status(404).send("Contact not found");
    }

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $pull: { contacts: req.params.id } }
    );

    res.send("Contact deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = exports;
