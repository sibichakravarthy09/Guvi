const Lead = require("../models/Lead");

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads" });
  }
};

exports.addLead = async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    const newLead = await Lead.create({ name, email, phone, status });
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: "Error adding lead" });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Error updating lead" });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead" });
  }
};
