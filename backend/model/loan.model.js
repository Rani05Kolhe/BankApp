const mongo = require("mongoose");
const { Schema } = mongo;

const loanSchema = new Schema(
  {
    employeeId: String,
    employeeName: String,
    email: String,
    branch: String,
    loanType: String,
    loanAmount: Number,
    interest: Number,
    startDate: Date,
    endDate: Date,
    dob: Date,
    duration:Number,
    totalLoan: Number, 
  },
  { timestamps: true }
);

module.exports = mongo.model("loan", loanSchema);
