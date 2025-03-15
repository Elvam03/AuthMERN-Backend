const express = require("express");
const Facility = require("../models/Facilities");
const router = express.Router();


// Upload facility with image
router.get("/facilities", async (req, res) => {
    try {
        const { location } = req.query;
        const query = location ? { location } : {}; // Filter if location exists
        const facilities = await Facility.find(query);
        res.json(facilities);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch facilities" });
    }
});


module.exports = router;
