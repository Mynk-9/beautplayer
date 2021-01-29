const mongoose = require('mongoose');

/**
 * Basically a collection of {trackID, playlistName} which can be queried later
 * to group by playlists.
 */

const playlistTracksSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    trackId: { type: mongoose.Schema.Types.ObjectId, required: true },
    playlistName: { type: String, required: true },
    playlistName_lower: String
});

playlistTracksSchema.index({ trackId: 1, playlistName_lower: 1 }, { unique: true });

module.exports = mongoose.model('PlaylistTracks', playlistTracksSchema);