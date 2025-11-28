const Notes = require("../model/notes.model");
const express = require("express");
const router = express.Router();

// GET notes by customer id
router.get("/:id", async (req, res) => {
  try {
    const notes = await Notes.find({ customerId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching notes" });
  }
});

// Add new note
router.post("/", async (req, res) => {
  try {
    const newNote = new Notes(req.body);
    await newNote.save();
    res.json({ success: true, message: "Note added!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding note" });
  }
});

// Delete note
router.delete("/:noteId", async (req, res) => {
  try {
    await Notes.findByIdAndDelete(req.params.noteId);
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
});
router.put("/loan/confirm/:id", async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      {
        status: "Confirmed"
      },
      { new: true }
    );

    res.json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


module.exports = router;
