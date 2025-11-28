
const mongo = require("mongoose");
const { Schema } = mongo;


const savingsSchema = new Schema({
  customerId: String,
  customerName: String,
  amount: Number,
  interest: Number,
  duration: Number,
  totalSaving: Number,
  startDate: Date,
  endDate: Date,
  status: String,
});
module.exports = mongo.model("savings", savingsSchema);
