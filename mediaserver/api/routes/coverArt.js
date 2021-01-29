const express = require('express');
const router = express.Router();
const mm = require('music-metadata');

const Tracks = require('../models/tracks');

// handle GET to /coverArt/:trackID
router.get('/:trackId', (req, res, next) => {
    const id = req.params.trackId;
    Tracks.findById(id)
        .then(track => {
            const filePath = track.path;
            mm.parseFile(filePath)
                .then(metadata => {
                    let imageData = metadata.common.picture;
                    res.status(200).json({
                        coverArt: imageData
                    });
                });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

module.exports = router;