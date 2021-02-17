const mongoose = require('mongoose');

const playlistsSchema = mongoose.Schema({
    _id: String,        // also name of the playlist
    tracks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tracks'}]
});

module.exports = mongoose.model('Playlists', playlistsSchema);