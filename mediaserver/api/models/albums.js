const mongoose = require('mongoose');

const albumsSchema = mongoose.Schema({
    _id: String,
    tracks: [],
    albumArtist: [],    // array so that if there are multiple album artists, they can be accommodated
    year: [],           // array so that if there are multiple album release years, they can be accommodated
    genre: String,
});

module.exports = mongoose.model('Albums', albumsSchema);