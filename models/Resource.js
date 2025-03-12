const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }, 
    category: { type: String, required: true }, // Example: "trends", "recovery"
    type: {
      type: String,
      enum: ["news", "article"], 
      required: true,
    },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
  },
  { timestamps: { type: Date, default: Date.now }}
);

module.exports = mongoose.model("Resource", resourceSchema);
