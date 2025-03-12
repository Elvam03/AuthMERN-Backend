const express = require("express");
const { adminAuth } = require("../Middleware/authMiddleware");
const Resource = require("../models/Resource");

const router = express.Router();

// ✅ Protect this route - only admins can add resources
router.post("/add-resource", adminAuth, async (req, res) => {
  try {
    const { title, content, author, category, type } = req.body;

    const newResource = new Resource({
      title, 
      content, 
      author,
      category,
      type,
    });

    await newResource.save();
    res.status(201).json({ message: "Resource added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding resource" });
  }
});

router.delete("/delete-resource/:id", adminAuth, async (req, res) => {
    try {
      await Resource.findByIdAndDelete(req.params.id);
      res.json({ message: "Resource deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting resource" });
    }
  });
  

module.exports = router;
