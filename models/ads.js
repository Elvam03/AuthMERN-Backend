const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);
module.exports = Advertisement;
