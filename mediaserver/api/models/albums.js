const mongoose = require('mongoose');

const albumsSchema = mongoose.Schema({
    _id: String,
    tracks: []
});

module.exports = mongoose.model('Albums', albumsSchema);