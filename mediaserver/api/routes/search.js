const express = require('express');
const router = express.Router();
const Tracks = require('./../models/tracks');

// handle GET to /tracks
router.get('/:query', (req, res, next) => {
    const query = req.params.query;
    console.log('query:', query);
    Tracks.find({
        $text: {
            $search: query
        }
    })
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

module.exports = router;