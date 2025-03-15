const express = require("express");
const Advertisement = require("../models/ads");

const router = express.Router();

// GET all advertisements
router.get("/", async (req, res) => {
    try {
        const ads = await Advertisement.find();
        res.json(ads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new advertisement (Optional, for adding new ads)
router.post("/", async (req, res) => {
    const { title, link, image, description } = req.body;

    const newAd = new Advertisement({
        title,
        link,
        image,
        description,
    });

    try {
        const savedAd = await newAd.save();
        res.status(201).json(savedAd);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
