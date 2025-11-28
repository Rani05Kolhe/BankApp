const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const loanSchema = require("../model/loan.model");

router.get("/" ,(req,res) => {
       controller.getData(req,res,loanSchema);
});


router.post("/" ,(req,res) => {
       controller.createData(req,res,loanSchema);
});

router.put("/:id" ,(req,res) => {
       controller.updateData(req,res,loanSchema);
});

router.delete("/:id" ,(req,res) => {
       controller.deleteData(req,res,loanSchema);
});

router.get("/:id", (req, res) => {
  const loanId = req.params.id;
  res.json({ message: `User with ID ${loanId} found successfully!` });
});



// ---------------------------
// PAY EMI (Customer)
// ---------------------------
router.post("/pay-emi", async (req, res) => {
  try {
    const { loanId, amount } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.paidAmount += Number(amount);

    loan.emiHistory.push({
      amount: Number(amount),
      paidAt: new Date(),
      adminStatus: "pending",
    });

    await loan.save();

    res.json({ success: true, message: "EMI Paid Successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error while paying EMI",
      error: err.message,
    });
  }
});

// ---------------------------
// ADMIN CONFIRM EMI
// ---------------------------
router.post("/emi-status", async (req, res) => {
  try {
    const { loanId, emiIndex, status } = req.body;

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    loan.emiHistory[emiIndex].adminStatus = status;
    await loan.save();

    res.json({
      success: true,
      message: "EMI status updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating status",
      error: err.message,
    });
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

module.exports = router;
