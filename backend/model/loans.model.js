const mongo = require("mongoose");
const { Schema } = mongo;

const emiSchema = new Schema({
  amount: { type: Number, required: true },
  paidAt: { type: Date, default: Date.now },
  adminStatus: { type: String, default: "pending" },
});

const loansSchema = new Schema(
  {
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },

    loanType: String,
    loanAmount: Number,
    interest: Number,
    duration: Number,
    startDate: Date,
    endDate: Date,
    totalLoan: Number,

    paidAmount: { type: Number, default: 0 },

    emiHistory: [emiSchema],
  },
  { timestamps: true }
);

module.exports = mongo.model("loans", loansSchema);
