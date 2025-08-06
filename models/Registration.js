const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    index: true,
  },
  // uId: {
  //   type: String,
  //   required: true,
  //   index: true,
  // },
  referrer: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    index: true,
    unique: true
  },
  // rId: {
  //   type: String,
  //   index: true,
  // },
  txHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  block: {
    type: Number,
    required: true,
    index: true,
  },
  timestamp: {
    type: Number,
    required: true,
    index: true,
  },
  regfrom: {
    type: String
  },
});

module.exports = mongoose.model("Registration", registrationSchema);
