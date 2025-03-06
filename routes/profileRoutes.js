const express = require("express");
const multer = require("multer");
const User = require("../models/User"); // Your User model
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Route to upload profile image
router.post("/api/profile/upload-profileImage", upload.single("profileImage"), async (req, res) => {
    try {
        const { userId } = req.body; // Get userId from request body
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user profile image
        user.profileImage = `/uploads/${req.file.filename}`;
        await user.save();

        // res.json({ message: "Profile image uploaded successfully", filePath: user.profileImage });
        res.json({
            message: "Profile image uploaded successfully",
            filePath: `https://authmern-backend-i3kc.onrender.com/uploads/${req.file.filename}`,
        });
        
    } catch (error) {
        console.error("Error uploading profile image:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
