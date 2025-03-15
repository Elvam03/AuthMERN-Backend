const express = require("express");
const router = express.Router();
const { upload, cloudinary } = require("../cloudinary");
const FacilityAd = require("../models/ads");
const { adminAuth } = require("../Middleware/authMiddleware");


// Upload Advertisement (Image + Details)
router.post("/upload/ads", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, link, description } = req.body;
    const imageUrl = req.file.path; // Cloudinary URL

    const newAd = new FacilityAd({
      title,
      link,
      description,
      image: imageUrl,
    });

    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Ads
router.get("/ads", async (req, res) => {
  try {
    const ads = await FacilityAd.find();
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an Ad
router.put("/upload/ads/:id", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, link, description } = req.body;
    const ad = await FacilityAd.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    if (req.file) {
      // Delete old image from Cloudinary
      const oldImagePublicId = ad.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(oldImagePublicId);

      ad.image = req.file.path; // Set new image URL
    }

    ad.title = title || ad.title;
    ad.link = link || ad.link;
    ad.description = description || ad.description;

    await ad.save();
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an Ad
router.delete("/upload/ads/:id", adminAuth, async (req, res) => {
  try {
    const ad = await FacilityAd.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Delete image from Cloudinary
    const imagePublicId = ad.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imagePublicId);

    await ad.deleteOne();
    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
