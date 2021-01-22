const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    path: { type: String, required: true }
});

module.exports = mongoose.model('Files', trackSchema);