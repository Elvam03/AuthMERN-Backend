const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post("/favorites/:resourceId", async (req, res) => {
    try {
      const userId = req.user.id; // Assuming authentication middleware sets `req.user`
      const { resourceId } = req.params;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
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

  router.delete("/favorites/:resourceId", async (req, res) => {
    try {
      const userId = req.user.id;
      const { resourceId } = req.params;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.favorites = user.favorites.filter((fav) => fav.toString() !== resourceId);
      await user.save();
  
      res.json({ message: "Resource removed from favorites", favorites: user.favorites });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  router.get("/favorites", async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate("favorites");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user.favorites);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  

module.exports = router;
