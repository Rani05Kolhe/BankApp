const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const User = require("../model/user.model");
const Loan = require("../model/loans.model");

// ---------------------------
// GENERIC CRUD
// ---------------------------
router.get("/", (req, res) => controller.getData(req, res, Loan));
router.post("/", async (req, res) => {
  try {
    const loan = await Loan.create(req.body);
    res.json({ message: "Loan created successfully", data: loan });
  } catch (err) {
    res.status(500).json({ message: "Unable to create loan", error: err.message });
  }
});
router.put("/:id", (req, res) => controller.updateData(req, res, Loan));
router.delete("/:id", (req, res) => controller.deleteData(req, res, Loan));

// ---------------------------
// CUSTOMER PROFILE
// ---------------------------
router.get("/customerpro/:id", async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await User.findById(customerId).lean();
    const loans = await Loan.find({ customerId }).lean();

    res.json({
      success: true,
      customer,
      loans,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching customer profile",
      error: err.message,
    });
  }
});

// ---------------------------
// PAY EMI
// ---------------------------
router.post("/pay-emi", async (req, res) => {
  try {
    const { loanId, amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // ❌ REMOVE this:
    // loan.paidAmount += Number(amount);

    // Add EMI to history with pending status
    loan.emiHistory.push({
      amount: Number(amount),
      paidAt: new Date(),
      adminStatus: "pending",
    });

    await loan.save();

    res.json({ success: true, message: "EMI added, pending confirmation" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error while paying EMI", error: err.message });
  }
});

// ---------------------------
// UPDATE EMI STATUS (Admin)
// ---------------------------
router.post("/emi-status", async (req, res) => {
  try {
    const { loanId, emiIndex, status } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ success: false, message: "Loan not found" });

    // Update adminStatus
    loan.emiHistory[emiIndex].adminStatus = status;

    // ✅ Only update paidAmount if confirmed
    if (status === "received") {
      loan.paidAmount += loan.emiHistory[emiIndex].amount;
    }

    await loan.save();

    res.json({ success: true, message: "EMI status updated", loan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});

// ---------------------------
// GET ALL LOANS
// ---------------------------
router.get("/all", async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/edit-emi", async (req, res) => {
  try {
    const { loanId, emiIndex, amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.emiHistory[emiIndex].amount = amount;
    await loan.save();

    res.json({ success: true, message: "EMI updated successfully", loan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
