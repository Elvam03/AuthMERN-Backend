const express = require("express");
const router = express.Router();
const Facility = require("../models/Facilities");
const { adminAuth } = require("../Middleware/authMiddleware");


// Get all facilities
router.get("/facilities", async (req, res) => {
    try {
        const facilities = await Facility.find();
        res.json(facilities);
    } catch (error) {
        res.status(500).json({ error: "Error fetching facilities" });
    }
});

// Add new facility
router.post("/upload/facilities", adminAuth, async (req, res) => {
    try {
        const newFacility = new Facility(req.body);
        await newFacility.save();
        res.status(201).json(newFacility);
    } catch (error) {
        res.status(500).json({ error: "Error adding facility" });
    }
});

// Update facility
router.put("/upload/facilities/:id", adminAuth, async (req, res) => {
    try {
        const updatedFacility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFacility);
    } catch (error) {
        res.status(500).json({ error: "Error updating facility" });
    }
});

// Delete facility
router.delete("/facilities/:id", adminAuth, async (req, res) => {
    try {
        await Facility.findByIdAndDelete(req.params.id);
        res.json({ message: "Facility deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting facility" });
    }
});

module.exports = router;
