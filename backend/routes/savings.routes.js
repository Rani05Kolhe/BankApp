const express = require("express");
const router = express.Router();
const SavingModel = require("../model/savings.model");

// ===============================
// GET SAVINGS BY CUSTOMER ID
// ===============================
router.get("/customer/:id", async (req, res) => {
  try {
    const savings = await SavingModel.find({ customerId: req.params.id });

    res.status(200).json({
      success: true,
      savings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching savings",
      error: err.message,
    });
  }
});

// ===============================
// CREATE SAVING
// ===============================
router.post("/", async (req, res) => {
  try {
    const saving = await SavingModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Saving record created",
      data: saving,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to create saving",
      error: err.message,
    });
  }
});

// ===============================
// GET ALL SAVINGS
// ===============================
router.get("/", async (req, res) => {
  try {
    const allSavings = await SavingModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: allSavings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch savings",
      error: err.message,
    });
  }
});

// ===============================
// GET SAVING BY ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const saving = await SavingModel.findById(req.params.id);

    if (!saving) {
      return res.status(404).json({
        success: false,
        message: "Saving not found",
      });
    }

    res.json({ success: true, data: saving });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch saving",
      error: err.message,
    });
  }
});

// ===============================
// UPDATE SAVING
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const updated = await SavingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Saving updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to update saving",
      error: err.message,
    });
  }
});

// ===============================
// DELETE SAVING
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await SavingModel.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Saving deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to delete saving",
      error: err.message,
    });
  }
});
router.get("/customer/:id", async (req, res) => {
  try {
    const savings = await SavingModel.find({ customerId: req.params.id });

    res.json({
      success: true,
      savings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching savings",
      error: err.message,
    });
  }
});


module.exports = router;
