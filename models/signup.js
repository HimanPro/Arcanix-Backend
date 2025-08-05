const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    index: true,
    unique: true
  }
});

module.exports = mongoose.model("Signup", signupSchema);
