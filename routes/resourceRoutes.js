const express = require("express");
const Resource = require("../models/Resource");
const User = require("../models/User");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const { title, content, author, category, type } = req.body;

        const newResource = new Resource({ title, content, author, category, type });
        await newResource.save();

        res.status(201).json({ message: "Resource added successfully", resource: newResource });
    } catch (error) {
        res.status(500).json({ error: "Failed to add resource" });
    }
});


// ✅ Add a resource to favorites
router.post("/favorites/:resourceId", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { resourceId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Ensure resource exists before adding
        const resource = await Resource.findById(resourceId);
        if (!resource) return res.status(404).json({ message: "Resource not found" });

        if (!user.favorites.includes(resourceId)) {
            user.favorites.push(resourceId);
            await user.save();
        }

        res.json({ message: "Resource added to favorites", favorites: user.favorites });
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get user's favorite resources
router.get("/favorites", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("Fetching favorites for user:", userId); // Debugging

        const user = await User.findById(userId).populate("favorites");

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ favorites: user.favorites });
    } catch (error) {
        console.error("Error retrieving favorites:", error.stack);
        res.status(500).json({ message: "Server error", error: error.stack });
    }
});

// Remove a resource from favorites
router.delete("/favorites/:resourceId", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;  // Get user ID from token
        const { resourceId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

         // Check if resource is already a favorite
         const index = user.favorites.indexOf(resourceId);
         if (index === -1) {
             user.favorites.push(resourceId); // Add to favorites
         } else {
             user.favorites.splice(index, 1); // Remove from favorites
         }
        await user.save();

        res.json({ message: "Resource removed from favorites", favorites: user.favorites });
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 }); // Fetch resources without userId
        res.status(200).json(resources);
    } catch (error) {
        console.error("Error fetching resources:", error.message);
        res.status(500).json({ error: "Failed to fetch resources", details: error.message });
    }
});


// ✅ Get user-specific resources
router.get("/user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userResources = await Resource.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(userResources);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user resources" });
    }
});

// ✅ Get only News & Blogs
router.get("/news", async (req, res) => {
    try {
        const newsResources = await Resource.find({ type: { $in: ["news", "blog"] } }).sort({ createdAt: -1 });
        res.status(200).json(newsResources);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch news/blog" });
    }
});

// ✅ Get only Articles
router.get("/articles", async (req, res) => {
    try {
        const articles = await Resource.find({ type: "article" }).sort({ createdAt: -1 });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch articles" });
    }
});

module.exports = router;
