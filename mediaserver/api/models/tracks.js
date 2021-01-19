const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    album: { type: String, default: 'Single' },
    albumArtist: String,
    contributingArtists: String,
    year: Number,
    albumTrackNumber: Number,
    genre: String,
    length: { type: Number, required: true }
});

module.exports = mongoose.model('Track', trackSchema);