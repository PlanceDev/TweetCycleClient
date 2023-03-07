const { Lead, User } = require("../../models");
const { isEmpty } = require("lodash");

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.createLead(req.body, req.user._id);
    res.send({ lead });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// Get all leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ creator: req.user._id }).populate({
      path: "contacts",
      select: "_id name email phone createdAt",
      options: { sort: { createdAt: 1 } },
    });

    if (!leads) {
      return res.status(404).json({ msg: "User not found." });
    }

    return res.send({ leads });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      creator: req.user._id,
    })
      .populate({
        path: "tasks",
        select: "_id title description dueDate completed createdAt",
        options: { sort: { dueDate: 1 } },
      })
      .populate({
        path: "contacts",
        select: "_id name email phone createdAt",
        options: { sort: { createdAt: 1 } },
      })
      .populate({
        path: "notes",
        select: "_id title content createdAt",
        options: { sort: { createdAt: 1 } },
      });

    if (!lead) {
      return res.status(404).json({ msg: "Lead not found." });
    }

    res.send(lead);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  try {
    let lead;

    switch (req.body.type) {
      case "status":
        lead = await Lead.updateLeadStatus(
          req.params.id,
          req.body.status,
          req.user._id
        );

        res.send({ lead });
        break;

      default:
        return res.status(400).send("Invalid type");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!lead) {
      return res.status(404).send("Lead not found");
    }

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $pull: { leads: req.params.id } }
    );

    res.send("Lead deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = exports;
