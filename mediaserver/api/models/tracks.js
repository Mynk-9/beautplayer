const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    title: { type: String, required: true },
    album: { type: String }, //default: 'Single' },
    // default removes as this would create problem in album art generation/storage
    albumArtist: String,
    contributingArtists: [],
    year: Number,
    genre: [],
    label: [],
    trackXofY: {},
    diskXofY: {},

    length: { type: Number, required: true },
    sampleRate: Number,
    channelCount: Number,
    codec: String,
    lossless: Boolean,

    musicbrainz_trackid: String,

    path: { type: String, required: true },
});

module.exports = mongoose.model('Tracks', trackSchema);