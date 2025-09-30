const mongoose = require("mongoose");
const { Schema } = mongoose;

const stake2Schema = new Schema(
  {
    user: { type: String, required: true },
    amount: { type: Number, required: true },
    plan: { type: Number, required: true },
    investId: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "matured", "withdrawn"],
      default: "active",
    },
    txHash: { type: String, required: true },
    block: { type: Number, required: true },
  },
  { timestamps: true
  }
);

// Create indexes for unique fields
stake2Schema.index({ user: 1, txHash: 1 });
const stake2 = mongoose.model("stake2", stake2Schema);

module.exports = stake2;