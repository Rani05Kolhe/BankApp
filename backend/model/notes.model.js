const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  note: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notes", NotesSchema);
