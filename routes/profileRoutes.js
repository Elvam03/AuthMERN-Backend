const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User"); // Your User model
const router = express.Router();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile_pictures", // Cloudinary folder
        format: async (req, file) => "jpg", // Convert all images to jpg
        public_id: (req, file) => Date.now() + "-" + file.originalname,
    },
});

const upload = multer({ storage });

// Route to upload profile image
router.post("/api/profile/upload-profileImage", upload.single("profileImage"), async (req, res) => {
    try {
        console.log("Uploaded file details:", req.file);  // Debugging
        console.log("Request body:", req.body); // Log userId

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user profile image with Cloudinary URL
        user.profileImage = req.file.path; 
        await user.save();

        res.json({
            message: "Profile image uploaded successfully",
            filePath: user.profileImage, // Cloudinary URL
        });

    } catch (error) {
        console.error("Error uploading profile image:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route to upload background image
router.post("/api/profile/upload-backgroundImage", upload.single("backgroundImage"), async (req, res) => {
    try {
        console.log("Uploaded file details:", req.file);  // Debugging
        console.log("Request body:", req.body); // Log userId

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user background image with Cloudinary URL
        user.backgroundImage = req.file.path;
        await user.save();

        res.json({
            message: "Background image uploaded successfully",
            filePath: user.backgroundImage, // Cloudinary URL
        });

    } catch (error) {
        console.error("Error uploading background image:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get user profile
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            firstName: user.firstName,
            secondName: user.secondName,
            email: user.email,
            age: user.age,
            phone: user.phone,
            location: user.location,
            profileImage: user.profileImage,
            backgroundImage: user.backgroundImage
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update user profile
router.put("/:userId", async (req, res) => {
    try {
        console.log("Received update request:", req.body); // Debugging line

        const { firstName, secondName, age, phone, location, profileImage, backgroundImage } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { 
                firstName,
                secondName,
                age, 
                phone, 
                location, 
                profileImage, 
                backgroundImage 
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update error:", error); // Debugging line
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
