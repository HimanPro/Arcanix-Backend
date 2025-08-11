const mongoose = require("mongoose");

const ConfigsSchema = new mongoose.Schema({
  lastSyncBlock: { type: Number, required: true },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("confiig", ConfigsSchema);
