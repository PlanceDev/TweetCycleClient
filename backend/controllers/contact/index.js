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
    const contacts = await Contact.getContacts(req.user._id);

    if (!contacts) {
      return res.status(400).json({ msg: "Couldn't retreive contacts." });
    }

    return res.send({ contacts });
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
    const contact = await Contact.updateContact(
      req.params.id,
      req.body,
      req.user._id
    );

    if (!contact) {
      return res.status(404).send("Contact not found");
    }

    return res.send({ contact });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.deleteContact(
      req.params.id,
      req.user._id
    );

    if (!deletedContact) {
      return res.status(404).send("Contact not found");
    }

    res.send("Contact deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = exports;
