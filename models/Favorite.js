const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    favorites: [{ type: String }] // Array of favorite resource IDs
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
