const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model("Facilities", FacilitySchema);

