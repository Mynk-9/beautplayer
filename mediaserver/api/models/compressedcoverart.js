const mongoose = require('mongoose');

// here _id is the name of album

const compressedCoverArtSchema = mongoose.Schema({
    _id: String,
    base64: String
});

module.exports = mongoose.model('CompressedCoverArt', compressedCoverArtSchema);