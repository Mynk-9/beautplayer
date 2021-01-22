const express = require('express');
const router = express.Router();
const Tracks = require('./../models/tracks');

// handle GET to /tracks
router.get('/', (req, res, next) => {
    Tracks.find()
        .exec()
        .then(tracks => {
            res.status(200).json({
                TrackList: tracks
            });
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
});

router.get('/:trackId', (req, res, next) => {
    const id = req.params.trackId;
    Tracks.findById(id)
        .then(track => {
            res.status(200).json({
                Track: track
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