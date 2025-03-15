const express = require("express");
const { adminAuth } = require("../Middleware/authMiddleware");
const Resource = require("../models/Resource");
const User = require("../models/User");


const router = express.Router();

// ✅ Protect this route - only admins can add resources
router.post("/add-resource", adminAuth, async (req, res) => {
  try {
    const { title, content, author, type, causes, diagnosis, treatment, exercise } = req.body;

    const newResource = new Resource({
      title, 
      content, 
      author,
      type,
      causes, 
      diagnosis, 
      treatment, 
      exercise
    });

    await newResource.save();
    res.status(201).json({ message: "Resource added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding resource" });
  }
});


router.delete("/delete-resource/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the resource
        const deletedResource = await Resource.findByIdAndDelete(id);
        if (!deletedResource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Remove the deleted resource from all users' favorites
        await User.updateMany({}, { $pull: { favorites: id } });

        res.json({ message: "Resource deleted and removed from favorites" });
    } catch (error) {
        console.error("Error deleting resource:", error);
        res.status(500).json({ message: "Error deleting resource" });
    }
});

router.put("/edit-resource/:id", adminAuth, async (req, res) => {
  try {
      const { id } = req.params;
      const { title, content, author, type, causes, diagnosis, treatment, exercise } = req.body;

      // Find and update the resource
      const updatedResource = await Resource.findByIdAndUpdate(
          id,
          { title, content, author, type, causes, diagnosis, treatment, exercise },
          { new: true, runValidators: true }
      );

      if (!updatedResource) {
          return res.status(404).json({ message: "Resource not found" });
      }

      res.json({ message: "Resource updated successfully", resource: updatedResource });
  } catch (error) {
      console.error("Error updating resource:", error);
      res.status(500).json({ message: "Error updating resource" });
  }
});


module.exports = router;
