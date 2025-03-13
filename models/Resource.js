const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    author: { type: String, required: true },
    type: {
      type: String,
      enum: ["news", "article"],
      required: true,
    },
    causes: {
      type: String,
      default: "",  // Optional but helps prevent missing fields
    },
    diagnosis: {
      type: String,
      default: "",
    },
    treatment: {
      type: String,
      default: "",
    },
    exercise: {
      type: String,  // Stores a comma-separated list
      default: "",
    },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
  },
  { timestamps: { type: Date, default: Date.now } }
);

module.exports = mongoose.model("Resource", resourceSchema);
